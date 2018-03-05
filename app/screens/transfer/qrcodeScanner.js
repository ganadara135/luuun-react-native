import React, { Component } from 'react'
import { Text, View, StyleSheet, TouchableHighlight } from 'react-native'
import Expo, { Permissions } from 'expo'
import Colors from './../../config/colors'
import Header from './../../components/header'

export default class QRcodeScanner extends Component {
  static navigationOptions = {
    title: 'QR code scanner',
  }

  constructor(props) {
    super(props)
    this.state = {
      camera: true,
      reference: "",
      memo: "",
    }
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA)
    this.setState({ hasCameraPermission: status === 'granted' })
  }

  goToSendTo = () => {
    this.props.navigation.navigate("SendMoney", { reference: this.state.reference, memo: this.state.memo })
  }

  render() {
    const { hasCameraPermission } = this.state
    if (hasCameraPermission === null) {
      return <Text>No access to camera</Text>
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>
    } else {
      if (this.state.camera === true) {
        return (
          <View style={{ flex: 1 }}>
            <Header
              navigation={this.props.navigation}
              back
              title="QR code scanner"
            />
            <Expo.BarCodeScanner
              onBarCodeRead={this._handleBarCodeRead}
              style={{ flex: 1 }}
            />
          </View>
        )
      }
      else {
        return (
          <View style={{ flex: 1 }}>
            <Header
              navigation={this.props.navigation}
              back
              title="QR code scanner"
            />
            <View style={styles.container}>
              <Text style={styles.input}>
                To: {this.state.reference}
              </Text>
              {this.state.memo !== "" ?
                <Text style={styles.input}>
                  Memo: {this.state.memo}
                </Text> : null
              }
            </View>
            <View style={styles.footer}>
              <TouchableHighlight
                style={[styles.buttons, { backgroundColor: Colors.red }]}
                onPress={() => this.setState({ camera: true })}>
                <Text style={{ color: 'white', fontSize: 20 }}>
                  Again
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.buttons, { backgroundColor: Colors.darkgray }]}
                onPress={this.goToSendTo}>
                <Text style={{ color: 'white', fontSize: 20 }}>
                  Next
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        )
      }
    }
  }

  _handleBarCodeRead = (data) => {
    this.setState({ reference: "", memo: "" })

    var str = data.data.replace(/ /g, "")

    if (str.indexOf(":") === -1) {
      this.setState({ camera: false, reference: str })
    }
    else {
      var info = str.split(",")
      if (info.length === 1) {
        var ref = info[0].split(":")[1]
        this.setState({ camera: false, reference: ref })
      }
      else {
        var reference = ""
        var memo = ""
        info.forEach(function(node, index) {
          var splittedInfo = node.split(":")
          if (index === 0) {
            reference = splittedInfo[1]
          }
          else if (splittedInfo[0] === "memo") {
            memo = splittedInfo[1]
          }
        })

        this.setState({ camera: false, reference, memo })
      }
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  footer: {
    height: 65,
    flexDirection: 'row',
    width: "100%",
    alignSelf: 'stretch',
  },
  buttons: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    width: "100%",
    padding: 15,
    fontSize: 20,
  },
})
