import React, { Component } from 'react'
//import logo from './logo.svg';
import './App.css'
import ULClient from './unleash-js.js'

const isNewer = (a, b) => Date.parse(a.added) < Date.parse(b.added)

const flag = process.env.REACT_APP_FEATURE_FLAG
const userId = process.env.REACT_APP_FEATURE_USERID

class App extends Component {
  constructor() {
    super()
    this.flag = flag
    this.userId = userId
    this.state = {
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
    this.ulclient.on('ready', this.onUnleashUpdated.bind(this))
    this.ulclient.on('change', this.onUnleashUpdated.bind(this))
  }
  onUnleashUpdated() {
    this.ulclient.variation('test2', 'test2user').then(value => {
      // only update state if value is boolean
      // network error will NOT update state as flag value is undefined
      // this will leave app in "Loading" until we get a boolean value
      if (typeof value === 'boolean') {
        this.setState({
          featureFlags: {
            defaultSortingIsAdded: value
          }
        })
      }
    })
  }
  render() {
    if (!this.state.featureFlags) {
      return <div className="App">Loading....</div>
    }

    let sorter
    if (this.state.selectedSortOrder) {
      if (this.state.selectedSortOrder === 'added') {
        sorter = isNewer
      } else if (this.state.selectedSortOrder === 'natural') {
        sorter = undefined
      }
    } else {
      if (this.state.featureFlags.defaultSortingIsAdded) {
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
