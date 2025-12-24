module.exports = {
    apps: [
        {
            name: 'mqudah-web',
            cwd: '/var/www/mqudah-v2/mqudah-professional-website',
            script: 'npm',
            args: 'start',
            env: {
                NODE_ENV: 'production',
                PORT: 3000
            },
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            error_file: '/var/www/mqudah-v2/logs/web-error.log',
            out_file: '/var/www/mqudah-v2/logs/web-out.log',
            merge_logs: true,
            exp_backoff_restart_delay: 100,
        },
        {
            name: 'mqudah-api',
            cwd: '/var/www/mqudah-v2/server-nest',
            script: 'dist/src/main.js',
            env: {
                NODE_ENV: 'production',
                PORT: 3001
            },
            log_date_format: 'YYYY-MM-DD HH:mm Z',
            error_file: '/var/www/mqudah-v2/logs/api-error.log',
            out_file: '/var/www/mqudah-v2/logs/api-out.log',
            merge_logs: true,
            exp_backoff_restart_delay: 100,
            wait_ready: true,
            listen_timeout: 10000,
        }
    ]
};
