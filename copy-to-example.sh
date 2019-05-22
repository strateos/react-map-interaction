#!/bin/bash

# This is a hack to work around limitations in create-react-app
# E.g.: https://github.com/facebook/create-react-app/issues/3883
# We completely copy over the dist of this library into the ./example folder's node_modules

mkdir -p example/node_modules/react-map-interaction/dist
cp dist/react-map-interaction.js example/node_modules/react-map-interaction/dist
cp package.json example/node_modules/react-map-interaction/
