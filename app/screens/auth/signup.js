import React, { Component } from 'react'
import { View, Alert, StyleSheet, ScrollView, TouchableHighlight, Text, KeyboardAvoidingView } from 'react-native'
import AuthService from './../../services/authService'
import TextInput from './../../components/textInput'
import MobileInput from './../../components/mobileNumberInput'
import Colors from './../../config/colors'
import Constants from './../../config/constants'
import Header from './../../components/header'

export default class Signup extends Component {
  static navigationOptions = {
    title: 'Create new account',
  }

  constructor(props) {
    super(props)
    this.state = {
      first_name: '',
      last_name: '',
      email: '',
      mobile: '+1',
      company: Constants.company_id,
      password1: '',
      password2: '',
    }
  }

  changeCountryCode = (code) => {
    this.setState({ mobile: '+' + code })
  }

  signup = async () => {
    let responseJson = await AuthService.signup(this.state)
    if (responseJson.status === "success") {
      const loginInfo = responseJson.data
      this.props.navigation.navigate("AuthVerifyMobile", { loginInfo })
    }
    else {
      Alert.alert('Error',
        responseJson.message,
        [{ text: 'OK' }])
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <Header
          navigation={this.props.navigation}
          back
          title="Create new account"
        />
        <View style={styles.mainContainer}>
          <KeyboardAvoidingView style={styles.container} behavior={'padding'} keyboardVerticalOffset={85}>
            <ScrollView keyboardDismissMode={'interactive'}>
              <TextInput
                title="First name"
                placeholder="e.g. John"
                autoCapitalize="none"
                onChangeText={(first_name) => this.setState({ first_name })}
              />
              <TextInput
                title="Last name"
                placeholder="e.g. Snow"
                autoCapitalize="none"
                onChangeText={(last_name) => this.setState({ last_name })}
              />
              <TextInput
                style={styles.input}
                title="Email"
                placeholder="e.g john@gmail.com"
                autoCapitalize="none"
                keyboardType="email-address"
                onChangeText={(email) => this.setState({ email })}
              />
              <MobileInput
                style={styles.input}
                title="Mobile number"
                autoCapitalize="none"
                keyboardType="numeric"
                value={this.state.mobile}
                onChangeText={(mobile) => this.setState({ mobile })}
                changeCountryCode={this.changeCountryCode}
              />
              <TextInput
                title="Password"
                placeholder="Password"
                autoCapitalize="none"
                secureTextEntry
                onChangeText={(password1) => this.setState({ password1 })}
              />
              <TextInput
                title="Confirm password"
                placeholder="Confirm password"
                autoCapitalize="none"
                secureTextEntry
                onChangeText={(password2) => this.setState({ password2 })}
              />
            </ScrollView>
            <TouchableHighlight
              style={styles.submit}
              onPress={() => this.signup()}>
              <Text style={{ color: 'white' }}>
                Sign up
            </Text>
            </TouchableHighlight>
          </KeyboardAvoidingView>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  input: {
    height: 60,
    width: "100%",
    padding: 10,
    marginTop: 20,
    borderColor: 'white',
    borderWidth: 1,
  },
  submit: {
    padding: 10,
    marginTop: 10,
    height: 50,
    borderRadius: 8,
    backgroundColor: Colors.lightblue,
    width: "100%",
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
