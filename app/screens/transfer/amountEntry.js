import React, {Component} from 'react'
import {
    View,
    ScrollView,
    KeyboardAvoidingView,
    AsyncStorage,
    StyleSheet,
    TouchableHighlight,
    Text,
    Alert,
    TouchableWithoutFeedback,
    ActivityIndicator,
} from 'react-native'
import Spinner from 'react-native-loading-spinner-overlay'
import stellarService from './../../services/stellarService'
import ResetNavigation from './../../util/resetNavigation'
import TextInput from './../../components/textInput'
import UserInfoService from './../../services/userInfoService'
import Colors from './../../config/colors'
import Header from './../../components/header'
import Big from 'big.js'

export default class AmountEntry extends Component {
    static navigationOptions = {
        title: 'Send money',
    }


    constructor(props) {
        super(props)
        const params = this.props.navigation.state.params
        this.state = {
            reference: params.reference,
            amount: 0,
            memo: params.memo,
            balance: 0,
            note: '',
            disabled: false,
            loading: false,
            loadingMessage: "",
        }
    }

    transferConfirmed = async (amount) => {
        this.setState({
            loading: true,
            loadingMessage: 'Sending...',
        })
        let responseJson = await stellarService.sendMoney(amount, this.state.memo, this.state.reference, 'XLM', 'default')
        if (responseJson.status === 201) {
            Alert.alert('Success',
                "Transaction successful",
                [{text: 'OK', onPress: () => {
                    this.setState({
                        loading: false,
                    })
                    ResetNavigation.dispatchToSingleRoute(this.props.navigation, "Home")
                }}])
        }
        else {
            Alert.alert('Error',
                "Transaction failed",
                [{
                    text: 'OK',onPress:()=>{
                        this.setState({
                            loading: false,
                        })
                    }
                }])
        }
    }

    componentWillMount() {
        this.getBalanceInfo()
    }

    send = async () => {
        if (this.state.amount <= 0) {
            Alert.alert(
                'Invalid',
                'Enter valid amount',
                [[{text: 'OK'}]]
            )
        }
        else {
            const data = await AsyncStorage.getItem('currency')
            const currency = JSON.parse(data)
            let amount = new Big(this.state.amount)
            for (let i = 0; i < currency.divisibility; i++) {
                amount = amount.times(10)
            }
            Alert.alert(
                'Are you sure?',
                'Send ' + currency.symbol + this.state.amount + ' to ' + this.state.reference,
                [
                    {text: 'Yes', onPress: () => this.transferConfirmed(amount)},
                    {
                        text: 'No',
                        onPress: () => ResetNavigation.dispatchToSingleRoute(this.props.navigation, "Home"),
                        style: 'cancel'
                    },
                ]
            )
        }
    }
    setBalance = (balance, divisibility) => {
        for (let i = 0; i < divisibility; i++) {
            balance = balance / 10
        }

        return balance
    }
    getBalanceInfo = async () => {
        let responseJson = await UserInfoService.getActiveAccount()
        if (responseJson.status === "success") {
            let account = responseJson.data.results[0].currencies[0]
            this.setState({balance: this.setBalance(account.available_balance, account.currency.divisibility)})
        }
    }

    amountChanged = (text) => {
        let amount = parseFloat(text)
        if (isNaN(amount)) {
            this.setState({amount: 0})
        }
        else {
            this.setState({amount})
            if (amount > this.state.balance) {
                this.setState({
                    disabled: true
                })
            } else {
                this.setState({
                    disabled: false
                })
            }
        }
    }

    render() {
        return (
            <View style={{flex: 1}}>
                <Header
                    navigation={this.props.navigation}
                    back
                    title="Send money"
                />
                <Spinner
                    visible={this.state.loading}
                    textContent={this.state.loadingMessage}
                    textStyle={{color: '#FFF'}}
                />
                <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
                    <ScrollView keyboardDismissMode={'interactive'}>
                        <TextInput
                            title="Amount"
                            placeholder="Enter amount here"
                            autoCapitalize="none"
                            keyboardType="numeric"
                            underlineColorAndroid="white"
                            onChangeText={this.amountChanged}
                        />
                        <TextInput
                            title="Memo"
                            placeholder="Enter memo here"
                            autoCapitalize="none"
                            placeholderTextColor="lightgray"
                            multiline={true}
                            underlineColorAndroid="white"
                            onChangeText={(memo) => this.setState({memo:memo})}
                        />
                    </ScrollView>
                    {   this.state.disabled ?
                        <TouchableWithoutFeedback>
                            <View style={[styles.submit, {backgroundColor: Colors.lightgray}]}>
                                <Text style={{color: 'white', fontSize: 20}}>
                                    Amount exceeds balance
                                </Text>
                            </View>
                        </TouchableWithoutFeedback > :
                        <TouchableHighlight
                            style={styles.submit}
                            onPress={this.send}>

                            <Text style={{color: 'white', fontSize: 20}}>
                                Send
                            </Text>
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
        flexDirection: 'column',
        backgroundColor: 'white',
        paddingTop: 10
    },
    submit: {
        marginHorizontal: 20,
        marginBottom: 10,
        borderRadius: 25,
        height: 50,
        backgroundColor: Colors.lightblue,
        alignItems: 'center',
        justifyContent: 'center',
    },
})