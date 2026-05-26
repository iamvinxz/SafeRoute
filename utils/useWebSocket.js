import { api } from "@/redux/APIService";
import { updateSosAlertStatus } from "@/states/sosAlertSlice";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      //for enable sos
      if (data.type === "sos_toggle") {
        dispatch(api.util.invalidateTags(["Me"]));
      }

      //for new segment
      if (data.type === "flood_segment") {
        dispatch(api.util.invalidateTags(["FloodSegments"]));
      }

      //pin location
      if (data.type === "flood_pin") {
        dispatch(api.util.invalidateTags(["PinnedLocations"]));
      }

      if (data.type === "delete_segment") {
        dispatch(api.util.invalidateTags(["FloodSegments"]));
      }

      if (data.type === "delete_pin") {
        dispatch(api.util.invalidateTags(["PinnedLocations"]));
      }

      //update status
      if (data.type === "sos_status_update") {
        const { status, id } = data.data;
        const stored = await AsyncStorage.getItem("activeSos");

        if (stored) {
          const { sosId } = JSON.parse(stored);

          if (sosId === id.toString()) {
            dispatch(updateSosAlertStatus(status));

            await AsyncStorage.setItem(
              "activeSos",
              JSON.stringify({ sosId, status }),
            );

            if (status === "resolved" || status === "cancelled") {
              await AsyncStorage.removeItem("activeSos");
            }
          }
        }
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
