import React, { Component } from 'react'
import { View, StyleSheet, ListView, Alert, AsyncStorage, TouchableHighlight, Text, RefreshControl } from 'react-native'
import { NavigationActions } from 'react-navigation'
import Spinner from 'react-native-loading-spinner-overlay'
import EmailAddress from './../../../components/emailAddress'
import SettingsService from './../../../services/settingsService'
import Colors from './../../../config/colors'
import Header from './../../../components/header'

export default class Settings extends Component {
  static navigationOptions = {
    title: 'Email addresses',
  }

  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      loading: false,
      loadingMessage: '',
      dataSource: new ListView.DataSource({
        rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
      }),
    }
  }

  componentWillMount() {
    this.getData()
  }

  getData = async () => {
    let responseJson = await SettingsService.getAllEmails()

    if (responseJson.status === "success") {
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2) });
      const data = responseJson.data;
      let ids = data.map((obj, index) => index);
      this.setState({
        dataSource: ds.cloneWithRows(data, ids),
      })
    }
    else {
      Alert.alert('Error',
        responseJson.message,
        [{ text: 'OK' }])
    }
  }

  reload = () => {
    const resetAction = NavigationActions.reset({
      index: 1,
      actions: [
        NavigationActions.navigate({
          routeName: 'Home',
          params: {},

          // navigate can have a nested navigate action that will be run inside the child router
          action: NavigationActions.navigate({ routeName: 'Settings' }),
        }),
        NavigationActions.navigate({ routeName: 'SettingsEmailAddresses' }),
      ],
    })
    this.props.navigation.dispatch(resetAction)
  }

  makePrimary = async (id) => {
    this.setState({
      loading: true,
      loadingMessage: 'Updating...',
    })
    const body = { "primary": true }
    let responseJson = await SettingsService.makeEmailPrimary(id, body)

    if (responseJson.status === "success") {
      this.reload()
    }
    else {
      Alert.alert('Error',
        responseJson.message,
        [{ text: 'OK' }])
    }
  }

  verify = async (number) => {
    this.setState({
      loading: true,
      loadingMessage: 'Sending verification code...',
    })
    const userData = await AsyncStorage.getItem('user')

    const user = JSON.parse(userData)

    const body = {
      email: number,
      company: user.company,
    }

    let responseJson = await SettingsService.resendEmailVerification(body)

    if (responseJson.status === "success") {
      Alert.alert(
        "Email Sent",
        "A verification email has been sent, please check your email box.",
        [{ text: 'OK', onPress: () => this.setState({ loading: false }) }],
      )
    }
    else {
      Alert.alert('Error',
        responseJson.message,
        [{ text: 'OK' }])
    }
  }

  delete = async (id) => {
    this.setState({
      loading: true,
      loadingMessage: 'Deleting...',
    })
    let responseJson = await SettingsService.deleteEmail(id)

    if (responseJson.status === "success") {
      this.reload()
    }
    else {
      Alert.alert('Error',
        responseJson.message,
        [{ text: 'OK' }])
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Header
          navigation={this.props.navigation}
          back
          title="Email addresses"
        />
        <Spinner
          visible={this.state.loading}
          textContent={this.state.loadingMessage}
          textStyle={{ color: '#FFF' }}
        />
        <ListView
          refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.getData.bind(this)} />}
          dataSource={this.state.dataSource}
          enableEmptySections
          renderRow={(rowData) => <EmailAddress email={rowData} makePrimary={this.makePrimary} verify={this.verify} delete={this.delete} reload={this.reload} />}
        />
        <TouchableHighlight
          style={styles.submit}
          onPress={() => this.props.navigation.navigate("AddEmailAddress")}>
          <Text style={{ color: 'white', fontSize: 18 }}>
            Add email address
          </Text>
        </TouchableHighlight>
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
