module.exports = {
  apps: [
    {
      name: "oltinoy",
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
      // Plain node ostida .env avtomatik yuklanmaydi (Next.js web'da o'zi yuklaydi).
      // Node 20.6+/22 --env-file bilan botga BOT_TOKEN va boshqa env'larni beramiz.
      node_args: "--env-file=.env",
      env: { NODE_ENV: "production" },
      max_memory_restart: "200M",
      time: true,
      restart_delay: 5000,
    },
  ],
};
