export default {  
    apps: [
      {
        name: "um-qura-backend",
        script: "npm",
        args: "start",
        env: {
          PORT: 7001,
          NODE_ENV: "production",
        },
      },
    ],
  };
  
  