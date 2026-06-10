import Flyto from "@/components/FlyTo";
import SosModal from "@/components/SosModal";
import SosStatusModal from "@/components/SosStatusModal";
import { useGetMeQuery } from "@/redux/authService";
import { useGetTinajerosQuery } from "@/redux/GeoJsonService";
import {
  useGetAllPinnedLocationsQuery,
  useGetAllSegmentsQuery,
} from "@/redux/mapMarkers";
import { useLazyGetRouteQuery } from "@/redux/osrmService";
import { isOpen } from "@/states/modalSlice";
import { toggleShowModal } from "@/states/sosAlertSlice";
import { landMarks } from "@/utils/landMark";
import getLeafletHTML from "@/utils/leafletHTML";
import { pinIcon } from "@/utils/svgIcons";
import { useWebSocket } from "@/utils/useWebSocket";
import { webViewStyles } from "@/utils/webViewStyles";
import * as Location from "expo-location";
import { LayersPlus, X } from "lucide-react-native";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ActivityIndicator,
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SvgXml } from "react-native-svg";
import { WebView } from "react-native-webview";
import { useDispatch, useSelector } from "react-redux";

const leafletHTML = getLeafletHTML();

export default function Maps() {
  const dispatch = useDispatch();
  const webViewRef = useRef(null);
  const mapReadyRef = useRef(false);
  const TinajerosRef = useRef(null);
  const segmentsRef = useRef(null);
  const pinnedLocationRef = useRef(null);
  const injectLayersRef = useRef(null);
  const injectSegmentsRef = useRef(null);
  const injectPinnedLocationRef = useRef(null);
  const userLocationRef = useRef(null);
  const injectUserLocationRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(null);
  const [sosModalVisible, setSosModalVisible] = useState(false);
  const { status, showModal } = useSelector((state) => state.sosAlert);

  // Banner state — type: "avoided" | "no_route" | null
  const [routeBanner, setRouteBanner] = useState(null);
  const bannerAnim = useRef(new Animated.Value(0)).current;

  // Route loading state
  const [routeLoading, setRouteLoading] = useState(false);
  const [routeLoadingDest, setRouteLoadingDest] = useState(null);

  //rtk query
  const { data: Tinajeros } = useGetTinajerosQuery();
  const { data: segmentsObj } = useGetAllSegmentsQuery();
  const { data: pinnnedLocations } = useGetAllPinnedLocationsQuery();
  const { data: getMe } = useGetMeQuery();

  const [triggerGetRoute] = useLazyGetRouteQuery();

  useWebSocket();

  const isSosEnabled = getMe?.user?.isSosEnabled;
  userLocationRef.current = userLocation;
  TinajerosRef.current = Tinajeros;
  segmentsRef.current = segmentsObj?.segments;
  pinnedLocationRef.current = pinnnedLocations?.pins;
  const isSOSActive =
    status === "pending" || status === "dispatched" || status === "responded";

  const showBanner = (type, destName) => {
    setRouteBanner({ type, name: destName });
    Animated.spring(bannerAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  };

  const hideBanner = () => {
    Animated.timing(bannerAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start(() => setRouteBanner(null));
  };

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

          const safeName = lm.name.replace(/'/g, "\\'");
          const popupContent =
            '<div style="font-family:sans-serif; min-width:160px; padding:4px 2px;">' +
              '<div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">' +
                '<div style="width:6px; height:6px; border-radius:50%; background:#2563eb; flex-shrink:0;"></div>' +
                '<strong style="font-size:13px; color:#1a1a1a; line-height:1.2; word-break:break-word;">' + lm.name + '</strong>' +
              '</div>' +
              '<div style="height:1px; background:#f0f0f0; margin-bottom:8px;"></div>' +
              '<button onclick="window.ReactNativeWebView.postMessage(JSON.stringify({' +
                'type: \\'get_directions\\',' +
                'lat: ' + lm.coordinates.lat + ',' +
                'lng: ' + lm.coordinates.lng + ',' +
                'name: \\'' + safeName + '\\'' +
              '}))" style="display:flex; align-items:center; justify-content:center; gap:6px; background:#2563eb; color:white; border:none; padding:7px 12px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; width:100%; letter-spacing:0.3px;">' +
                '<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'13\\' height=\\'13\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'white\\' stroke-width=\\'2.5\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><polygon points=\\'3 11 22 2 13 21 11 13 3 11\\'></polygon></svg>' +
                'Get Directions' +
              '</button>' +
            '</div>';

          const marker = L.marker([lm.coordinates.lat, lm.coordinates.lng], { icon })
            .addTo(window.landmarkLayerGroup)
            .bindPopup(popupContent, { maxWidth: 200 });
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

  // pinned locations
  injectPinnedLocationRef.current = () => {
    if (!pinnedLocationRef.current || !webViewRef.current) return;

    webViewRef.current.injectJavaScript(`
    (function() {
      if (!window.pinLayer) {
        window.pinLayer = L.layerGroup().addTo(map);
      } else {
        window.pinLayer.clearLayers();
      }

      const pins = ${JSON.stringify(pinnedLocationRef.current)};
      pins.forEach(function(pin) {

        const pinMarker = L.divIcon({
          html: '${pinIcon.replace(/'/g, "\\'")}',
          className: "",
          iconSize: [22, 22],
          iconAnchor: [12, 20],
          popupAnchor: [0, -32]
        });

        const date = new Date(pin.createdAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
          hour: "numeric", minute: "2-digit", hour12: true
        });

        const safePinName = pin.pinName.replace(/'/g, "\\'");

        const popup =
          '<div style="font-family:sans-serif; min-width:160px; padding:4px 2px;">' +
            '<div style="display:flex; align-items:center; gap:6px; margin-bottom:6px;">' +
              '<div style="width:6px; height:6px; border-radius:50%; background:#e11d48; flex-shrink:0;"></div>' +
              '<strong style="font-size:13px; color:#1a1a1a; line-height:1.3; word-break:break-word; text-transform:capitalize;">' + pin.pinName + '</strong>' +
            '</div>' +
            (pin.description
              ? '<p style="font-size:11px; color:#555; margin:0 0 6px 0; line-height:1.4;">' + pin.description + '</p>'
              : '') +
            '<div style="display:flex; align-items:center; gap:4px; margin-bottom:10px;">' +
              '<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'10\\' height=\\'10\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'#999\\' stroke-width=\\'2\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><circle cx=\\'12\\' cy=\\'12\\' r=\\'10\\'></circle><polyline points=\\'12 6 12 12 16 14\\'></polyline></svg>' +
              '<span style="font-size:10px; color:#999;">' + date + '</span>' +
            '</div>' +
            '<div style="height:1px; background:#f0f0f0; margin-bottom:8px;"></div>' +
            '<button onclick="window.ReactNativeWebView.postMessage(JSON.stringify({' +
              'type: \\'get_directions\\',' +
              'lat: ' + pin.coords[0] + ',' +
              'lng: ' + pin.coords[1] + ',' +
              'name: \\'' + safePinName + '\\'' +
            '}))" style="display:flex; align-items:center; justify-content:center; gap:6px; background:#2563eb; color:white; border:none; padding:7px 12px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; width:100%; letter-spacing:0.3px;">' +
              '<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'13\\' height=\\'13\\' viewBox=\\'0 0 24 24\\' fill=\\'none\\' stroke=\\'white\\' stroke-width=\\'2.5\\' stroke-linecap=\\'round\\' stroke-linejoin=\\'round\\'><polygon points=\\'3 11 22 2 13 21 11 13 3 11\\'></polygon></svg>' +
              'Get Directions' +
            '</button>' +
          '</div>';

        const marker = L.marker([pin.coords[0], pin.coords[1]], { icon: pinMarker }).addTo(window.pinLayer);
        marker.bindPopup(popup, {
          maxWidth: 200,
          className: "custom-popup"
        });
      });
    })()
  `);
  };

  // user location marker inject function
  injectUserLocationRef.current = () => {
    if (!userLocationRef.current || !webViewRef.current) return;
    const { latitude, longitude } = userLocationRef.current;

    webViewRef.current.injectJavaScript(`
    (function() {
      const lat = ${latitude};
      const lng = ${longitude};

      const userIcon = L.divIcon({
        html: \`
          <div style="
            width: 18px; height: 18px;
            background: #2563eb;
            border: 3px solid white;
            border-radius: 50%;
            box-shadow: 0 0 0 4px rgba(37,99,235,0.3);
          "></div>
        \`,
        className: "",
        iconSize: [18, 18],
        iconAnchor: [9, 9],
        popupAnchor: [0, -12],
      });

      if (window.userLocationMarker) {
        window.userLocationMarker.setLatLng([lat, lng]);
      } else {
        window.userLocationMarker = L.marker([lat, lng], { icon: userIcon })
          .addTo(map)
          .bindPopup("You are here");
      }
    })();
    true;
  `);
  };

  useEffect(() => {
    if (mapReadyRef.current && userLocation) {
      injectUserLocationRef.current?.();
    }
  }, [userLocation]);

  useEffect(() => {
    if (mapReadyRef.current && pinnnedLocations?.pins) {
      injectPinnedLocationRef.current?.();
    }
  }, [pinnnedLocations]);

  useEffect(() => {
    if (mapReadyRef.current && segmentsObj?.segments) {
      injectSegmentsRef.current?.();
    }
  }, [segmentsObj]);

  useEffect(() => {
    if (mapReadyRef.current && Tinajeros) {
      injectLayersRef.current?.();
    }
  }, [Tinajeros]);

  useEffect(() => {
    let subscription;

    const startWatching = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status !== "granted") {
        const { status: newStatus } =
          await Location.requestForegroundPermissionsAsync();
        if (newStatus !== "granted") return;
      }

      const initial = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation(initial.coords);

      subscription = await Location.watchPositionAsync(
        { accuracy: Location.Accuracy.High, distanceInterval: 10 },
        (loc) => setUserLocation(loc.coords),
      );
    };

    startWatching();
    return () => subscription?.remove();
  }, []);

  const injectRoute = (routeData, destLat, destLng, destName) => {
    const { coordinates, distanceKm, durationMin, avoidedFlood } = routeData;

    webViewRef.current?.injectJavaScript(`
      (function() {
        if (window.routeLayer) {
          window.routeLayer.clearLayers();
        } else {
          window.routeLayer = L.layerGroup().addTo(map);
        }

        if (window.activeRouteMarker && window.activeRouteMarkerOriginalPopup) {
          window.activeRouteMarker.setPopupContent(window.activeRouteMarkerOriginalPopup);
          window.activeRouteMarker = null;
          window.activeRouteMarkerOriginalPopup = null;
        }

        const destLat = ${destLat};
        const destLng = ${destLng};
        const destName = '${destName}';
        const distanceKm = '${distanceKm}';
        const durationMin = '${durationMin}';
        const avoidedFlood = ${avoidedFlood ? "true" : "false"};
        const coords = ${JSON.stringify(coordinates)};

        L.polyline(coords, {
          color: "#2563eb",
          weight: 5,
          opacity: 0.85,
        }).addTo(window.routeLayer);

        const bounds = L.latLngBounds(coords);
        map.fitBounds(bounds, { padding: [40, 40] });

        const floodBadge = avoidedFlood
          ? '<div style="display:flex; align-items:center; gap:5px; background:#fef3c7; border:1px solid #fcd34d; border-radius:6px; padding:5px 8px; margin-bottom:8px; margin-left:12px;">' +
              '<span style="font-size:10px;">⚠️</span>' +
              '<span style="font-size:10px; color:#92400e; font-weight:600;">Route avoids flood areas</span>' +
            '</div>'
          : '';

        const clearPopupContent =
          '<div style="font-family:sans-serif; padding:4px 2px; min-width:160px;">' +
            '<div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">' +
              '<div style="width:6px; height:6px; border-radius:50%; background:#2563eb; flex-shrink:0;"></div>' +
              '<strong style="font-size:13px; color:#1a1a1a;">' + destName + '</strong>' +
            '</div>' +
            '<div style="display:flex; gap:10px; margin-bottom:6px; padding-left:12px;">' +
              '<span style="font-size:11px; color:#555;">📍 ' + distanceKm + ' km</span>' +
              '<span style="font-size:11px; color:#555;">🕐 ' + durationMin + ' min</span>' +
            '</div>' +
            floodBadge +
            '<div style="height:1px; background:#f0f0f0; margin-bottom:8px;"></div>' +
            '<button onclick="' +
              'window.routeLayer.clearLayers();' +
              'if(window.activeRouteMarker && window.activeRouteMarkerOriginalPopup){' +
                'window.activeRouteMarker.setPopupContent(window.activeRouteMarkerOriginalPopup);' +
                'window.activeRouteMarker=null;' +
                'window.activeRouteMarkerOriginalPopup=null;' +
              '}' +
              'map.closePopup();' +
              'window.ReactNativeWebView.postMessage(JSON.stringify({type:\\'clear_route\\'}));' +
            '" style="display:flex; align-items:center; justify-content:center; gap:5px; background:#ef4444; color:white; border:none; padding:7px 12px; border-radius:8px; font-size:12px; font-weight:600; cursor:pointer; width:100%;">' +
              'Clear Route' +
            '</button>' +
          '</div>';

        function findAndUpdateMarker(layerGroup) {
          if (!layerGroup) return false;
          let found = false;
          layerGroup.eachLayer(function(layer) {
            if (layer instanceof L.Marker) {
              const ll = layer.getLatLng();
              if (Math.abs(ll.lat - destLat) < 0.000001 && Math.abs(ll.lng - destLng) < 0.000001) {
                window.activeRouteMarker = layer;
                window.activeRouteMarkerOriginalPopup = layer.getPopup().getContent();
                layer.setPopupContent(clearPopupContent);
                layer.openPopup();
                found = true;
              }
            }
          });
          return found;
        }

        if (!findAndUpdateMarker(window.landmarkLayerGroup)) {
          findAndUpdateMarker(window.pinLayer);
        }
      })();
      true;
    `);
  };

  // Handle messages from WebView
  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);

      if (data.type === "zoom") {
        setZoomLevel(data.value);
      }

      if (data.type === "clear_route") {
        hideBanner();
      }

      if (data.type === "get_directions") {
        const userLoc = userLocationRef.current;
        if (!userLoc) return;

        hideBanner();

        const { lat: destLat, lng: destLng, name: destName } = data;
        const { latitude: userLat, longitude: userLng } = userLoc;

        setRouteLoading(true);
        setRouteLoadingDest(destName);

        triggerGetRoute({
          points: [
            [userLat, userLng],
            [destLat, destLng],
          ],
          mode: "driving",
          floodSegments: segmentsRef.current || [],
        }).then(({ data: routeData, error }) => {
          setRouteLoading(false);
          setRouteLoadingDest(null);

          if (error?.status === "NO_SAFE_ROUTE") {
            showBanner("no_route", destName);
            return;
          }

          if (error || !routeData) {
            console.error("OSRM route error:", error);
            return;
          }

          injectRoute(routeData, destLat, destLng, destName);

          if (routeData.avoidedFlood) {
            showBanner("avoided", destName);
          }
        });
      }
    } catch (e) {
      console.error("WebView message error:", e);
    }
  };

  const handleSendSOS = () => {
    setSosModalVisible(true);
  };

  // Memoized WebView
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
          if (userLocationRef.current) injectUserLocationRef.current?.();
        }}
      />
    ),
    [],
  );

  const bannerTranslateY = bannerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [120, 0],
  });

  const bannerConfig = {
    avoided: {
      bg: "#fffbeb",
      border: "#fcd34d",
      iconBg: "#fef3c7",
      emoji: "⚠️",
      titleColor: "#92400e",
      descColor: "#b45309",
      title: "Flood Areas Avoided",
      desc: (name) =>
        `A safe route to ${name} was found avoiding flooded streets.`,
    },
    no_route: {
      bg: "#fff1f2",
      border: "#fca5a5",
      iconBg: "#fee2e2",
      emoji: "🚫",
      titleColor: "#991b1b",
      descColor: "#b91c1c",
      title: "No Route Available",
      desc: (name) =>
        `All paths to ${name} are blocked by flooding. This area may be inaccessible right now.`,
    },
  };

  const cfg = routeBanner ? bannerConfig[routeBanner.type] : null;

  return (
    <View style={styles.container}>
      {webView}

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

      {/* Route loading pill */}
      {routeLoading && (
        <View style={styles.loadingPill}>
          <ActivityIndicator size="small" color="#2563eb" />
          <Text style={styles.loadingText} numberOfLines={1}>
            Finding route{routeLoadingDest ? ` to ${routeLoadingDest}` : ""}…
          </Text>
        </View>
      )}

      {/* Route status banner */}
      {routeBanner && cfg && (
        <Animated.View
          style={[
            styles.banner,
            {
              backgroundColor: cfg.bg,
              borderColor: cfg.border,
              transform: [{ translateY: bannerTranslateY }],
            },
          ]}
        >
          <View style={[styles.bannerIcon, { backgroundColor: cfg.iconBg }]}>
            <Text style={styles.bannerEmoji}>{cfg.emoji}</Text>
          </View>
          <View style={styles.bannerBody}>
            <Text style={[styles.bannerTitle, { color: cfg.titleColor }]}>
              {cfg.title}
            </Text>
            <Text
              style={[styles.bannerDesc, { color: cfg.descColor }]}
              numberOfLines={2}
            >
              {cfg.desc(routeBanner.name)}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.bannerClose}
            onPress={hideBanner}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <X size={16} color={cfg.titleColor} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {isSosEnabled && (
        <>
          {isSOSActive ? (
            <TouchableOpacity
              style={[styles.sosButton, styles.sosActiveButton]}
              onPress={() => dispatch(toggleShowModal())}
            >
              <Text style={styles.sosButtonText}>
                {showModal ? "Hide Status" : "SOS Status"}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.sosButton} onPress={handleSendSOS}>
              <Text style={styles.sosButtonText}>SEND SOS</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <SosModal
        visible={sosModalVisible}
        onClose={() => setSosModalVisible(false)}
      />

      <TouchableOpacity
        style={styles.floodReportOverlay}
        onPress={() => dispatch(isOpen())}
      >
        <LayersPlus size={16} color="#303030" />
      </TouchableOpacity>
      <SosStatusModal />
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
  loadingPill: {
    position: "absolute",
    bottom: 90,
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: "white",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
    zIndex: 999,
    maxWidth: 260,
  },
  loadingText: {
    fontSize: 12,
    fontFamily: "Montserrat",
    color: "#1a1a1a",
    fontWeight: "600",
    flexShrink: 1,
  },
  banner: {
    position: "absolute",
    bottom: 90,
    left: 16,
    right: 16,
    borderWidth: 1,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 999,
  },
  bannerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  bannerEmoji: {
    fontSize: 18,
  },
  bannerBody: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "Montserrat",
    marginBottom: 2,
  },
  bannerDesc: {
    fontSize: 11,
    fontFamily: "Montserrat",
    lineHeight: 15,
  },
  bannerClose: {
    padding: 4,
    flexShrink: 0,
  },
  floodReportOverlay: {
    position: "absolute",
    bottom: 30,
    left: 20,
    right: 20,
    zIndex: 1000,
    backgroundColor: "white",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    padding: 5,
    borderRadius: 100,
    borderWidth: 1,
  },
  sosButton: {
    position: "absolute",
    bottom: 40,
    right: 135,
    backgroundColor: "#dc2626",
    width: 100,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  sosActiveButton: {},
  sosButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
    fontFamily: "Montserrat",
  },
});
