import React, { Component } from 'react'
import { View, ScrollView, KeyboardAvoidingView, AsyncStorage, StyleSheet, TouchableHighlight, Text, Alert } from 'react-native'
import stellarService from './../../services/stellarService'
import TransactionService from './../../services/transactionService'
import ResetNavigation from './../../util/resetNavigation'
import TextInput from './../../components/textInput'
import Colors from './../../config/colors'
import Header from './../../components/header'
import Big from 'big.js'

export default class AmountEntry extends Component {
  static navigationOptions = {
    title: 'Send money',
  }

  constructor(props) {
    super(props)
    const params = this.props.navigation.state.params
    console.log(params)
    this.state = {
      reference: params.reference,
      amount: 0,
      memo: params.memo,
    }
  }

  send = async () => {
    if (this.state.amount <= 0) {
      Alert.alert(
        'Invalid',
        'Enter valid amount',
        [[{ text: 'OK' }]]
      )
    }
    else {
      const data = await AsyncStorage.getItem('currency')
      const currency = JSON.parse(data)
      let amount = new Big(this.state.amount)
      for (let i = 0; i < currency.divisibility; i++) {
        amount = amount.times(10)
      }
      Alert.alert(
        'Are you sure?',
        'Send ' + currency.symbol + this.state.amount + ' to ' + this.state.reference,
        [
          { text: 'Yes', onPress: () => this.transferConfirmed(amount) },
          { text: 'No', onPress: () => ResetNavigation.dispatchToSingleRoute(this.props.navigation, "Home"), style: 'cancel' },
        ]
      )
    }
  }

  transferConfirmed = async (amount) => {
    let responseJson = await stellarService.sendMoney(amount, this.state.memo, this.state.reference, 'XLM', 'default')
    if (responseJson.status === 201) {
      Alert.alert('Success',
        "Transaction successful",
        [{ text: 'OK', onPress: () => ResetNavigation.dispatchToSingleRoute(this.props.navigation, "Home") }])
    }
    else {
      Alert.alert('Error',
        "Transaction failed",
        [{ text: 'OK' }])
    }
  }

  amountChanged = (text) => {
    let amount = parseFloat(text)
    if (isNaN(amount)) {
      this.setState({ amount: 0 })
    }
    else {
      this.setState({ amount })
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          navigation={this.props.navigation}
          back
          title="Send money"
        />
        <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
          <ScrollView keyboardDismissMode={'interactive'}>
            <TextInput
              title="Amount"
              placeholder="Enter amount here"
              autoCapitalize="none"
              keyboardType="numeric"
              onChangeText={this.amountChanged}
            />
            <TextInput
              title="Memo"
              placeholder="Enter memo here"
              autoCapitalize="none"
              value={this.state.memo}
              onChangeText={(memo) => this.setState({ memo })}
            />
          </ScrollView>
          <TouchableHighlight
            style={styles.submit}
            onPress={this.send}>
            <Text style={{ color: 'white', fontSize: 18 }}>
              Send
          </Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  submit: {
    padding: 10,
    height: 65,
    backgroundColor: Colors.lightblue,
    width: "100%",
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
