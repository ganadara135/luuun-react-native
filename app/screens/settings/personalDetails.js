import React, { Component } from 'react'
import { ImagePicker } from 'expo'
import { View, Alert, Text, Image, StyleSheet, KeyboardAvoidingView, ScrollView, TextInput, AsyncStorage, TouchableHighlight } from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import Modal from 'react-native-modal'
import UserInfoService from './../../services/userInfoService'
import stellarService from './../../services/stellarService'
import ResetNavigation from './../../util/resetNavigation'
import Colors from './../../config/colors'
import Header from './../../components/header'

const languages = {
  "en": "English",
  "af": "Africans",
}

export default class Settings extends Component {
  static navigationOptions = {
    title: 'Personal details',
  }

  constructor() {
    super()

    this.state = {
      nationality: '',
      first_name: '',
      last_name: '',
      id_number: '',
      skype_name: '',
      mobile_number: '',
      language: '',
      stellar_username: '',
      modalVisible: false,
      languageModalVisible: false,
    }
  }

  getStellarUsername = async () => {
    let stellar_address = await stellarService.getAddress()
    if (stellar_address && stellar_address.details && stellar_address.details.memo) {
      this.setState({
        stellar_username: stellar_address.details.memo,
      })
    }
    else if (stellar_address.status === 'error') {
      ResetNavigation.dispatchToSingleRoute(this.props.navigation, "SetUsername")
    }
  }

  async componentWillMount() {
    this.getStellarUsername()
    const value = await AsyncStorage.getItem('user')

    const user = JSON.parse(value)

    if (user.language === '' || !user.language) {
      user.language = 'en'
    }
    this.setState({
      first_name: user.first_name,
      last_name: user.last_name,
      id_number: user.id_number,
      nationality: user.nationality !== "" ? user.nationality : 'US',
      language: user.language,
      profile: user.profile,
    })
  }

  navigateToUploadImage = (result) => {
    this.props.navigation.navigate("UploadImage", { image: result })
  }

  openModal = async () => {
    this.setState({ modalVisible: true })
  }

  openLanguageModal = async () => {
    this.setState({ languageModalVisible: true })
  }

