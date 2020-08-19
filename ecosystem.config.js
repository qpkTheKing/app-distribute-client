module.exports = {
  apps: [
    {
      name: 'AD-Server',
      exec_mode: 'cluster',
      instances: '1',
      script: 'yarn run start'
    }
  ]
}
