import React, { Component } from 'react'
import { View, Text, StyleSheet, Image, Clipboard, TouchableHighlight, Alert } from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import stellarService from './../../services/stellarService'
import Colors from './../../config/colors'
import Header from './../../components/header'

export default class Receive extends Component {
  static navigationOptions = {
    title: 'Receive',
  }

  constructor() {
    super()

    this.state = {
      cryptoAddress: {
        qrCode: '',
        address: '',
        memo: '',
        reference: '',
      },
    }
  }

  async componentWillMount() {
    await this.getCryptoAddress()
  }

  getCryptoAddress = async () => {
    const cryptoAddressResponse = await stellarService.getAddress()
    //console.log(cryptoAddressResponse)
    const {cryptoAddress} = this.state
    cryptoAddress.qrCode = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=' + cryptoAddressResponse.reference + '&choe=UTF-8'
    cryptoAddress.address = cryptoAddressResponse.details.address
    cryptoAddress.memo = cryptoAddressResponse.details.memo
    cryptoAddress.reference = cryptoAddressResponse.reference

    console.log(cryptoAddress)
    this.setState({ cryptoAddress })
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          drawer
          title="Receive"
        />
        <Text style={styles.text}>
          The QR code is your public address for accepting payments.
        </Text>
        <Image
          style={{ width: 300, height: 300 }}
          source={{ uri: this.state.cryptoAddress.qrCode }}
        />
        <Text style={styles.text}>
          {this.state.cryptoAddress.reference}
        </Text>
        <View style={styles.boxed}>
          <View style={styles.memoIcon}>
            <Text style={styles.memoText}>
              Memo: {this.state.cryptoAddress.memo}
            </Text>
            <TouchableHighlight
              underlayColor={'white'}
              onPress={() => {
                Clipboard.setString(this.state.cryptoAddress.memo)
                Alert.alert(
                  null,
                  'Copied',
                )
              }}>
              <Icon
                name="content-copy"
                size={30}
                color={Colors.black}
              />
            </TouchableHighlight>
          </View>
          <View style={styles.memoIcon}>
            <Text style={[styles.memoText, {fontSize: 10}]}>
              {this.state.cryptoAddress.address}
            </Text>
            <TouchableHighlight
              underlayColor={'white'}
              onPress={() => {
                Clipboard.setString(this.state.cryptoAddress.address)
                Alert.alert(
                  null,
                  'Copied',
                )
              }}>
              <Icon
                name="content-copy"
                size={30}
                color={Colors.black}
              />
            </TouchableHighlight>
          </View>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    textAlign: 'center',
    color: Colors.black,
    padding: 20,
  },
  boxed: {
    flexDirection: 'column',
    padding: 5,
    backgroundColor: Colors.lightgray,
  },
  memoText: {
    flex: 1,
    padding: 2,
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.black,
  },
  memoIcon: {
    padding: 5,
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})
