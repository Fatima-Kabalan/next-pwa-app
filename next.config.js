const withPWA = require("@ducanh2912/next-pwa").default({
  dest: "public", // Destination directory for the PWA files
  disable: false,
  register:true,
  skipWaiting: true,
  cacheOnFrontEndNav: true, 
  aggressiveFrontEndNavCaching: true, // Enable aggressive
  reloadOnOnline: true, 
  swcMinify: true, // Enable SWC minification for improved performance
  workboxOptions:{
      disableDevLogs: true, 
      importScripts: ["custom-sw.js"],
  }
});

module.exports = withPWA({
 
});