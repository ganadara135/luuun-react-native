import React, {Component} from 'react'
import {View, Text, StyleSheet, Image, Clipboard, TouchableHighlight, Alert} from 'react-native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import stellarService from './../../services/stellarService'
import Colors from './../../config/colors'
import Header from './../../components/header'
import Modal from 'react-native-modal'

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
                modalVisible: false,
            },
        }
    }

    async componentWillMount() {
        await this.popup()
        await this.getCryptoAddress()
    }

    popup = async () => {
        this.setState({
            modalVisible: true
        })
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
        this.setState({cryptoAddress})
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
                    style={{width: 300, height: 300}}
                    source={{uri: this.state.cryptoAddress.qrCode}}
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
                <Modal
                    animationInTiming={500}
                    animationOutTiming={500}
                    backdropTransitionOutTiming={500}
                    backdropTransitionInTiming={500}
                    backdropColor="black"
                    onBackdropPress={() => this.setState({modalVisible: false})}
                    isVisible={this.state.modalVisible}>
                    <View style={styles.modal}>
                        <View style={styles.bottomModal}>
                            <View style={[styles.button, {borderBottomWidth: 1, borderBottomColor: Colors.lightgray}]}>
                                <Text style={{color: Colors.black, fontSize: 22, fontWeight: 'bold'}}>
                                    Important Note
                                </Text>
                            </View>
                            <Text style={{color: Colors.black, paddingVertical: 20}}>
                                Please include a memo text when funding your Luuun account.
                                Your memo is <Text style={{fontWeight: 'bold'}}>helghardt.{"\n"}{"\n"}</Text>

                                <Text style={{color: Colors.black}}>
                                    If you do not specify a memo text when funding your account,
                                    we will put a 72h hold on any deposits. If you do not specify a memo text when
                                    funding your account,
                                    our system will not be able to detect your transaction and you will need to contact
                                    support.{"\n"}{"\n"}
                                </Text>
                                <Text style={{color: Colors.black}}>
                                    Luuun supports the Stellar federation address protocol.
                                    If your client supports this protocol too, you can send
                                    lumens to helghardt*<Text
                                    style={{color: Colors.lightblue}}>luuun.com.</Text>{"\n"}{"\n"}
                                </Text>
                                Happy Luuuning!
                            </Text>

                            <TouchableHighlight
                                style={[styles.button]}
                                onPress={() => {
                                    this.setState({modalVisible: false})
                                }}>
                                <Text style={styles.buttonText}>
                                    OK
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
    modal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomModal: {
        width: '80%',
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderColor: Colors.black,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        height: 60,
        width: "100%",
        alignItems: 'center',
        justifyContent: 'center',
        borderTopWidth: 1,
        borderTopColor: Colors.lightgray
    },
    buttonText: {
        fontSize: 18,
    },
})
