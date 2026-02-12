import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default {
  apps: [{
    name: "um-qura-backend",
    script: join(__dirname, "dist", "index.js"),
    cwd: __dirname,
    instances: "max",
    exec_mode: "cluster",
  }],
};
