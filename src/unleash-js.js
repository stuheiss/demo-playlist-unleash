var fetch = require('node-fetch')
var EventEmitter = require('./EventEmitter')
const VERSION = '0.0.1'

function initialize() {
  var readyEvent = 'ready'
  var changeEvent = 'change'
  var emitter
  var state = {}
  var pollerRunning = false

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
      if (state !== {}) {
        setState({
          flag: state.flag,
          userId: state.userId,
          enabled: isEnabled(state.flag, state.userId)
        })
      }
    }, 5000)
  }

  function isEnabled(flag, userId) {
    let enabled = fetch(
      'http://localhost:3004/api/flag/' + flag + '/userId/' + userId
    )
      .then(res => res.json())
      .then(json => {
        return json
      })
      .catch(err => {
        console.log('fetch error', err)
        return undefined
      })
    return enabled
  }

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
