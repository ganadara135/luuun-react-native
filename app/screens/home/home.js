import React, { Component } from 'react'
import { View, StyleSheet, AsyncStorage, TouchableHighlight, Text, ActivityIndicator, Image } from 'react-native'
import moment from 'moment'
import PopupDialog from 'react-native-popup-dialog'
import UserInfoService from './../../services/userInfoService'
import Transactions from './transactions'
import Auth from './../../util/auth'
import ResetNavigation from './../../util/resetNavigation'
import Colors from './../../config/colors'
import StellarService from './../../services/stellarService'
import Header from './../../components/header'

export default class Home extends Component {
  static navigationOptions = {
    label: 'Home',
  }

  constructor(props) {
    super(props)
    this.state = {
      balance: 0,
      symbol: '',
      ready: false,
      dataToShow: {
        currency: {},
      },
      creditSwitch: true,
      debitSwitch: true,
    }
  }

  async componentWillMount() {
    try {
      const token = await AsyncStorage.getItem('token')
      if (token === null) {
        this.logout()
      }
      else {
        this.getUserInfo()
        this.getBalanceInfo()
      }
    }
    catch (error) {
    }

  }

  setBalance = (balance, divisibility) => {
    for (let i = 0; i < divisibility; i++) {
      balance = balance / 10
    }

    return balance
  }

  getUserInfo = async () => {
    let responseJson = await UserInfoService.getUserDetails()
    if (responseJson.status === "success") {
      AsyncStorage.removeItem('user')
      AsyncStorage.setItem('user', JSON.stringify(responseJson.data))
      let switches = responseJson.data.switches
      let creditSwitches = switches.filter(word => word.tx_type === 'credit')
      if (creditSwitches.length > 0) {
        let creditSwitch = creditSwitches[0]
        if (!creditSwitch.enabled) {
          this.setState({
            creditSwitch: false,
          })
        }
      }
      let debitSwitches = switches.filter(word => word.tx_type === 'debit')
      if (debitSwitches.length > 0) {
        let debitSwitch = debitSwitches[0]
        if (!debitSwitch.enabled) {
          this.setState({
            debitSwitch: false,
          })
        }
      }
      const token = await AsyncStorage.getItem('token')
      if (token === null) {
        await this.logout()
      }
      else {
        let stellar_address = await StellarService.getAddress()
        if (stellar_address.status === 'error') {
          ResetNavigation.dispatchToSingleRoute(this.props.navigation, "SetUsername")
        }
        else {
          this.setState({ ready: true })
        }
      }
      //this.setState({ ready: true })
    }
    else {
      await this.logout()
    }
  }

  getBalanceInfo = async () => {
    let responseJson = await UserInfoService.getActiveAccount()
    if (responseJson.status === "success") {
      let account = responseJson.data.results[0].currencies[0]
      let switches = account.switches
      let creditSwitches = switches.filter(word => word.tx_type === 'credit')
      if (creditSwitches.length > 0) {
        let creditSwitch = creditSwitches[0]
        if (!creditSwitch.enabled) {
          this.setState({
            creditSwitch: false,
          })
        }
      }
      let debitSwitches = switches.filter(word => word.tx_type === 'debit')
      if (debitSwitches.length > 0) {
        let debitSwitch = debitSwitches[0]
        if (!debitSwitch.enabled) {
          this.setState({
            debitSwitch: false,
          })
        }
      }
      AsyncStorage.setItem('currency', JSON.stringify(account.currency))
      this.setState({ symbol: account.currency.symbol })
      this.setState({ balance: this.setBalance(account.available_balance, account.currency.divisibility) })
    }
    else {
      this.logout()
    }
  }

  logout = () => {
    Auth.logout(this.props.navigation)
  }

  showDialog = (item) => {
    this.setState({ dataToShow: item });
    this.popupDialog.show()
  }

  getAmount = (amount = 0, divisibility) => {
    for (let i = 0; i < divisibility; i++) {
      amount = amount / 10
    }

    return amount.toFixed(8).replace(/\.?0+$/, "")
  }

  render() {
    if (!this.state.ready) {
      return (
        <View style={styles.container}>
          <Header
            navigation={this.props.navigation}
            drawer
            creditSwitch={this.state.creditSwitch}
            debitSwitch={this.state.debitSwitch}
          />
          <View style={styles.spinner}>
            <ActivityIndicator
              animating
              style={{ height: 80 }}
              size="large"
            />
          </View>
        </View>
      )
    }
    else {
      return (
        <View style={styles.container}>
          <Header
            navigation={this.props.navigation}
            drawer
          />
          <View style={styles.balance}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ fontSize: 25, color: 'white' }}>
                {this.state.symbol}
              </Text>
              <Text style={{ paddingLeft: 5, fontSize: 40, color: 'white' }}>
                {this.state.balance.toFixed(4).replace(/0{0,2}$/, "")}
              </Text>
            </View>
          </View>
          <View style={styles.transaction}>
            <Transactions updateBalance={this.getBalanceInfo} showDialog={this.showDialog} logout={this.logout} />
          </View>
          <View style={styles.buttonbar} >
            <TouchableHighlight
              style={styles.submit}
              onPress={() => this.props.navigation.navigate("Receive")}>
              <Text style={{ color: 'white', fontSize: 20 }}>
                Receive
                </Text>
            </TouchableHighlight>
            <TouchableHighlight
              style={styles.submit}
              onPress={() => this.props.navigation.navigate("Send")}>
              <Text style={{ color: 'white', fontSize: 20 }}>
                Send
              </Text>
            </TouchableHighlight>
          </View>
          <PopupDialog
            ref={(popupDialog) => { this.popupDialog = popupDialog; }}
            width="90%"
            height={250}>
            <View style={{ flex: 1 }}>
              <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                <Image
                  source={require('./../../../assets/icons/placeholder.png')}
                  style={{ height: 80, width: 80, margin: 10 }}
                />
                <Text style={{ fontSize: 20, color: Colors.black }}>
                  {this.state.dataToShow.label + ": " + this.state.dataToShow.currency.symbol + this.getAmount(this.state.dataToShow.amount, this.state.dataToShow.currency.divisibility)}
                </Text>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', borderTopColor: Colors.lightgray, borderTopWidth: 1, paddingLeft: 20, paddingRight: 20 }}>
                <View style={{ flex: 2, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 15, alignSelf: "flex-start", color: Colors.black }}>
                    {moment(this.state.dataToShow.created).format('lll')}
                  </Text>
                </View>
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={{ fontSize: 15, alignSelf: "flex-end", color: Colors.black }}>
                    {this.state.dataToShow.status}
                  </Text>
                </View>
              </View>
            </View>
          </PopupDialog>
        </View>
      )
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  balance: {
    flex: 1,
    backgroundColor: Colors.lightblue,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 20,
  },
  transaction: {
    flex: 5,
    backgroundColor: Colors.transactionBackground,
  },
  buttonbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 65,
    backgroundColor: Colors.lightblue,
  },
  submit: {
    height: "100%",
    width: "50%",
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spinner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
})

