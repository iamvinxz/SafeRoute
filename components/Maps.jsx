import Flyto from "@/components/FlyTo";
import { useGetTinajerosQuery } from "@/redux/GeoJsonService";
import {
  useGetAllPinnedLocationsQuery,
  useGetAllSegmentsQuery,
} from "@/redux/mapMarkers";
import { landMarks } from "@/utils/landMark";
import getLeafletHTML from "@/utils/leafletHTML";
import { pinIcon } from "@/utils/svgIcons";
import { webViewStyles } from "@/utils/webViewStyles";
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
  const pinnedLocationRef = useRef(null);
  const injectLayersRef = useRef(null);
  const injectSegmentsRef = useRef(null);
  const injectPinnedLocationRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(null);

  //rtk query
  const { data: Tinajeros } = useGetTinajerosQuery();
  const { data: segmentsObj } = useGetAllSegmentsQuery();
  const { data: pinnnedLocations } = useGetAllPinnedLocationsQuery();

  TinajerosRef.current = Tinajeros;
  segmentsRef.current = segmentsObj?.segments;
  pinnedLocationRef.current = pinnnedLocations?.pins;

  // geojson and landmarks
  injectLayersRef.current = () => {
    if (!TinajerosRef.current || !webViewRef.current) return;

    webViewRef.current.injectJavaScript(`
      (function() {
        if (window.geojsonLayer) {
          window.geojsonLayer.clearLayers();
          window.geojsonLayer.addData(${JSON.stringify(TinajerosRef.current)});
        } else {
          window.geojsonLayer = L.geoJSON(${JSON.stringify(TinajerosRef.current)}, {
            style: {
              color: 'blue',
              weight: 1,
              fillColor: "lightblue",
              fillOpacity: 0.2
            },
          }).addTo(map);
        }

        if (window.geojsonLayer.getBounds && window.geojsonLayer.getBounds().isValid()) {
          map.fitBounds(window.geojsonLayer.getBounds());
        }

        if (!window.landmarkLayerGroup) {
          window.landmarkLayerGroup = L.layerGroup().addTo(map);
        }
        window.landmarkLayerGroup.clearLayers();
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
            .addTo(window.landmarkLayerGroup)
            .bindPopup(lm.name);
          window.landmarkMarkers.push(marker);
        });

        if (!window.zoomEventAttached) {
          map.on('zoomend', function() {
            window.ReactNativeWebView.postMessage(
              JSON.stringify({ type: 'zoom', value: map.getZoom() })
            );
          });
          window.zoomEventAttached = true;
        }

        window.ReactNativeWebView.postMessage(
          JSON.stringify({ type: 'zoom', value: map.getZoom() })
        );
      })();
      true;
    `);
  };

  // segments
  injectSegmentsRef.current = () => {
    if (!segmentsRef.current || !webViewRef.current) return;

    const style = webViewStyles.segment;
    const depthColors = JSON.stringify(style.depthColors);

    webViewRef.current.injectJavaScript(`
    (function() {
      if (!window.segmentsLayer) {
        window.segmentsLayer = L.layerGroup().addTo(map);
      } else {
        window.segmentsLayer.clearLayers();
      }

      const depthColorsMap = ${depthColors};
      function getDepthColors(depth) {
        return depthColorsMap[(depth || "").toLowerCase()] || depthColorsMap.default;
      }

      const segments = ${JSON.stringify(segmentsRef.current)};
      segments.forEach(function(segment) {
        const polyline = L.polyline(segment.coords, {
          color: 'red', weight: 4, opacity: 0.8, smoothFactor: 1
        }).addTo(window.segmentsLayer);

        const report = segment.floodReport;
        if (!report) { polyline.bindPopup("No report available"); return; }

        const streetName = report.streetName || "Unknown Street";
        const titleSize = streetName.length > 10 ? "${style.titleSizes.small}" : streetName.length > 8 ? "${style.titleSizes.medium}" : "${style.titleSizes.large}";
        const depthColor = getDepthColors(report.floodDepth);
        const date = new Date(report.createdAt).toLocaleDateString("en-US", {
          month: "long", day: "numeric", year: "numeric",
          hour: "numeric", minute: "2-digit", hour12: true
        });

        const popup = \`
          <div style="${style.container}">
            <div style="${style.header}">
              <span style="${style.titleBase} font-size:\${titleSize};">\${streetName}</span>
              <span style="${style.badge} \${depthColor.badge} \${depthColor.text}">\${report.floodDepth || ""}</span>
            </div>
            \${report.description ? \`<span style="${style.description}">\${report.description}</span>\` : ""}
            <p style="${style.date}">\${date}</p>
          </div>
        \`;

        polyline.bindPopup(popup, { maxWidth: 300, className: "custom-popup" });
      });
    })();
    true;
  `);
  };

  //pinned locations
  injectPinnedLocationRef.current = () => {
    if (!pinnedLocationRef.current || !webViewRef.current) return;

    const containerStyle = webViewStyles.popup.container;
    const descriptionStyle = webViewStyles.popup.description;
    const dateStyle = webViewStyles.popup.date;
    const columnStyle = webViewStyles.popup.column;

    webViewRef.current.injectJavaScript(`
    (function() {
      if (!window.pinLayer) {
        window.pinLayer = L.layerGroup().addTo(map);
      } else {
        window.pinLayer.clearLayers();
      }

      const pins = ${JSON.stringify(pinnedLocationRef.current)};
      pins.forEach(function(pin) {

        // pin icon
        const pinMarker = L.divIcon({
          html: '${pinIcon.replace(/'/g, "\\'")}',
          className: "",
          iconSize: [22, 22],
          iconAnchor: [12, 20],
          popupAnchor: [0, -32]
        });

        const titleSize = pin.pinName.length > 20 ? "13px" : pin.pinName.length > 12 ? "15px" : "13px";

        const titleStyle = "font-weight:600; color:#303030; line-height:0.8; word-break:break-word; display:block; text-transform: capitalize; margin-bottom:2px; font-size:" + titleSize;

        const date = new Date(pin.createdAt).toLocaleDateString("en-US", {
          month: "long", day: "numeric", year: "numeric",
          hour: "numeric", minute: "2-digit", hour12: true
        });

        // pin popup
        const popup = \`
          <div style="${containerStyle}">
            <span style="\${titleStyle}">\${pin.pinName}</span>
            <div style="${columnStyle}">
              <span style="${descriptionStyle}">\${pin.description || ""}</span>
              <span style="${dateStyle}">\${date}</span>
            </div>
          </div>
        \`;

        const marker = L.marker([pin.coords[0], pin.coords[1]], { icon: pinMarker }).addTo(window.pinLayer);
        marker.bindPopup(popup, {
          maxWidth: 180,
          className: "custom-popup"
        });
      });
    })()
  `);
  };

  useEffect(() => {
    if (mapReadyRef.current && pinnnedLocations?.pins) {
      injectPinnedLocationRef.current?.();
    }
  }, [pinnnedLocations]);

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
          if (pinnedLocationRef.current) injectPinnedLocationRef.current?.();
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