  launchCamera = async () => {

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
    })
    this.setState({ modalVisible: false })
    if (!result.cancelled) {
      this.navigateToUploadImage(result)
    }
  }

  launchImageLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [4, 3],
    })
    this.setState({ modalVisible: false })
    if (!result.cancelled) {
      this.navigateToUploadImage(result)
    }
  }

  languageSelected = (lang) => {
    this.setState({
      languageModalVisible: false,
      language: lang,
    })
  }

  save = async () => {
    let responseJson = await UserInfoService.updateUserDetails({
      first_name: this.state.first_name,
      last_name: this.state.last_name,
      id_number: this.state.id_number,
      nationality: this.state.nationality,
      language: this.state.language,
    })

    if (responseJson.status === "success") {
      await AsyncStorage.removeItem('user')
      await AsyncStorage.setItem('user', JSON.stringify(responseJson.data))
      ResetNavigation.dispatchToDrawerRoute(this.props.navigation, "Settings")
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
          title="Personal details"
        />
        <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
          <ScrollView keyboardDismissMode={'interactive'}>
            <View style={styles.profile}>
              <TouchableHighlight onPress={() => this.openModal()}>
                {this.state.profile ?
                  <Image
                    style={styles.photo}
                    source={{ uri: this.state.profile, cache: 'only-if-cached' }}
                    key={this.state.profile}
                  /> :
                  <Image
                    source={require('./../../../assets/icons/profile.png')}
                    style={styles.photo}
                  />
                }
              </TouchableHighlight>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>
                Username
                </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                editable={false}
                autoCapitalize="none"
                value={this.state.stellar_username}
                onChangeText={(text) => this.setState({ stellar_username: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>
                First name
                </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                autoCapitalize="none"
                value={this.state.first_name}
                onChangeText={(text) => this.setState({ first_name: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>
                Last name
                </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                autoCapitalize="none"
                value={this.state.last_name}
                onChangeText={(text) => this.setState({ last_name: text })}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.text}>
                Identity number
                </Text>
              <TextInput
                style={styles.input}
                placeholder=""
                autoCapitalize="none"
                value={this.state.id_number}
                onChangeText={(text) => this.setState({ id_number: text })}
              />
            </View>
            <View style={styles.pickerContainer}>
              <Text style={[styles.text, { flex: 1 }]}>
                Country
              </Text>
              <CountryPicker
                onChange={(value) => {
                  this.setState({ nationality: value.cca2 });
                }}
                closeable
                filterable
                cca2={this.state.nationality}
                translation="eng"
                styles={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
              />
            </View>
            <View style={[styles.pickerContainer, { height: 60 }]}>
              <Text style={[styles.text, { flex: 2 }]}>
                Language
              </Text>
              <TouchableHighlight
                style={{ flex: 1, alignItems: 'flex-end', paddingRight: 10 }}
                onPress={() => {
                  this.openLanguageModal()
                }}>
                <Text style={{ color: Colors.black, fontSize: 16, fontWeight: 'normal' }}>
                  {languages[this.state.language]} ▼
                </Text>
              </TouchableHighlight>
            </View>
          </ScrollView>
          <TouchableHighlight
            style={styles.submit}
            onPress={() => this.save()}>
            <Text style={{ color: 'white', fontSize: 18 }}>
              Save
              </Text>
          </TouchableHighlight>
        </KeyboardAvoidingView>
        <Modal
          visible={this.state.modalVisible} >
          <View style={styles.modal}>
            <View style={styles.bottomModal}>
              <View style={[styles.button, { borderBottomWidth: 1, borderBottomColor: Colors.black }]}>
                <Text style={{ fontSize: 22, fontWeight: 'bold' }}>
                  Change Image
                </Text>
              </View>
              <TouchableHighlight
                style={styles.button}
                onPress={() => this.launchCamera()}>
                <Text style={styles.buttonText}>
                  Use Camera
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button}
                onPress={() => this.launchImageLibrary()}>
                <Text style={styles.buttonText}>
                  Choose From Gallery
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={styles.button}
                onPress={() => { this.setState({ modalVisible: false }) }}>
                <Text style={styles.buttonText}>
                  Cancel
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        <Modal
          visible={this.state.languageModalVisible} >
          <View style={[styles.modal, { justifyContent: 'flex-end', paddingBottom: 30 }]}>
            <View style={[styles.languageModal]}>
              <TouchableHighlight
                style={[styles.button, { marginTop:5, borderRadius: 5, backgroundColor: 'white' }]}
                onPress={() => this.languageSelected("en")}>
                <Text style={styles.buttonText}>
                  English
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.button, { marginTop:5, borderRadius: 5, backgroundColor: 'white' }]}
                onPress={() => this.languageSelected("af")}>
                <Text style={styles.buttonText}>
                  Africans
                </Text>
              </TouchableHighlight>
              <TouchableHighlight
                style={[styles.button, { marginTop:20, borderRadius: 5, backgroundColor: 'white' }]}
                onPress={() => { this.setState({ languageModalVisible: false }) }}>
                <Text style={styles.buttonText}>
                  Cancel
                </Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
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
  input: {
    height: 50,
    width: "100%",
    padding: 15,
    paddingLeft: 0,
    fontSize: 16,
    fontWeight: 'normal',
    borderColor: 'white',
    borderWidth: 1,
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: Colors.black,
  },
  inputContainer: {
    flexDirection: 'column',
    width: '100%',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgray,
  },
  submit: {
    padding: 10,
    marginTop: 10,
    height: 65,
    backgroundColor: Colors.lightblue,
    width: "100%",
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickerContainer: {
    flexDirection: 'row',
    width: '100%',
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightgray,
  },
  profile: {
    height: 130,
    flexDirection: 'column',
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  photo: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomModal: {
    width: '80%',
    height: 250,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: 'white',
    borderColor: Colors.black,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageModal: {
    width: '100%',
    height: 275,
    paddingBottom: 20,
    paddingTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, .10)',
  },
  button: {
    height: 60,
    width: "90%",
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 18,
  },
})

