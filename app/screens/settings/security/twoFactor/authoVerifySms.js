import React, {Component} from 'react'
import {
    View,
    KeyboardAvoidingView,
    StyleSheet,
    AsyncStorage,
    TouchableHighlight,
    Text,
    Alert,
    Button
} from 'react-native'
import AuthService from '../../../../services/authService'
import Header from '../../../../components/header'
import Colors from '../../../../config/colors'
import Auth from './../../../../util/auth'
import resetNavigation from './../../../../util/resetNavigation'
import TextInput from './../../../../components/textInput'

export default class AmountEntry extends Component {
    static navigationOptions = {
        title: 'Verify mobile number',
    }

    constructor(props) {
        super(props)
        const params = this.props.navigation.state.params
        this.state = {
            token: ''
        }
    }

    verify = async () => {
        let responseJson = await AuthService.authVerify(this.state)
        if (responseJson.status === "success") {
            const authInfo = responseJson.data
            if (this.props.navigation.state.params.isTwoFactor) {
                await AsyncStorage.removeItem("token")
                Auth.login(this.props.navigation, this.props.navigation.state.params.loginInfo)
            } else {
                await resetNavigation.dispatchUnderTwoFactor(this.props.navigation)
            }
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="Verify mobile number"
                />
                <KeyboardAvoidingView style={styles.mainContainer} behavior={'padding'}>
                    <View style={{flex: 1}}>
                        <TextInput
                            title="Enter the OTP"
                            placeholder="OTP"
                            autoCapitalize="none"
                            keyboardType="numeric"
                            onChangeText={(token) => this.setState({token})}
                        />
                    </View>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => this.verify()}>
                        <Text style={{color: 'white', fontSize: 18}}>
                            Verify
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
    },
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    textInputContainer: {
        paddingVertical: 16
    },
    textInput: {
        padding: 8,
        backgroundColor: 'white'
    },
    VerifyButton: {
        backgroundColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 4,
        borderRadius: 4,
        height: 50
    },
    buttonColor: {
        fontSize: 18,
        color: 'white'
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

