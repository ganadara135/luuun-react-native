import React, { Component } from 'react'
import {
    View,
    StyleSheet,
    AsyncStorage,
    TouchableHighlight,
    Alert,
    Text,
    ScrollView,
    ListView,
    Image,
    TouchableWithoutFeedback
} from 'react-native'
import moment from 'moment'
import PopupDialog from 'react-native-popup-dialog'
import UserInfoService from './../../services/userInfoService'
import Transactions from './transactions'
import Auth from './../../util/auth'
import ResetNavigation from './../../util/resetNavigation'
import Colors from './../../config/colors'
import StellarService from './../../services/stellarService'
import AccountService from './../../services/accountService'
import Header from './../../components/header'
import HomeCard from './../../components/homeCard'
import Swiper from 'react-native-swiper'

const renderPagination = (index, total, context) => {
    return (
        <View style={styles.paginationStyle}>
            <Text style={{ color: 'grey' }}>

            </Text>
        </View>
    )
}

export default class Home extends Component {
    static navigationOptions = {
        label: 'Home',
    }

    constructor(props) {
        super(props)
        this.state = {
            balance: 0,
            showTransaction: false,
            symbol: '',
            dataToShow: {
                currency: {},
            },
            selectedCurrency: -1,
            company: {
                name: '',
            },
            code: '',
            dataSource: new ListView.DataSource({
                rowHasChanged: (r1, r2) => JSON.stringify(r1) !== JSON.stringify(r2),
            }),
            reference: '',
            creditSwitch: true,
            debitSwitch: true,
        }
    }

    async componentWillMount() {
        try {
            const token = await AsyncStorage.getItem('token')
            if (token === null) {
                this.logout()
            }
            return token
        }
        catch (error) {
        }
    }

