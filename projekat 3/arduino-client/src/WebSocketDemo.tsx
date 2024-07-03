import { useState, useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";

interface AccelerometerData {
  x: number;
  y: number;
  z: number;
}

export const WebSocketDemo = () => {
  //Public API that will echo messages sent to it back to the client
  const socketUrl = "http://127.0.0.1:5001";
  const [messageHistory, setMessageHistory] = useState<AccelerometerData[]>([]);

  const { lastMessage, readyState } = useWebSocket(socketUrl);

  useEffect(() => {
    if (lastMessage !== null) {
      const sensorData = JSON.parse(lastMessage.data);
      console.log(sensorData);

      setMessageHistory([
        ...messageHistory,
        {
          x: sensorData.x,
          y: sensorData.y,
          z: sensorData.z
        }
      ]);
    }
  }, [lastMessage]);

  const connectionStatus = {
    [ReadyState.CONNECTING]: "Connecting",
    [ReadyState.OPEN]: "Open",
    [ReadyState.CLOSING]: "Closing",
    [ReadyState.CLOSED]: "Closed",
    [ReadyState.UNINSTANTIATED]: "Uninstantiated"
  }[readyState];

  return (
    <div>
      <span>
        The WebSocket is currently: <span>{connectionStatus}</span>
      </span>
      {lastMessage ? (
        <span>
          <br />
          Last message: {lastMessage.data}
        </span>
      ) : null}
      <ul>
        {messageHistory.map((entry, id) => (
          <div
            key={id}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: 15
            }}
          >
            <h5
              style={{
                color: "red"
              }}
            >
              X:{" "}
            </h5>
            {entry.x},{" "}
            <h5
              style={{
                color: "green"
              }}
            >
              Y:{" "}
            </h5>
            {entry.y},{" "}
            <h5
              style={{
                color: "rgb(0, 200, 255)"
              }}
            >
              Z:{" "}
            </h5>
            {entry.z}
            <br />
          </div>
        ))}
      </ul>
    </div>
  );
};
