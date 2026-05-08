import Flyto from "@/components/FlyTo";
import { useGetTinajerosQuery } from "@/redux/GeoJsonService";
import { useGetAllSegmentsQuery } from "@/redux/mapMarkers";
import { landMarks } from "@/utils/landMark";
import getLeafletHTML from "@/utils/leafletHTML";
import { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SvgXml } from "react-native-svg";
import { WebView } from "react-native-webview";

const leafletHTML = getLeafletHTML();

export default function Maps() {
  const webViewRef = useRef(null);
  const mapReadyRef = useRef(false);
  const TinajerosRef = useRef(null);
  const segmentsRef = useRef(null);
  const injectLayersRef = useRef(null);
  const injectSegmentsRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(null);

  const { data: Tinajeros } = useGetTinajerosQuery();
  const { data: segmentsObj } = useGetAllSegmentsQuery();

  TinajerosRef.current = Tinajeros;
  segmentsRef.current = segmentsObj?.segments;

  // Always up-to-date function, re-assigned every render
  injectLayersRef.current = () => {
    const data = TinajerosRef.current;
    if (!data || !webViewRef.current) return;

    webViewRef.current.injectJavaScript(`
      (function() {
        if (window.geojsonLayer) window.geojsonLayer.remove();
        window.geojsonLayer = L.geoJSON(${JSON.stringify(data)}, {
          style: {
            color: 'blue',
            weight: 1,
            fillColor: "lightblue",
            fillOpacity: 0.2
          },
          onEachFeature: function(feature, layer) {
            if (feature.properties && feature.properties.adm4_en) {
              layer.bindPopup(feature.properties.adm4_en);
            }
          }
        }).addTo(map);
        map.fitBounds(window.geojsonLayer.getBounds());

        if (window.landmarkMarkers) window.landmarkMarkers.forEach(m => m.remove());
        window.landmarkMarkers = [];

        const landmarks = ${JSON.stringify(landMarks)};
        landmarks.forEach(function(lm) {
          const decodedHTML = decodeURIComponent(escape(atob(lm.iconHTML)));
          const icon = L.divIcon({
            html: decodedHTML,
            className: "",
            iconAnchor: [13, 25],
            popupAnchor: [0, -40],
          });
          const marker = L.marker([lm.coordinates.lat, lm.coordinates.lng], { icon })
            .addTo(map)
            .bindPopup(lm.name);
          window.landmarkMarkers.push(marker);
        });

        map.on('zoomend', function() {
          window.ReactNativeWebView.postMessage(
            JSON.stringify({ type: 'zoom', value: map.getZoom() })
          );
        });

        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'zoom', value: map.getZoom() })
        );
      })();
      true;
    `);
  };

  // Always up-to-date function, re-assigned every render
  injectSegmentsRef.current = () => {
    if (!segmentsRef.current || !webViewRef.current) return;

    webViewRef.current.injectJavaScript(`
      (function() {
        if (window.segmentsLayer) window.segmentsLayer.remove();
        window.segmentsLayer = L.layerGroup().addTo(map);

        const segments = ${JSON.stringify(segmentsRef.current)};
        segments.forEach(function(segment) {
          const polyline = L.polyline(segment.coords, {
            color: 'red',
            weight: 4,
            opacity: 0.8,
            smoothFactor: 1
          }).addTo(window.segmentsLayer);
          polyline.bindPopup(segment.floodReport?.description ?? "Segment");
        });
      })();
      true;
    `);
  };

  // Inject segments when data arrives and map is ready
  useEffect(() => {
    if (mapReadyRef.current && segmentsObj?.segments) {
      injectSegmentsRef.current?.();
    }
  }, [segmentsObj]);

  // Inject layers when data arrives and map is ready
  useEffect(() => {
    if (mapReadyRef.current && Tinajeros) {
      injectLayersRef.current?.();
    }
  }, [Tinajeros]);

  // Handle messages from WebView
  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === "zoom") {
        setZoomLevel(data.value);
      }
    } catch (e) {
      console.error("WebView message error:", e);
    }
  };

  // Memoized WebView — onLoadEnd reads from refs so it always gets latest data/functions
  const webView = useMemo(
    () => (
      <WebView
        ref={webViewRef}
        originWhitelist={["*"]}
        source={{ html: leafletHTML }}
        style={styles.map}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        onMessage={onMessage}
        onLoadEnd={() => {
          mapReadyRef.current = true;
          if (TinajerosRef.current) injectLayersRef.current?.();
          if (segmentsRef.current) injectSegmentsRef.current?.();
        }}
      />
    ),
    [],
  );

  return (
    <View style={styles.container}>
      {webView}

      <View style={styles.zoomIndicator}>
        <Text style={styles.zoomText}>Zoom: {zoomLevel ?? "-"}</Text>
      </View>

      <View style={styles.mapHeader}>
        {landMarks.map((tab, index) => (
          <TouchableOpacity
            key={index}
            style={styles.mapTab}
            onPress={() =>
              Flyto({
                webViewRef,
                mapReady: mapReadyRef,
                lat: tab.coordinates.lat,
                lng: tab.coordinates.lng,
              })
            }
          >
            <SvgXml xml={tab.iconSVG} />
            <Text style={styles.mapTabText}>{tab.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: -40,
  },
  map: {
    flex: 1,
  },
  mapHeader: {
    position: "absolute",
    top: 45,
    left: 30,
    right: 30,
    flexDirection: "row",
    gap: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  mapTab: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  mapTabText: {
    fontSize: 9,
    fontFamily: "Montserrat",
  },
  zoomIndicator: {
    position: "absolute",
    bottom: 60,
    right: 15,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  zoomText: {
    fontSize: 12,
    fontFamily: "Montserrat",
  },
});