    componentDidMount() {
        this.getBalanceInfo()
        this.getUserInfo()
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
            let settings = responseJson.data.settings
            if (settings.allow_transactions === false) {
                this.setState({
                    creditSwitch: false,
                    debitSwitch: false
                })
            }
            if (settings.allow_debit_transactions === false) {
                this.setState({
                    debitSwitch: false
                })
            }
            if (settings.allow_credit_transactions === false) {
                this.setState({
                    creditSwitch: false
                })
            }
            const token = await AsyncStorage.getItem('token')
            if (token === null) {
                await this.logout()
            }
            else {
                let stellar_address = await StellarService.getAddress()
                if (stellar_address.status === 'error') {
                    ResetNavigation.dispatchToSingleRoute(this.props.navigation, "SetUsername")
                }
                else {
                    this.setState({ ready: true })
                }
            }
            //this.setState({ ready: true })
        }
        else {
            await this.logout()
        }
    }

    getBalanceInfo = async () => {
        let responseJson = await UserInfoService.getActiveAccount()
        if (responseJson.status === "success") {
            const account = responseJson.data.results[0].currencies[0];
            AsyncStorage.setItem("account_reference",JSON.stringify(responseJson.data.results[0].reference));
            let settings = account.settings
            if (settings.allow_transactions === false) {
                this.setState({
                    creditSwitch: false,
                    debitSwitch: false
                })
            }
            if (settings.allow_debit_transactions === false) {
                this.setState({
                    debitSwitch: false
                })
            }
            if (settings.allow_credit_transactions === false) {
                this.setState({
                    creditSwitch: false
                })
            }
            AsyncStorage.setItem('currency', JSON.stringify(account.currency))
            this.setState({
                account: responseJson.data.results[0].name,
                default: account,
                code: account.currency.code,
                symbol: account.currency.symbol,
                reference: responseJson.data.results[0].reference,
                balance: this.setBalance(account.available_balance, account.currency.divisibility),
            })
            let responseJson2 = await AccountService.getAllAccountCurrencies(this.state.reference)
            if (responseJson2.status === "success") {
                const currencies = responseJson2.data.results
                this.setState({
                    currencies: currencies,
                    dataSource: this.state.dataSource.cloneWithRows(currencies),
                    selectedCurrency: -1,
                })
            }
        }
        else {
            this.logout()
        }
    }

    logout = () => {
        Auth.logout(this.props.navigation)
    }

    showDialog = (item) => {
        this.setState({ dataToShow: item });
        this.popupDialog.show()
    }

    getAmount = (amount = 0, divisibility) => {
        for (let i = 0; i < divisibility; i++) {
            amount = amount / 10
        }

        return amount.toFixed(8).replace(/\.?0+$/, "")
    }

    tap1 = () => {
        this.setState({
            showTransaction: !this.state.showTransaction,
        });
    }

    longTap1 = async () => {
        Alert.alert(
            "Are you sure?",
            "Set it as active currency?",
            [
                { text: 'Yes', onPress: () => this.changeAccount() },
                {
                    text: 'No',
                    style: 'cancel',
                },
            ]
        )
    }

    tap2 = () => {
        let index = (this.state.selectedCurrency + 1) % this.state.currencies.length
        if (this.state.currencies[index].currency.symbol === this.state.symbol) {
            index = (index + 1) % this.state.currencies.length
        }
        this.setState({
            transactionView: true,
            selectedCurrency: index,
            code: this.state.currencies[index].currency.code,
            symbol: this.state.currencies[index].currency.symbol,
            balance: this.setBalance(this.state.currencies[index].available_balance, this.state.currencies[index].currency.divisibility),
        });
    }

    changeAccount = async () => {
        let responseJson = await AccountService.setActiveCurrency(this.state.reference, this.state.currencies[this.state.selectedCurrency].currency.code)
        if (responseJson.status === "success") {
            Alert.alert(
                "Success",
                "Your active currency has been changed successfully.",
                [{ text: 'OK' }]
            )
        }
    }

    render() {
        /*let swipeBtns = [{
            text: 'Show',
            backgroundColor: Colors.lightgray,
            underlayColor: 'rgba(0, 0, 0, 1, 0.6)',
            onPress: () => this.props.navigation.navigate(
                'AccountCurrencies',
                {reference: this.state.reference}
            )
        }];*/
        return (
            <View style={styles.container}>
                <Header
                    navigation={this.props.navigation}
                    drawer
                    creditSwitch={this.state.creditSwitch}
                    debitSwitch={this.state.debitSwitch}
                />
                <View style={styles.balance}>
                    <View style={{ flexDirection: 'row' }}>
                        <Text style={{ fontSize: 25, color: 'white' }}>
                            {this.state.symbol}
                        </Text>
                        <Text style={{ paddingLeft: 5, fontSize: 40, color: 'white' }}
                        onPress={() => this.tap2()}
                        onLongPress={() => this.longTap1()}>
                            {this.state.balance.toFixed(4).replace(/0{0,2}$/, "")}
                        </Text>
                    </View>
                </View>
                <View style={styles.transaction}>
                  <Swiper renderPagination={renderPagination}
                            loop={false}>
                            <View style={{ flex: 1, backgroundColor: Colors.lightgray, paddingHorizontal: 20 }}>
                                <ScrollView showsVerticalScrollIndicator={false}>
                                    <HomeCard
                                        key={0}
                                        title="Welcome to Luuun"
                                        image={require('./../../../assets/icons/leap.png')}
                                        text="Send money globally instantly and securely using the Stellar network!"
                                        buttonText="Cool" />
                                    <HomeCard
                                        key={1}
                                        title="About Stellar"
                                        image={require('./../../../assets/icons/demo1.png')}
                                        text="Tell your customers what your app is about."
                                        buttonText="Let's go" />
                                    <HomeCard
                                        key={2}
                                        title="This is a demo app"
                                        image={require('./../../../assets/icons/demo2.png')}
                                        text="Note that you have to verify your email or mobile number to claim funds that has been sent to you."
                                        buttonText="Cool" />
                                    <HomeCard
                                        key={3}
                                        title="Get verified"
                                        image={require('./../../../assets/icons/demo3.png')}
                                        text="Go to get verified page"
                                        buttonText="Verify"
                                        navigation={this.props.navigation} />
                                    <View
                                        key={4}
                                        style={styles.falseView} />

                                </ScrollView>

                            </View>
                            <Transactions
                                updateBalance={this.getBalanceInfo}
                                showDialog={this.showDialog}
                                logout={this.logout} />
                        </Swiper>
                </View>
                <View style={styles.buttonbar}>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => this.props.navigation.navigate("Receive")}>
                        <Text style={{ color: 'white', fontSize: 20 }}>
                            Receive
                        </Text>
                    </TouchableHighlight>
                    <TouchableHighlight
                        style={[styles.submit, { marginLeft: 25 }]}
                        onPress={() => this.props.navigation.navigate("SendTo")}>

                        <Text style={{ color: 'white', fontSize: 20 }}>
                            Send
                        </Text>
                    </TouchableHighlight>
                </View>
                <PopupDialog
                    ref={(popupDialog) => {
                        this.popupDialog = popupDialog;
                    }}
                    height={250}>
                    <View style={{ flex: 1 }}>
                        <View style={{ flex: 3, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
                            <Image
                                source={require('./../../../assets/icons/placeholder.png')}
                                style={{ height: 80, width: 80, margin: 10 }}
                            />
                            <Text style={{ fontSize: 20, color: Colors.black }}>
                                {this.state.dataToShow.label + ": " + this.state.dataToShow.currency.symbol + this.getAmount(this.state.dataToShow.amount, this.state.dataToShow.currency.divisibility)}
                            </Text>
                        </View>
                        <View style={{
                            flex: 1,
                            flexDirection: 'row',
                            borderTopColor: Colors.lightgray,
                            borderTopWidth: 1,
                            paddingLeft: 20,
                            paddingRight: 20
                        }}>
                            <View style={{ flex: 2, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 15, alignSelf: "flex-start", color: Colors.black }}>
                                    {moment(this.state.dataToShow.created).format('lll')}
                                </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center' }}>
                                <Text style={{ fontSize: 15, alignSelf: "flex-end", color: Colors.black }}>
                                    {this.state.dataToShow.status}
                                </Text>
                            </View>
                        </View>
                    </View>
                </PopupDialog>
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
    balance: {
        flex: 1,
        backgroundColor: Colors.lightblue,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    transaction: {
        flex: 5,
        backgroundColor: Colors.lightgray,
    },
    buttonbar: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        paddingHorizontal: 25,
        justifyContent: 'center',
        paddingVertical: 10,
        backgroundColor: 'transparent',
    },
    floatView: {
        position: 'absolute',
        width: 100,
        height: 100,
        top: 200,
        left: 40,
        backgroundColor: 'green',
    },
    submit: {
        backgroundColor: Colors.lightblue,
        height: 50,
        borderRadius: 25,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
})
