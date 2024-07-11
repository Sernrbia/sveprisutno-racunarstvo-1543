import useWebSocket, { ReadyState } from "react-use-websocket";

const formatTime = (time: Date): string =>
  `${time.getFullYear()}-${time.getMonth()}-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}.${time.getMilliseconds()}`;

const parseMessage = (message: MessageEvent): string => {
  const data = JSON.parse(message.data);
  const time = new Date(data._time);
  const obj = {
    time: formatTime(time),
    type: data.type,
    measurement: data._measurement,
    field: data._field,
    value: data._value
  };

  return JSON.stringify(obj);
};

const generateView = (message: MessageEvent, idx: number): JSX.Element => {
  const data = JSON.parse(message.data);
  return (
    <div
      key={idx}
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 15
      }}
    >
      {/* <span key={idx}>{message ? message.data : null}</span> */}
      Time:
      <h4>{data.time}</h4>
      Type:
      <h4
        style={{
          color: "cyan"
        }}
      >
        {data.type}
      </h4>
      Measurement:
      <h4>{data.measurement}</h4>
      Field:
      <h4>{data.field}</h4>
      Value:
      <h4>{data.value}</h4>
      <br />
    </div>
  );
};
const socketUrl = "http://127.0.0.1:8090";
const messages: MessageEvent[] = [];
export const WebSocketDemo = () => {
  const { lastMessage, readyState } = useWebSocket(socketUrl);

  if (lastMessage !== null) {
    const data = parseMessage(lastMessage);

    messages.unshift({
      ...lastMessage,
      data
    });
  }

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
          Last message: {parseMessage(lastMessage)}
        </span>
      ) : null}
      <ul>{messages.map((message, idx) => generateView(message, idx))}</ul>
    </div>
  );
};
