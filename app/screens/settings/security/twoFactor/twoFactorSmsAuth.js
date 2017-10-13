import React, {Component} from 'react'
import {
    View,
    Text,
    Button,
    StyleSheet,
    KeyboardAvoidingView,
    Alert,
    TouchableHighlight
} from 'react-native'
import Header from './../../../../components/header'
import Colors from './../../../../config/colors'
import AuthService from './../../../../services/authService'
import TextInput from './../../../../components/textInput'
export default class twoFactorSmsAuth extends Component {
    static navigationOptions = {
        title: 'SMS',
    }

    constructor(props) {
        super(props)
        const params = this.props.navigation.state.params
        this.state = {
            mobile_number: '',
            delete: params.authInfo.sms,
            authInfo: params.authInfo
        }
    }

    sendSms = async () => {
        let responseJson = await AuthService.smsAuthPost({"mobile_number": this.state.mobile_number})
        if (responseJson.status === "success") {
            const authInfo = responseJson.data
            this.props.navigation.navigate("AuthVerifySms", {authInfo})
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    deleteTwoFactorAuth = async () => {
        let responseJson = await AuthService.authOptionDelete()
        if (responseJson.status === "success") {
            this.setState({
                mobile_number: '',
                delete: !this.state.delete
            })
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    async componentWillMount() {
        if (this.state.authInfo.sms === true) {
            let responseJson = await AuthService.smsAuthGet()
            if (responseJson.status === "success") {
                const authInfo = responseJson.data
                if (authInfo.confirmed === true) {
                    this.setState({
                        mobile_number: authInfo.mobile_number,
                    })
                }
            }
            else {
                Alert.alert('Error',
                    responseJson.message,
                    [{text: 'OK'}])
            }
        }
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="SMS authentication"
                />
                <KeyboardAvoidingView style={styles.mainContainer} behavior={'padding'}>
                    <View style={{flex: 1}}>
                        <TextInput
                            title="Enter valid mobile number"
                            placeholder="e.g. +8801714632656"
                            autoCapitalize="none"
                            keyboardType="numeric"
                            value={this.state.mobile_number}
                            onChangeText={(mobile) => this.setState({mobile_number: mobile})}
                        />
                    </View>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => this.sendSms()}>
                        <Text style={{color: 'white', fontSize: 18}}>
                            Save
                        </Text>
                    </TouchableHighlight>
                    {
                        this.state.delete &&
                        <TouchableHighlight
                            style={[styles.submit,{backgroundColor:Colors.red}]}
                            onPress={() => this.deleteTwoFactorAuth()}
                        >
                            <Text style={{color: 'white', fontSize: 18}}> Delete</Text>
                        </TouchableHighlight>
                    }
                </KeyboardAvoidingView>
            </View>
        )
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    mainContainer: {
        flex: 1,
        backgroundColor: 'white',
    },
    titleText: {
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        paddingBottom: 8,
    },
    textInputText: {
        fontSize: 16,
        paddingTop: 8,
        paddingBottom: 4,
    },
    textInput: {
        paddingHorizontal: 15,
        paddingVertical: 8,
    },
    mobileNoContainer: {
        backgroundColor: 'white',
    },
    buttonsContainer: {
        paddingTop: 8,
        flexDirection: 'row',
        justifyContent: 'flex-end',
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
    buttonColor: {
        color: 'white'
    }
})