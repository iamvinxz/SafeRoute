const { withProjectBuildGradle } = require("@expo/config-plugins");

module.exports = function withNotifee(config) {
  return withProjectBuildGradle(config, (config) => {
    if (config.modResults.contents.includes("dl.cloudsmith.io")) {
      return config;
    }
    config.modResults.contents = config.modResults.contents.replace(
      /maven\s*\{\s*url\s*['"]https:\/\/www\.jitpack\.io['"]\s*\}/,
      `maven { url "https://www.jitpack.io" }
        maven { url "https://dl.cloudsmith.io/public/notifee/notifee/maven/" }`,
    );
    return config;
  });
};
