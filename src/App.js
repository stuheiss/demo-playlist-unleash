import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import LDClient from 'ldclient-js'

const isNewer = (a, b) => Date.parse(a.added) < Date.parse(b.added)

class App extends Component {
  constructor() {
    super()
    this.state = {
      selectedSortOrder: null,
      songs: [
        { name: 'Only One', added: '2017-11-27' },
        { name: 'Strongest', added: '2017-11-30' },
        { name: 'Dreamer', added: '2017-12-02' },
        { name: 'River', added: '2017-12-03' },
      ]
    }
  }
  componentDidMount() {
    const user = {
      key: 'mpj'
    }
    this.ldclient = LDClient.initialize('5a847866bb19020ab50766f1', user)
    this.ldclient.on('ready', this.onLaunchDarklyUpdated.bind(this))
    this.ldclient.on('change', this.onLaunchDarklyUpdated.bind(this))
  }
  onLaunchDarklyUpdated() {
    this.setState({
      featureFlags: {
        defaultSortingIsAdded: this.ldclient.variation('playlist-default-sorting-is-added')
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
        <div
            style={{ fontWeight: sorter === undefined ? 'bold' : 'normal'}}
            onClick={() => this.setState({ selectedSortOrder: 'natural' })}>Natural sorting</div>
        <div
          style={{ fontWeight: sorter === isNewer ? 'bold' : 'normal'}}
          onClick={() => this.setState({ selectedSortOrder: 'added' })}>Time sorting</div>
        <ul>
          {this.state.songs.slice().sort(sorter).map(song =>
             <li>{song.name}</li>
          )}
        </ul>
      </div>
    );
  }
}

export default App;
