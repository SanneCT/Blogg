const path = require("path");

module.exports = {
  mode: "development",

  entry: "./firebase.js",

  output: {
    path: path.resolve(__dirname, "public"),

    filename: "bundle.js",
  },

  watch: true,

  experiments: {
    topLevelAwait: true,
  },
};