import React, { Component } from 'react'
//import logo from './logo.svg';
import './App.css'
import ULClient from './unleash-js.js'

const isNewer = (a, b) => Date.parse(a.added) < Date.parse(b.added)

const features = [
  { flag: 'test2', userId: 'test2user' },
  { flag: 'test2', userId: 'test2user2' },
  { flag: 'test2', userId: 'test3user' },
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
    //console.log('onUnleashReady', event)
    this.unleashUpdate(event)
  }

  onUnleashChange(event) {
    //console.log('unUnleashChange event', event)
    this.unleashUpdate(event)
  }

  unleashUpdate(event) {
    let pending = []
    const features = this.state.features.slice()
    features.map(feature => {
      if (
        event === 'wakeup' ||
        (feature.flag === event.flag && feature.userId === event.userId)
      ) {
        pending.push(this.ulclient.variation(feature.flag, feature.userId))
      } else {
        pending.push(feature.enabled)
      }
      return null
    })
    Promise.all(pending).then(values => {
      features.map((feature, i) => {
        feature.enabled = values[i]
        return null
      })
      this.setState({ features: features })
    })
  }

  getFeature(flag, userId) {
    let feature = this.state.features.filter(
      f => f.flag === flag && f.userId === userId
    )[0]
    if (typeof feature === 'undefined') return undefined
    return typeof feature !== 'undefined' &&
      typeof feature.enabled === 'boolean'
      ? feature.enabled
      : undefined
  }

  render() {
    // if (!this.state.featureFlags) {
    //   return <div className="App">Loading....</div>
    // }

    let sorter
    if (this.state.selectedSortOrder) {
      if (this.state.selectedSortOrder === 'added') {
        sorter = isNewer
      } else if (this.state.selectedSortOrder === 'natural') {
        sorter = undefined
      }
    } else {
      if (this.getFeature('test3.timeSorting')) {
        sorter = isNewer
      } else {
        sorter = undefined
      }
    }

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
