import * as React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  TouchableOpacity,
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
import {NativeModules} from 'react-native';
const instructions = Platform.select({
  ios: `Press Cmd+R to reload,\nCmd+D or shake for dev menu`,
  android: `Double tap R on your keyboard to reload,\nShake or press menu button for dev menu`,
});
const {USSDDial} = NativeModules;
export default class App extends React.Component {
  state = {
    userBalance: 0,
    expiryDate: '',
  };
  async checkBalance() {
    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      {
        title: 'I need to make some calls',
        message: 'Give me permission to make calls ',
      },
    );
    const granted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
    );
    if (granted) {
      console.log('CAN Make Calls');
      USSDDial.dial('*#456#');
      console.log(this.state.userBalance);
    } else {
      console.log('CALL MAKING Permission Denied');
    }
  }
  componentDidMount() {
    const eventEmitter = new NativeEventEmitter(NativeModules.USSDDial);
    this.eventListener = eventEmitter.addListener('EventReminder', (event) => {
      console.log(event.eventProperty); // "someValue"
      let balance = event.eventProperty.split('is')[1].split('.Valid')[0];
      let date = event.eventProperty.split('until')[1].split('.')[0];
      this.setState({
        userBalance: balance,
        expiryDate: date,
      });
      console.log(balance);
    });
  }
  componentWillUnmount() {
    this.eventListener.remove();
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => this.checkBalance()}>
          <Text>Check Balance</Text>
        </TouchableOpacity>
        <Text>Your Balance is: {this.state.userBalance}</Text>
        <Text>Expiry Date is: {this.state.expiryDate}</Text>
      </View>
    );
  }
}
