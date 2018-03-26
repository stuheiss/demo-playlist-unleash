import React, { Component } from 'react'
//import logo from './logo.svg';
import './App.css'
import ULClient from './unleash-js.js'

const isNewer = (a, b) => Date.parse(a.added) < Date.parse(b.added)

const features = [
  // {
  //   flag: 'test2',
  //   strategies: [{ perUser: ['test2user', 'test2user2', 'test3user'] }]
  // },
  // { flag: 'test2' },
  { flag: 'test3.colorScheme' },
  { flag: 'test3.powerUser' },
  { flag: 'test3.timeSorting' }
]

class App extends Component {
  constructor() {
    super()
    this.state = {
      features: features,
      selectedSortOrder: null,
      songs: [
        { name: 'Only One', added: '2017-11-27' },
        { name: 'Strongest', added: '2017-11-30' },
        { name: 'Dreamer', added: '2017-12-02' },
        { name: 'River', added: '2017-12-03' }
      ]
    }
  }
  componentDidMount() {
    this.ulclient = ULClient.initialize()
    this.ulclient.on('ready', this.onUnleashReady.bind(this))
    this.ulclient.on('change', this.onUnleashChange.bind(this))
  }
  onUnleashReady(event) {
    console.log('onUnleashReady', event)
    let pending = []
    const features = this.state.features
    features.map(feature => {
      const enabled = this.ulclient.variation(feature.flag, feature.userId)
      pending.push(enabled)
      feature.enabled = enabled
    })
    Promise.all(pending).then(values => {
      console.log('wakeup', values)
      this.setState(features)
    })
    return null
  }

  updateFeatureState(flag, userId) {
    console.log('updateFeatureState', flag, userId)
    let pending = []
    if (typeof flag === 'undefined') {
      let features = this.state.features
      features.map(feature => {
        if (typeof feature.strategies === 'undefined') {
          let enabled = this.ulclient.variation(feature.flag)
          pending.push(enabled)
          feature.enabled = enabled
        } else {
          feature.strategies.map(strategy => {
            if (typeof strategy.perUser !== 'undefined') {
              strategy.perUser.map(userId => {
                let enabled = this.ulclient.variation(feature.flag, userId)
                pending.push(enabled)
                feature.enabled = enabled
              })
            }
          })
        }
      })
      Promise.all(pending).then(() => {
        this.setState({ features: features })
        console.log('UPDall', features)
      })
    } else {
      //console.log('updateFS', flag, userId)
      let enabled = this.ulclient.variation(flag, userId)
      pending.push(enabled)
      let features = this.state.features
      let feature = features.filter(f => f.flag === flag)[0]
      feature.enabled = enabled
      let newFeatures = features.map(f => (f.flag === flag ? feature : f))
      Promise.all(pending).then(() => {
        this.setState({ features: newFeatures })
        console.log('UPD1', features)
      })
    }
  }
  onUnleashChange(event) {
    console.log('unUnleashChange event', event)
    let flag = event.flag
    let userId = event.userId
    let pending = []
    const features = this.state.features
    features.map(feature => {
      if (feature.flag === flag && feature.userId === userId) {
        const enabled = this.ulclient.variation(feature.flag, feature.userId)
        pending.push(enabled)
        feature.enabled = enabled
      }
    })
    Promise.all(pending).then(values => {
      console.log('change', values)
      this.setState(features)
    })
    return null

    /*  
    if (typeof event === 'undefined') {
      console.log('unUnleashChange event not defined')
    } else if (event === 'wakeup') {
      this.updateFeatureState() // updates all defined features
    } else {
      this.updateFeatureState(event.flag, event.userId)
    }

    if (false) {
      this.state.features.map(feature => {
        //console.log('mapFeatures', feature.flag)
        if (!feature.hasOwnProperty('strategies')) {
          let value = this.ulclient.variation(feature.flag)
          if (typeof value !== 'undefined') {
            value.then(enabled => {
              //console.log('feature', feature.flag, enabled)
            })
          }
        } else {
          feature.strategies.map(strategy => {
            if (strategy.hasOwnProperty('perUser')) {
              strategy.perUser.map(userId => {
                let value = this.ulclient.variation(feature.flag, userId)
                if (typeof value !== 'undefined') {
                  value.then(enabled => {
                    //console.log('feature', feature.flag, userId, enabled)
                  })
                }
                return null
              })
            }
            return null
          })
        }
        return null
      })
    }
    */
  }

  getFeature(flag, userId) {
    let feature = this.state.features.filter(
      f => f.flag === flag && f.userId === userId
    )[0]
    console.log('getFeature', feature)
    return typeof feature === 'undefined' ? false : feature.enabled
  }

  async foo(flag, userId) {
    let feature = this.state.features.filter(
      f => f.flag === flag && f.userId === userId
    )[0]
    console.log('getFeature', feature)
    return (await typeof feature) === 'undefined' ? false : feature.enabled
  }

  render() {
    // if (!this.state.featureFlags) {
    //   return <div className="App">Loading....</div>
    // }

    let sorter = undefined
    let v = this.getFeature('test3.timeSorting')
    let v2 = v === true ? true : false
    console.log('v', v, 'v2', v2)
    let xsorter = v ? isNewer : undefined
    sorter = xsorter
    console.log('sorter', sorter, 'v', v, 'xsorter', xsorter)
    let v3 = this.foo('test3.timeSorting')
    console.log('v3', v3 ? 'v3true' : 'v3false')
    // if (this.state.featureFlags.defaultSortingIsAdded) {
    //   sorter = isNewer
    // } else {
    //   sorter = undefined
    // }

    return (
      <div className="App">
        <div style={{ textAlign: 'left' }}>
          <div
            style={{ fontWeight: sorter === undefined ? 'bold' : 'normal' }}
            onClick={() => this.setState({ selectedSortOrder: 'natural' })}
          >
            Natural sorting
          </div>
          <div
            style={{ fontWeight: sorter === isNewer ? 'bold' : 'normal' }}
            onClick={() => this.setState({ selectedSortOrder: 'added' })}
          >
            Time sorting
          </div>
          <table>
            <tbody>
              {this.state.songs
                .slice()
                .sort(sorter)
                .map((song, idx) => (
                  <tr key={idx}>
                    <td style={{ width: '100px' }}>{song.name}</td>
                    <td>{song.added}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default App
