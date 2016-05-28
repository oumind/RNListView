
'use strict';

import React, {
  Component
} from 'react';
import {
  View,
  ActivityIndicatorIOS,
  ProgressBarAndroid,
  Platform
} from 'react-native';

class UjlSpinner extends Component {
  _getSpinner() {
    if (Platform.OS === 'android') {
      return (
        <ProgressBarAndroid
          styleAttr="SmallInverse"
          {...this.props}
          />
      );
    } else {
      return (
        <ActivityIndicatorIOS
          animating={true}
          size="small"
          {...this.props}
          />
      );
    }
  }

  render() {
    return (
      <View>
        {this._getSpinner() }
      </View>
    );
  }
};

export default UjlSpinner;