import React, {Component} from 'react'
import {
    View,
    Alert,
    AsyncStorage,
    ScrollView,
    KeyboardAvoidingView,
    StyleSheet,
    TouchableHighlight,
    Text
} from 'react-native'
import AuthService from './../../services/authService'
import Auth from './../../util/auth'
import ResetNavigation from './../../util/resetNavigation'
import TextInput from './../../components/textInput'
import Colors from './../../config/colors'
import Constants from './../../config/constants'
import Header from './../../components/header'

export default class Login extends Component {
    static navigationOptions = {
        title: 'Login',
    }

    constructor(props) {
        super(props)
        this.checkLoggedIn()
        this.state = {
            email: '',
            company: Constants.company_id,
            password: '',
        }
    }

    checkLoggedIn = async () => {
        try {
            const token = await AsyncStorage.getItem('token')
            if (token != null) {
                ResetNavigation.dispatchToSingleRoute(this.props.navigation, "Home")
            }
            return token
        } catch (error) {
        }
    }

    login = async () => {
        var body = {
            "user": this.state.email,
            "company": this.state.company,
            "password": this.state.password,
        }
        let responseJson = await AuthService.login(body)
        if (responseJson.status === "success") {
            const loginInfo = responseJson.data
            await AsyncStorage.setItem("token", loginInfo.token)
            let twoFactorResponse = await AuthService.twoFactorAuth()
            if (twoFactorResponse.status === "success") {
                const authInfo = twoFactorResponse.data
                if (authInfo.sms === true || authInfo.token === true) {
                    this.props.navigation.navigate("AuthVerifySms", {loginInfo: loginInfo, isTwoFactor: true})
                }
                else {
                    Auth.login(this.props.navigation, loginInfo)
                }
            }
            else {
                Alert.alert('Error',
                    twoFactorResponse.message,
                    [{text: 'OK'}])
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
                    title="Login"
                />
                <View style={styles.mainContainer}>
                    <KeyboardAvoidingView style={styles.container} behavior={'padding'} keyboardVerticalOffset={85}>
                        <ScrollView style={{width: '100%'}} keyboardDismissMode={'interactive'}>
                            <TextInput
                                title="Email"
                                autoCapitalize="none"
                                placeholder="e.g john@gmail.com"
                                keyboardType="email-address"
                                value={this.state.email}
                                onChangeText={(email) => this.setState({email})}
                            />
                            <TextInput
                                title="Password"
                                autoCapitalize="none"
                                placeholder="Password"
                                secureTextEntry
                                value={this.state.password}
                                onChangeText={(password) => this.setState({password})}
                            />
                        </ScrollView>
                        <TouchableHighlight
                            style={styles.login}
                            onPress={this.login}>
                            <Text style={{color: 'white'}}>
                                Login
                            </Text>
                        </TouchableHighlight>
                    </KeyboardAvoidingView>
                    <TouchableHighlight
                        style={styles.forgetPassword}
                        onPress={() => this.props.navigation.navigate("ForgetPassword")}>
                        <Text style={{color: Colors.lightblue}}>
                            Forgot Password?
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={styles.register}
                        onPress={() => this.props.navigation.navigate("Signup")}>
                        <Text style={{color: Colors.lightblue}}>
                            Create New Account
                        </Text>
                    </TouchableHighlight>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    container: {
        height: 280,
        width: "100%",
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        height: 60,
        width: "100%",
        alignSelf: 'stretch',
        padding: 10,
        marginTop: 20,
        borderColor: 'white',
        borderWidth: 1,
    },
    login: {
        padding: 10,
        marginTop: 10,
        height: 50,
        backgroundColor: Colors.lightblue,
        width: "100%",
        borderRadius: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    register: {
        padding: 10,
        marginTop: 20,
        height: 40,
        backgroundColor: 'white',
        width: "60%",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
    },
    forgetPassword: {
        padding: 10,
        height: 50,
        backgroundColor: 'white',
        width: "100%",
        borderColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
