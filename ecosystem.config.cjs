module.exports = {
  apps: [
    {
      name: "oltinoy-web",
      cwd: "/var/www/oltinoy",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 11000",
      env: { NODE_ENV: "production" },
      max_memory_restart: "450M",
      time: true,
    },
    {
      name: "oltinoy-bot",
      cwd: "/var/www/oltinoy",
      script: "dist/bot/index.js",
      env: { NODE_ENV: "production" },
      max_memory_restart: "200M",
      time: true,
      restart_delay: 5000,
    },
  ],
};
