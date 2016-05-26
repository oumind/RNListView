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

import UjlListView from './UjlListView';

export default class Home extends Component {
  render () {
    return (
      <View style={styles.container}>
        <UjlListView />
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#F7F7F7',
  }
});