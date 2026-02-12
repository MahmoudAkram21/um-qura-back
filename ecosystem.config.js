export default {
    apps : [{
      name: "um-qura-backend",
      script: "./dist/index.js",
      instances: "max",
      exec_mode: "cluster"
    }]
  };
