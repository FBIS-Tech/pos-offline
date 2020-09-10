import * as React from 'react';
import {Text, View, TouchableOpacity, PermissionsAndroid} from 'react-native';
import Ussd, {ussdEventEmitter} from 'react-native-ussd';

export default class App extends React.Component {
  state = {
    userBalance: '',
  };

  async checkBalance() {
    let granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CALL_PHONE,
      {
        title: 'I need to make some calls',
        message: 'Give me permission to make calls ',
      },
    );

    if (granted) {
      console.log('CAN Make Calls');
      Ussd.dial('*556#');
    } else {
      console.log('CALL MAKING Permission Denied');
    }
  }
  componentDidMount() {
    this.eventListener = ussdEventEmitter.addListener('ussdEvent', (event) => {
      console.log(event.ussdReply);
      // let balance = event.ussdReply;
      // let date = event.ussdReply.split('until')[1].split('.')[0];
      // this.setState({
      //   userBalance: balance,
      //   // expiryDate: date,
      // });
      // console.log(balance);
    });
  }
  componentWillUnmount() {
    this.eventListener.remove();
  }
  render() {
    return (
      <View>
        <TouchableOpacity onPress={() => this.checkBalance()}>
          <Text>Check Balance</Text>
        </TouchableOpacity>
        <Text>Your Balance is: {this.state.userBalance}</Text>
        <Text>Expiry Date is: {this.state.expiryDate}</Text>
      </View>
    );
  }
}
