module.exports = {
  apps: [
    {
      name: 'AD-Server',
      exec_mode: 'cluster',
      instances: '1',
      script: './node_modules/.bin/nuxt-ts',
      args: 'start'
    }
  ]
}
