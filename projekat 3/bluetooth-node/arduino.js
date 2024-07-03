const Nano33BLE = require("@vliegwerk/arduino-nano-33-ble");
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

const WebSocket = require("ws");
let data = "Here comes the data";
const wss = new WebSocket.Server({ port: 5001 });
var msg;

wss.on("connection", function connection(ws) {
  ws.on("message", function incoming(message) {
    msg = message;
    console.log("received: %s", msg);
    wss.clients.forEach(function (client) {
      if (client.readyState == WebSocket.OPEN) {
        client.send(msg);
      }
    });
  });

  const nano33ble = new Nano33BLE({
    enable: ["accelerometer"]
  });

  // nano33ble.characteristics.accelerometer.properties.push("BLERead");
  nano33ble.characteristics.accelerometer.uuid =
    "19b10010-e8f2-537e-4f6c-d104768a1214";
  // nano33ble.characteristics.accelerometer.structure = ["String"];

  // console.log(nano33ble.characteristics.accelerometer);

  nano33ble.connect().then((connected) => {
    if (!connected) {
      console.log("Unable to connect to Nano 33 BLE service");
    }
  });

  nano33ble.on("connected", (id) => {
    console.log(`Connected to ${id}`);

    nano33ble.on("accelerometer", (data) => {
      // console.log("Accelerometer:", data);

      // client.publish("accelerometer", JSON.stringify(data));
      ws.send(JSON.stringify(data));

      data = JSON.stringify(data);
    });
  });

  nano33ble.on("error", (err) => {
    console.error(err);
  });

  nano33ble.on("disconnected", (id) => {
    console.log(`Disconnected from ${id}`);
  });

  // setInterval(() => {
  //   ws.send(data);
  // }, 5000);
});

// const net = require("net");
// const PORT = 5000;
// const ADDRESS = "127.0.0.1";

// let server = net.createServer(onClientConnected);
// server.listen(PORT, ADDRESS);

// function onClientConnected(socket) {
//   console.log(`New client: ${socket.remoteAddress}:${socket.remotePort}`);
//   socket.destroy();
// }

// console.log(`Server started at: ${ADDRESS}:${PORT}`);

// function onClientConnected(socket) {
//   let clientName = `${socket.remoteAddress}:${socket.remotePort}`;
//   console.log(`${clientName} connected.`);
//   socket.on("data", (data) => {
//     let m = data.toString().replace(/[\n\r]*$/, "");
//     var d = { msg: { info: m } };

//     console.log(`${clientName} said: ${m}`);
//     socket.write(`We got your message (${m}). Thanks!\n`);
//   });

//   socket.on("end", () => {
//     console.log(`${clientName} disconnected.`);
//   });
// }

// MQTT

client.on("connect", () => {
  client.subscribe("accelerometer", (err) => {
    if (!err) {
      client.publish("presence", "Hello mqtt");
    }
  });
});

client.on("message", (topic, message) => {
  // message is Buffer
  // console.log(message.toString());
  // client.end();
});

// const nano33ble = new Nano33BLE({
//   enable: ["accelerometer"]
// });

// // nano33ble.characteristics.accelerometer.properties.push("BLERead");
// nano33ble.characteristics.accelerometer.uuid =
//   "19b10010-e8f2-537e-4f6c-d104768a1214";
// // nano33ble.characteristics.accelerometer.structure = ["String"];

// // console.log(nano33ble.characteristics.accelerometer);

// nano33ble.connect().then((connected) => {
//   if (!connected) {
//     console.log("Unable to connect to Nano 33 BLE service");
//   }
// });

// nano33ble.on("connected", (id) => {
//   console.log(`Connected to ${id}`);

//   nano33ble.on("accelerometer", (data) => {
//     // console.log("Accelerometer:", data);

//     client.publish("accelerometer", JSON.stringify(data));
//     data = JSON.stringify(data);
//   });
// });

// nano33ble.on("error", (err) => {
//   console.error(err);
// });

// nano33ble.on("disconnected", (id) => {
//   console.log(`Disconnected from ${id}`);
// });
