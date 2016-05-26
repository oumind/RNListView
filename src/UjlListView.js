/**
 * Copyright 2016 UVO PLUS TECH CO., LTD.
 * The Ujl ListView Component.
 * @flow
 */

'use strict';

import React, {
  Component
} from 'react';
import {
  Image,
  ListView,
  TouchableHighlight,
  StyleSheet,
  RecyclerViewBackedScrollView,
  Text,
  View,
} from 'react-native';

export default class UjlListView extends Component {
  constructor(props: Props) {
    super(props);
    var mockArray = Array(101).join("1").split("").map(function(el,index){
      return 'xxx刚干了什么 '+ (index+1)
    })

    let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows(mockArray),
    };

    this._renderFooter = this._renderFooter.bind(this);
    this._onContentSizeChange = this._onContentSizeChange.bind(this);
  }
  
  _renderHeader(): ?ReactElement {
    return (
      <View style={styles.ListViewHeader}>
        <Text style={styles.ListTitle}>标题</Text>
      </View>
    );
  }
  
  _renderFooter(): ?ReactElement {
    if (this.state.dataSource.getRowCount() === 0) {
      return this.props.renderEmptyList && this.props.renderEmptyList();
    }

    return this.props.renderFooter && this.props.renderFooter();
  }
  
  _onContentSizeChange(contentWidth: number, contentHeight: number) {
    if (contentHeight !== this.state.contentHeight) {
      this.setState({contentHeight});
    }
  }
  
  _genRows (pressData: {[key: number]: boolean}): Array<string> {
    var dataBlob = [];
    for (var ii = 0; ii < 100; ii++) {
      var pressedText = pressData[ii] ? ' (pressed)' : '';
      dataBlob.push('Row ' + ii + pressedText);
    }
    return dataBlob;
  }

  _pressRow (rowID: number) {
    this._pressData[rowID] = !this._pressData[rowID];
    this.setState({dataSource: this.state.dataSource.cloneWithRows(
      this._genRows(this._pressData)
    )});
  }
  
  _renderRow (rowData: string, sectionID: number, rowID: number) {
    var rowHash = Math.abs(hashCode(rowData));
    var imgSource = THUMB_URLS[rowHash % THUMB_URLS.length];
    return (
      <TouchableHighlight onPress={() => this._pressRow(rowID)}>
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
          <View key={`${sectionID}-${rowID}`} style={styles.separator} />
        </View>
      </TouchableHighlight>
    );
  }
  
  render () {
    return (
      <ListView style={styles.card}
        dataSource={this.state.dataSource}
        renderHeader={this._renderHeader}
        renderRow={this._renderRow}
        renderScrollComponent={props => <RecyclerViewBackedScrollView {...props} />}
        renderFooter={this._renderFooter}
      />
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
  card: {
    paddingLeft: 10,
    paddingRight: 10,
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
    padding: 10,
  },
  rowBg: {
    backgroundColor: '#FFF',
  },
  separator: {
    height: 1,
    backgroundColor: '#F0F0F0',
    marginLeft: 10
  },
});