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
  TouchableHighlight,
  Image,
  View
} from 'react-native';

import Header from './header';
import UjlListView from './UjlListView';

export default class Home extends Component {
  /**
   * Will be called when refreshing
   * Should be replaced by your own logic
   * @param {number} page Requested page to fetch
   * @param {function} callback Should pass the rows
   * @param {object} options Inform if first load
   */
  _onFetch(page = 1, callback, options) {
    setTimeout(() => {
      let rows = [
        '***干了什么 ' + ((page - 1) * 10 + 1),
        '***干了什么 ' + ((page - 1) * 10 + 2),
        '***干了什么 ' + ((page - 1) * 10 + 3),
        '***干了什么 ' + ((page - 1) * 10 + 4),
        '***干了什么 ' + ((page - 1) * 10 + 5),
        '***干了什么 ' + ((page - 1) * 10 + 6),
        '***干了什么 ' + ((page - 1) * 10 + 7),
        '***干了什么 ' + ((page - 1) * 10 + 8),
        '***干了什么 ' + ((page - 1) * 10 + 9),
        '***干了什么 ' + ((page - 1) * 10 + 10)
      ];
      if (page === 10) {
        callback(rows, {
          allLoaded: true, // the end of the list is reached
        });
      } else {
        callback(rows);
      }
    }, 1000); // simulating network fetching
  }

  _newStateRowView(rowData) {
    var rowHash = Math.abs(hashCode(rowData));
    var imgSource = THUMB_URLS[rowHash % THUMB_URLS.length];
    return (
      <TouchableHighlight underlayColor='#c8c7cc'>
        <View style={styles.rowBg}>
          <View style={styles.row}>
            <View style={styles.flexContainer, styles.rowHeader}>
              <Text style={styles.title}>
                {rowData}
              </Text>
              <Text style={styles.time}>
                刚刚
              </Text>
            </View>
            <View style={styles.flexContainer}>
              <View style={styles.flexBlock}>
                <Text style={styles.content}>
                    {LOREM_IPSUM.substr(0, rowHash % 301 + 10)}
                  </Text>
              </View>
              <Image style={styles.thumbnail} source={imgSource} />
            </View>
          </View>
        </View>
      </TouchableHighlight>
      
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Header />
        <UjlListView
          rowView={this._newStateRowView}
          onFetch={this._onFetch}
          firstLoader={true}
          emptyListTip={'没有内容'}
          />
      </View>
    );
  }
}

var THUMB_URLS = [
  require('./img/image1.jpg'),
  require('./img/image2.jpg'),
  require('./img/team.jpg'),
  ];
var LOREM_IPSUM = '接36-503业主电话报修，家中阳台处墙面渗水，是楼上管子渗水导致的';

function hashCode(str) {
  var hash = 15;
  for (var ii = str.length - 1; ii >= 0; ii--) {
    hash = ((hash << 5) - hash) + str.charCodeAt(ii);
  }
  return hash;
};

var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  navBar: {
    height: 64,
    backgroundColor: '#CCC'
  },
  card: {

  },
  flexContainer: {
    flexDirection: 'row'
  },
  flexBlock: {
    flex: 1
  },
  ListViewHeader: {
    paddingTop: 35,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  rowHeader: {
    marginBottom: 3,
    flexDirection: 'row'
  },
  title: {
    fontSize: 12,
    flex: 1,
    color: '#888D85'
  },
  time: {
    fontSize: 12,
    flex: 1,
    textAlign: 'right',
    color: '#888D85'
  },
  content: {
    color: '#333'
  },
  thumbnail: {
    width: 64,
    height: 64,
  },
  row: {
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 10,
  },
});