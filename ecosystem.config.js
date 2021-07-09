module.exports = {
  apps: [
    {
      name: 'komik-api',
      script: 'dist/app.js',
      watch: ['dist'],
      watch_delay: 1000,
      ignore_watch: ['node_modules', 'src'],
      env: {
        NODE_ENV: 'production',
      },
      env_development: {
        NODE_ENV: 'development',
      },
    },
  ],
}
