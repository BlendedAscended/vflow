// PM2 Ecosystem Config — VerbaFlow (verbaflowllc.com)
// Deploy path: /var/www/verbaflow
// Run: pm2 start ecosystem.config.js --only verbaflow

module.exports = {
  apps: [
    {
      name: 'verbaflow',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/verbaflow',

      // Port — Cloudflare Tunnel routes to this
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },

      // Cluster mode uses all available CPU cores
      instances: 'max',
      exec_mode: 'cluster',

      // Auto-restart config
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      restart_delay: 3000,

      // Logging
      error_file: '/var/log/pm2/verbaflow-error.log',
      out_file: '/var/log/pm2/verbaflow-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      // Zero-downtime reload
      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
    {
      name: 'portfolio',
      script: 'node_modules/.bin/next',
      args: 'start',
      cwd: '/var/www/portfolio',

      // Port — Cloudflare Tunnel routes sandeep.verbaflowllc.com to this
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
      },

      instances: 2,
      exec_mode: 'cluster',

      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      restart_delay: 3000,

      error_file: '/var/log/pm2/portfolio-error.log',
      out_file: '/var/log/pm2/portfolio-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,

      wait_ready: true,
      listen_timeout: 10000,
      kill_timeout: 5000,
    },
  ],
};
