module.exports = {
  apps: [
    {
      // Single process: serves the site AND handles the Telegram webhook
      // (POST /api/telegram). No separate bot process — see src/app/api/telegram.
      name: "oltinoy",
      cwd: "/var/www/oltinoy",
      script: "node_modules/next/dist/bin/next",
      args: "start -p 11000",
      env: { NODE_ENV: "production" },
      max_memory_restart: "500M",
      time: true,
    },
  ],
};
