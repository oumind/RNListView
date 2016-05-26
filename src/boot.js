/**
 * Copyright 2016 UVO PLUS TECH CO., LTD.
 * The setup of pApp.
 * @flow
 */

'use strict';

import React, {
  Component
} from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

import App from './app';

export default function Boot(): Component {
  class Root extends Component {
    render () {
      return (
        <App />
      );
    }
  }
  return Root;
}

var styles = {
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  navBar: {
    height: 64,
    backgroundColor: '#CCC'
  },
  row: {
    padding: 10,
    height: 44,
  },
};