/**
 * Copyright 2016 UVO PLUS TECH CO., LTD.
 * The Main Application.
 * @flow
 */

'use strict';

import React, {
  Component
} from 'react';
import {
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableHighlight
} from 'react-native';

import Home from './Home';

export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <StatusBar
          translucent={true}
          backgroundColor="rgba(0, 0, 0, 0.2)"
          barStyle="light-content"
          />
          <Home />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
  }
});