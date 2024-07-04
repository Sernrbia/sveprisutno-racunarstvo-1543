const mqtt = require("mqtt");
// import {InfluxDB, Point} from '@influxdata/influxdb-client'
const InfluxDB = require("@influxdata/influxdb-client").InfluxDB;
const Point = require("@influxdata/influxdb-client").Point;

const token =
  "7v7EG1rsJjU19YeqgUYB_jOWZsYGLRnMcIwwAJt5_qi59ML-LRiLqcytBkRkENoOGcVFlj7J7XQmFbEuw6jvRw==";
const url = "http://influxdb:8086";

const influxDB = new InfluxDB({
  url,
  token
});

let org = `sernrbia`;
let bucket = `sveprisutno`;

let writeClient = influxDB.getWriteApi(org, bucket, "ns");

// for (let i = 0; i < 5; i++) {
//   let point = new Point("measurement1")
//     .tag("tagname1", "tagvalue1")
//     .floatField("temperature", i);

//   void setTimeout(() => {
//     writeClient.writePoint(point);
//   }, i * 1000); // separate points by 1 second

//   void setTimeout(() => {
//     writeClient.flush();
//   }, 5000);
// }

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
