# Abstract

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

This is a rewrite of [playlist-laundarkly](https://github.com/mpj/playlist-launchdarkly.git) using [unleash-client-node](github.com/Unleash/unleash-client-node). The original uses [ldclient-js](https://github.com/launchdarkly/js-client).

[LaunchDarkly](http://www.launchdarkly.com/) is a full featured commercial feature flag service.

[Unleash project](https://github.com/finn-no/unleash) is an open source feature flag server that you can host. Unleash was created by and is used by [Finn.no](http://finn.no/). They provide [source code]((https://github.com/finn-no/unleash)), a [sandbox](http://unleash.herokuapp.com/api/), and a [docker](https://github.com/Unleash/unleash-docker) implementation.

# Usage

1. clone this repo
2. open [http://unleash.herokuapp.com](http://unleash.herokuapp.com) and create a feature flag, enable policy withId, and add a userId
3. .env and set REACT_APP_FEATURE_FLAG
 and REACT_APP_FEATURE_USERID to match previous step
4. `$ yarn install`
5. `$ yarn startproxy`
6. `$ yarn start`
7. open http://localhost:3000
8. change feature flag settings on [http://unleash.herokuapp.com](http://unleash.herokuapp.com) and watch the app behavior change to match

Optionally run your own unleash server and set .env unleashApiUrl appropriately.

Note that we access [http://unleash.herokuapp.com](http://unleash.herokuapp.com) via a proxy server (see unleash-proxy.js) to avoid CORS. The proxy runs on localhost:3004. If the proxy is not running, isEnabled() will return undefined. Otherwise, isEnabled() will return a boolean if the feature flag is defined on the feature flag server. Thus, a call to variation() will return either undefined or a boolean.

This demo only reacts to one feature flag at a time. The last call to variation() defines the current feature flag. Only the current feature flag will emit an on-change event. This is a limitation of this demo, not of the feature flag server or feature flags in general.

# References

ref: [Unleash project](https://github.com/finn-no/unleash)

ref: [LaunchDarkly](http://www.launchdarkly.com/)

ref: [FINN.no](http://finn.no/)

ref: [http://unleash.herokuapp.com](http://unleash.herokuapp.com)

Thanks to [mpj](https://github.com/mpj) for the original version.

