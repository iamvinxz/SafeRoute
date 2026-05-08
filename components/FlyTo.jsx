const Flyto = ({ webViewRef, mapReady, lat, lng, zoom = 17 }) => {
  if (!mapReady.current) return;
  webViewRef.current.injectJavaScript(`
    map.flyTo([${lat}, ${lng}], ${zoom}, {
      animate: true,
      duration: 1.5
    });
    true;
  `);
};

export default Flyto;
