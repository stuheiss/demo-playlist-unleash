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
      ],
      health: 0
    }
  }

  componentDidMount() {
    this.ulclient = ULClient.initialize()
    this.ulclient.on('ready', this.onUnleashReady.bind(this))
    this.ulclient.on('change', this.onUnleashChange.bind(this))
  }

  onUnleashReady(event) {
    console.log('onUnleashReady: event:', event)
    this.unleashUpdate(event)
  }

  onUnleashChange(event) {
    console.log('unUnleashChange: event: ', event)
    this.unleashUpdate(event)
  }

  unleashUpdate(event) {
    console.log('upleashUpdate: event:', event)
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

  appStyle() {
    return this.getFeature('test3.colorScheme')
      ? {
          textAlign: 'center',
          backgroundColor: 'lightblue'
        }
      : { textAlign: 'left' }
  }

  appSorterStyle(isBold) {
    const weight = isBold ? 'bold' : 'normal'
    return this.getFeature('test3.colorScheme')
      ? {
          textAlign: 'center',
          backgroundColor: 'lightgrey',
          fontWeight: weight
        }
      : {
          textAlign: 'left',
          fontWeight: weight
        }
  }

  appTableStyle() {
    return this.getFeature('test3.colorScheme')
      ? {
          margin: '0 auto',
          backgroundColor: 'lightgreen'
        }
      : {}
  }

  powerUser() {
    return this.getFeature('test3.powerUser') ? (
      <div style={this.powerUserStyle()}>
        <div style={{ fontSize: '40px' }}>You have the power!!!</div>
        <button onClick={() => this.powerUp()}>PowerUp</button>
        <button onClick={() => this.armTorpedoes()}>Arm Torpedoes</button>
        <button onClick={() => this.areYouSure()}>Launch</button>
        <div>Health: {this.state.health}</div>
      </div>
    ) : (
      ''
    )
  }

  armTorpedoes() {
    alert('Locked and loaded')
  }

  areYouSure() {
    alert('Are you sure?')
  }

  powerUp() {
    let newHealth = this.state.health + 100
    this.setState({ health: newHealth })
  }

  powerUserStyle() {
    return this.getFeature('test3.colorScheme')
      ? {
          textAlign: 'center',
          backgroundColor: 'red'
        }
      : { textAlign: 'left' }
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
        <div style={this.appStyle()}>
          <div
            style={this.appSorterStyle(sorter === undefined)}
            onClick={() => this.setState({ selectedSortOrder: 'natural' })}
          >
            Natural sorting
          </div>
          <div
            style={this.appSorterStyle(sorter !== undefined)}
            onClick={() => this.setState({ selectedSortOrder: 'added' })}
          >
            Time sorting
          </div>
          <table style={this.appTableStyle()}>
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
        <div>{this.powerUser()}</div>
      </div>
    )
  }
}

export default App
