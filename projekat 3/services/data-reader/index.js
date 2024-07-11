const mqtt = require("mqtt");
// import {InfluxDB, Point} from '@influxdata/influxdb-client'
const InfluxDB = require("@influxdata/influxdb-client").InfluxDB;
const Point = require("@influxdata/influxdb-client").Point;
const WebSocket = require("ws");
require("dotenv").config();

const token = process.env.INFLUXDB_TOKEN;
// ("H6x1WKiBEbLDYrT8P5bm4XRHG8UvbqQusVxj_Tdd9IvM9Tctq8axxvENwvCZlcpmtZx4vZY5Xb6-zXb7GzRPpA==");
const url = `http://influxdb:${process.env.INFLUXDB_PORT}`;

const influxDB = new InfluxDB({
  url,
  token
});

let org = `sernrbia`;
let bucket = `sveprisutno`;

const queryApi = influxDB.getQueryApi(org);
const fluxQuery = `from(bucket:"${bucket}") |> range(start: 0) |> filter(fn: (r) => r._measurement == "arduino")`;

let writeClient = influxDB.getWriteApi(org, bucket, "ns");

const wss = new WebSocket.Server({ port: 8090 });

var msg;

wss.on("connection", async function connection(ws) {
  ws.on("message", function incoming(message) {
    msg = message;
    console.log("received: %s", msg);
    wss.clients.forEach(function (client) {
      if (client.readyState == WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  for await (const { values, tableMeta } of queryApi.iterateRows(fluxQuery)) {
    const o = tableMeta.toObject(values);
    console.log(
      `${o._time} ${o._measurement} in '${o.location}' (${o.sensor_id}): ${o._field}=${o._value}`
    );

    ws.send(JSON.stringify(o));
  }
});

const client = mqtt.connect("mqtt://test.mosquitto.org");

client.on("connect", () => {
  console.log("Connection established");
  client.subscribe("accelerometer", (err) => {
    if (err != null) {
      console.error(err);
    }
  });
  client.subscribe("temperature", (err) => {
    if (err != null) {
      console.error(err);
    }
  });
  client.subscribe("pressure", (err) => {
    if (err != null) {
      console.error(err);
    }
  });
  client.subscribe("magnetometer", (err) => {
    if (err != null) {
      console.error(err);
    }
  });
});

client.on("message", (topic, message) => {
  // message is Buffer
  const data = JSON.parse(message.toString());
  console.log("DATA", data);

  if (data.temperatures == null && typeof data === "object") {
    const point = new Point("arduino");
    if (topic === "accelerometer") {
      point.tag("type", "accelerometer");
      point.floatField("x", data.x);
      point.floatField("y", data.y);
      point.floatField("z", data.z);
    } else if (topic === "temperature") {
      point.tag("type", "temperature");
      point.floatField("temperature", data.temperature);
    } else if (topic === "pressure") {
      point.tag("type", "pressure");
      point.floatField("pressure", data.pressure);
    } else {
      point.tag("type", "magnetometer");
      point.floatField("x", data.x);
      point.floatField("y", data.y);
      point.floatField("z", data.z);
    }
    writeClient.writePoint(point);
  }
});
