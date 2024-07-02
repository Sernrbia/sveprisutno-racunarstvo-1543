const Nano33BLE = require("@vliegwerk/arduino-nano-33-ble");
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
    console.log("Accelerometer:", data);
  });

  nano33ble.on("gyroscope", (data) => {
    console.log("Gyroscope:", data);
  });

  nano33ble.on("magnetometer", (data) => {
    console.log("Magnetometer:", data);
  });
});

nano33ble.on("error", (err) => {
  console.log("odje");
  console.error(err);
});

nano33ble.on("disconnected", (id) => {
  console.log(`Disconnected from ${id}`);
});
