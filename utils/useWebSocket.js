import { api } from "@/redux/APIService";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";

export const useWebSocket = () => {
  const dispatch = useDispatch();
  const wsRef = useRef(null);
  const reconnectTimeout = useRef(null);

  const connect = () => {
    const ws = new WebSocket(process.env.EXPO_PUBLIC_WS_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("WebSocket message:", data);

      if (data.type === "sos_toggle") {
        dispatch(api.util.invalidateTags(["Me"]));
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("WebSocket disconnected — reconnecting in 3s...");
      // reconnect after 3 seconds
      reconnectTimeout.current = setTimeout(() => {
        connect();
      }, 3000);
    };
  };

  useEffect(() => {
    connect();

    return () => {
      wsRef.current?.close();
      clearTimeout(reconnectTimeout.current);
    };
  }, []);
};
