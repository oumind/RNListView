/**
 * Copyright 2016 UVO PLUS TECH CO., LTD.
 * The Ujl common ListView Component.
 * @flow
 */

'use strict';

import React, {
  Component
} from 'react';
import {
  ListView,
  Platform,
  TouchableHighlight,
  View,
  Text,
  RefreshControl,
  StyleSheet,
} from 'react-native';

import UjlSpinner from './UjlSpinner';

class UjlListView extends Component {
  static propTypes = {
    customStyles: React.PropTypes.object,

    refreshable: React.PropTypes.bool, // 启用下拉或手动点击刷新
    firstLoader: React.PropTypes.bool, // 首次加载时显示spinner
    pagination: React.PropTypes.bool, // 启用无限滚动加载更多
    autoPagination: React.PropTypes.bool, // 自动加载更多
    withSections: React.PropTypes.bool,
    scrollEnabled: React.PropTypes.bool,

    emptyListTip: React.PropTypes.string,

    headerView: React.PropTypes.func,
    sectionHeaderView: React.PropTypes.func,

    onFetch: React.PropTypes.func,
  }

  static defaultProps = {
    customStyles: {},
    refreshable: true,
    firstLoader: true,
    pagination: true,
    withSections: false,
    scrollEnabled: true,

    emptyListTip: '',

    headerView: null,
    sectionHeaderView: null,

    onFetch(page, callback, options) { callback([]); }
  }
  constructor(props: Props) {
    super(props);

    this._setPage(1);
    this._setRows([]);

    let ds = null;
    if (this.props.withSections === true) {
      ds = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
        sectionHeaderHasChanged: (section1, section2) => section1 !== section2,
      });
      this.state = {
        dataSource: ds.cloneWithRowsAndSections(this._getRows()),
        isRefreshing: false,
        paginationStatus: 'firstLoad',
      };
    } else {
      ds = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
        dataSource: ds.cloneWithRows(this._getRows()),
        isRefreshing: false,
        paginationStatus: 'firstLoad',
      };
    }

    this._updateRows = this._updateRows.bind(this);
    this._headerView = this._headerView.bind(this);
    this._renderPaginationView = this._renderPaginationView.bind(this);
    this._onPaginate = this._onPaginate.bind(this);
    this._postPaginate = this._postPaginate.bind(this);
    this._onRefresh = this._onRefresh.bind(this);
  }

  componentDidMount() {
    this.props.onFetch(this._getPage(), this._updateRows, { firstLoad: true });
  }

  _setPage(page) { this._page = page; }
  _getPage() { return this._page; }
  _setRows(rows) { this._rows = rows; }
  _getRows() { return this._rows; }

  _headerView() {
    if (this.state.paginationStatus === 'firstLoad' || !this.props.headerView) {
      return null;
    }
    return this.props.headerView();
  }

  _updateRows(rows = [], options = {}) {
    if (rows !== null) {
      this._setRows(rows);
      if (this.props.withSections === true) {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRowsAndSections(rows),
          isRefreshing: false,
          paginationStatus: (options.allLoaded === true ? 'allLoaded' : 'waiting'),
        });
      } else {
        this.setState({
          dataSource: this.state.dataSource.cloneWithRows(rows),
          isRefreshing: false,
          paginationStatus: (options.allLoaded === true ? 'allLoaded' : 'waiting'),
        });
      }
    } else {
      this.setState({
        isRefreshing: false,
        paginationStatus: (options.allLoaded === true ? 'allLoaded' : 'waiting'),
      });
    }
  }

  /**
   * 加载更多
   */
  _loadMoreView(paginateCallback) {
    return (
      <TouchableHighlight
        underlayColor='#c8c7cc'
        onPress={paginateCallback}
        >
        <Text>
          加载更多...
        </Text>
      </TouchableHighlight>
    );
  }

  /**
   * 翻页中
   */
  _onPaginate() {
    if (this.state.paginationStatus === 'allLoaded') {
      return null
    } else {
      this.setState({
        paginationStatus: 'fetching',
      });
      this.props.onFetch(this._getPage() + 1, this._postPaginate, {});
    }
  }

  /**
   * 翻页成功后，合并列表
   */
  _postPaginate(rows = [], options = {}) {
    this._setPage(this._getPage() + 1);
    var mergedRows = null;
    if (this.props.withSections === true) {
      mergedRows = MergeRecursive(this._getRows(), rows);
    } else {
      mergedRows = this._getRows().concat(rows);
    }
    this._updateRows(mergedRows, options);
  }

  /**
   * 列表内容为空
   */
  _emptyView(refreshCallback) {
    let emptyListTip = '没有内容可以显示';
    if (this.props.emptyListTip) {
      emptyListTip = this.props.emptyListTip;
    }
    return (
      <View>
        <Text>
          {emptyListTip}
        </Text>

        <TouchableHighlight
          underlayColor='#c8c7cc'
          onPress={refreshCallback}
          >
          <Text>
            ↻
          </Text>
        </TouchableHighlight>
      </View>
    );
  }

  /**
   * 刷新列表
   */
  _onRefresh(options = {}, isFetching=false) {
    //options ＝ {external: true}
    console.log(this._getRows);
    this.setState({
      isRefreshing: true
    });
    this._setPage(1);
    this.props.onFetch(this._getPage(), this._updateRows, options);
  }

  /**
   * 渲染列表内容各种状态结果
   * 1. 正在翻页或首次加载；
   * 2. 加载更多；
   * 3. 列表全部加载完成；
   * 4. 空列表；
   * 5. 其他；
   */
  _renderPaginationView() {
    if ((this.state.paginationStatus === 'fetching' && this.props.pagination === true)
      || (this.state.paginationStatus === 'firstLoad' && this.props.firstLoader === true)) {
      return (
        <View>
          <UjlSpinner />
        </View>
      );
    } else if (this.state.paginationStatus === 'waiting' && this.props.pagination === true && (this.props.withSections === true || this._getRows().length > 0)) {
      return this._loadMoreView(this._onPaginate);
    } else if (this.state.paginationStatus === 'allLoaded' && this.props.pagination === true) {
      return (
        <View>
          <Text>
            ~没有更多了~
          </Text>
        </View>
      );
    } else if (this._getRows().length === 0) {
      return this._emptyView(this._onRefresh);
    } else {
      return null;
    }
  }

  _renderRefreshControl() {
    if (this.props.renderRefreshControl) {
      return this.props.renderRefreshControl({ onRefresh: this._onRefresh });
    }
    return (
      <RefreshControl
        onRefresh={this._onRefresh}
        refreshing={this.state.isRefreshing}
        colors={this.props.refreshableColors}
        progressBackgroundColor={this.props.refreshableProgressBackgroundColor}
        size={this.props.refreshableSize}
        tintColor={this.props.refreshableTintColor}
        title={this.props.refreshableTitle}
      />
    );
  }

  render() {
    return (
      <ListView
        ref="listview"
        dataSource={this.state.dataSource}
        renderRow={this.props.rowView}
        renderSectionHeader={this.props.sectionHeaderView}
        renderHeader={this._headerView}
        renderFooter={this._renderPaginationView}
        refreshControl={this.props.refreshable === true ? this._renderRefreshControl() : null}
        renderSeparator={(sectionID, rowID) => <View key={`${sectionID}-${rowID}`} style={[styles.separator, this.props.customStyles.separator]} />}

        {...this.props}

        style={this.props.style}
        />
    );
  }
};

/**
 * 合并两个数组（翻页内容和原内容合并）
 */
function MergeRecursive(obj1, obj2) {
  for (var p in obj2) {
    try {
      if (obj2[p].constructor == Object) {
        obj1[p] = MergeRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}

var styles = StyleSheet.create({
  separator: {
    height: 1,
    backgroundColor: '#F7F7F7',
    marginLeft: 20
  }
});

export default UjlListView;