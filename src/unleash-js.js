var fetch = require('node-fetch')
var EventEmitter = require('./EventEmitter')
const VERSION = '0.0.1'
require('dotenv').config()

function initialize() {
  var readyEvent = 'ready'
  var changeEvent = 'change'
  var emitter
  var state = { features: [] }
  var pollerRunning = false
  var api = `http://${process.env.REACT_APP_UNLEASH_PROXY_HOST}:${
    process.env.REACT_APP_UNLEASH_PROXY_PORT
  }/api`

  emitter = EventEmitter()

  function on(event, handler, context) {
    if (event.substr(0, changeEvent.length) === changeEvent) {
      /*
      if (!stream.isConnected()) {
        connectStream()
      }
      */
      emitter.on.apply(emitter, [event, handler, context])
    } else {
      emitter.on.apply(emitter, Array.prototype.slice.call(arguments))
    }
    if (pollerRunning === false) {
      pollerRunning = true
      startPoller()
      emitter.emit(event, 'wakeup')
    }
  }

  function startPoller() {
    setInterval(() => {
      state.features.map(feature => {
        let enabled = isEnabled(feature.flag, feature.userId)
        Promise.all([feature.enabled, enabled]).then(values => {
          if (values[0] !== values[1]) {
            emitter.emit(changeEvent, feature)
          }
        })
        feature.enabled = enabled
        return null
      })
    }, 5000)
  }

  function isEnabled(flag, userId) {
    let url = `${api}/flag/${flag}`
    if (userId !== undefined) {
      url = url + '/userId/' + userId
    }
    let enabled = fetch(url)
      .then(res => res.json())
      .then(json => {
        return json
      })
      .catch(err => {
        console.log('ERROR:FETCH', err)
        return undefined
      })
    return enabled
  }

  // queue up the feature if necessary, else return its state
  function variation(flag, userId) {
    const feature = featureLookup(flag, userId)
    if (typeof feature !== 'undefined') {
      const enabled = feature.enabled
      //console.log('variation exists', flag, userId, enabled)
      return enabled
    } else {
      // queue up this variation
      const enabled = isEnabled(flag, userId)
      enqueueFeature(flag, userId, enabled)
      //console.log('variation new', flag, userId, enabled)
      return enabled
    }
  }

  function featureLookup(flag, userId) {
    let feature = state.features.filter(
      f => f.flag === flag && f.userId === userId
    )
    return feature[0]
  }

  function enqueueFeature(flag, userId, enabled) {
    state.features.push({
      flag: flag,
      userId: userId,
      enabled: enabled
    })
  }

  /*
  function variation(flag, userId) {
    var enabled = isEnabled(flag, userId)
    setState({
      flag: flag,
      userId: userId,
      enabled: enabled
    })
    return enabled
  }

  function setState(newState) {
    Promise.all([state.enabled, newState.enabled]).then(values => {
      if (values[0] !== values[1]) {
        console.log('state enabled changed', values[0], values[1])
        state = newState
        emitter.emit(changeEvent, 'enabled')
      }
    })
    if (state.flag !== newState.flag || state.userId !== newState.userId) {
      console.log('state flag changed', state, newState)
      state = newState
      emitter.emit(changeEvent, 'flag')
    }
  }
*/

  var readyPromise = new Promise(function(resolve) {
    var onReady = emitter.on(readyEvent, function() {
      emitter.off(readyEvent, onReady)
      resolve()
    })
  })

  var client = {
    waitUntilReady: function() {
      return readyPromise
    },
    variation: variation,
    on: on
  }
  return client
}

module.exports = {
  initialize: initialize
}

if (typeof VERSION !== 'undefined') {
  module.exports.version = VERSION
}
