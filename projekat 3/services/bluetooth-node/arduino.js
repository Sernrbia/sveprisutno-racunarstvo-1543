const Nano33BLE = require("@vliegwerk/arduino-nano-33-ble");
const mqtt = require("mqtt");
const client = mqtt.connect("mqtt://test.mosquitto.org");

const nano33ble = new Nano33BLE({
  enable: [
    "accelerometer",
    // "gyroscope",
    "pressure",
    "temperature",
    "magnetometer"
  ]
});

// nano33ble.characteristics.accelerometer.properties.push("BLERead");
nano33ble.characteristics.accelerometer.uuid =
  "19b10010-e8f2-537e-4f6c-d104768a1214";
// nano33ble.characteristics.accelerometer.structure = ["String"];
nano33ble.characteristics.pressure.uuid =
  "19b10010-e8f2-537e-4f6c-d104768a1215";
nano33ble.characteristics.temperature.uuid =
  "19b10010-e8f2-537e-4f6c-d104768a1217";
nano33ble.characteristics.magnetometer.uuid =
  "19b10010-e8f2-537e-4f6c-d104768a1216";

// console.log(nano33ble.characteristics.accelerometer);

nano33ble.connect().then((connected) => {
  if (!connected) {
    console.log("Unable to connect to Nano 33 BLE service");
  }
});

nano33ble.on("connected", (id) => {
  console.log(`Connected to ${id}`);

  nano33ble.on("accelerometer", (data) => {
    console.log("Accelerometer:", data);

    client.publish("accelerometer", JSON.stringify(data));
  });

  nano33ble.on("pressure", (data) => {
    console.log("pressure:", data);

    client.publish("pressure", JSON.stringify(data));
  });

  nano33ble.on("temperature", (data) => {
    console.log("temperature:", data);

    client.publish("temperature", JSON.stringify(data));
  });

  nano33ble.on("magnetometer", (data) => {
    console.log("magnetometer:", data);

    client.publish("magnetometer", JSON.stringify(data));
  });
});

nano33ble.on("error", (err) => {
  console.error(err);
});

nano33ble.on("disconnected", (id) => {
  console.log(`Disconnected from ${id}`);
});
