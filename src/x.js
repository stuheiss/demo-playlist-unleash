//import ULClient from './unleash-js.js'

let ULClient = require('./unleash-js')

//this.ulclient = ULClient.initialize()
ulclient = ULClient.initialize()
ulclient.on('ready', onUnleashUpdated)
ulclient.on('change', onUnleashUpdated)

function onUnleashUpdated(msg) {
  console.log('ONUNLEASHUPDATED', msg)
}

function checkFlag(flag, user) {
  let enabled = ulclient.variation(flag, user)
  console.log('chkFlag', flag, user, enabled)
}

function checkFlags() {
  checkFlag('test2', 'test2user')
  checkFlag('test3.colorScheme')
  checkFlag('test3.powerUser')
  checkFlag('test3.timeSorting')
}

setInterval(function() {
  console.log('nextCheck:')
  checkFlags()
}, 3000)
