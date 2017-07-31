import React, { Component } from 'react'
import { View, StyleSheet, AsyncStorage, TouchableHighlight, Text, ActivityIndicator } from 'react-native'
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
      let stellar_address = await StellarService.getAddress()
      //console.log(stellar_address)
      if (stellar_address.status === 'error') {
        ResetNavigation.dispatchToSingleRoute(this.props.navigation, "SetUsername")
      }
      else {
        this.setState({ ready: true })
      }
      //this.setState({ ready: true })
    }
    else {
      this.logout()
    }
  }

  getBalanceInfo = async () => {
    //console.log("dhukse")
    let responseJson = await UserInfoService.getActiveAccount()
    if (responseJson.status === "success") {
      const account = responseJson.data.results[0].currencies[0]
      AsyncStorage.setItem('currency', JSON.stringify(account.currency))
      this.setState({ symbol: account.currency.symbol })
      this.setState({ balance: this.setBalance(account.balance, account.currency.divisibility) })
    }
    else {
      this.logout()
    }
  }

  logout = () => {
    Auth.logout(this.props.navigation)
  }

  render() {
    if (!this.state.ready) {
      return (
        <View style={styles.container}>
          <Header
            navigation={this.props.navigation}
            drawer
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
            <Transactions updateBalance={this.getBalanceInfo} logout={this.logout} />
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
              onPress={() => this.props.navigation.navigate("Send", { reference: "" })}>
              <Text style={{ color: 'white', fontSize: 20 }}>
                Send
              </Text>
            </TouchableHighlight>
          </View>
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

