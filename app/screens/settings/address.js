import React, {Component} from 'react'
import {View, Alert, Text, StyleSheet, KeyboardAvoidingView, ScrollView, TouchableHighlight} from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import UserInfoService from './../../services/userInfoService'
import TextInput from './../../components/textInput'
import Colors from './../../config/colors'
import Header from './../../components/header'

export default class Address extends Component {
    static navigationOptions = {
        title: 'Address',
    }

    constructor() {
        super()

        this.state = {
            line_1: '',
            line_2: '',
            city: '',
            state_province: '',
            country: 'US',
            postal_code: '',
        }
    }

    componentDidMount() {
        this.getAddress()
    }

    getAddress = async () => {
        let responseJson = await UserInfoService.getAddress()
        console.log(responseJson)
        if (responseJson.status === "success") {
            const address = responseJson.data
            this.setState({
                line_1: address.line_1,
                line_2: address.line_2,
                city: address.city,
                state_province: address.state_province,
                country: address.country !== "" ? address.country : 'US',
                postal_code: address.postal_code,
            })
        }
        else {
            Alert.alert('Error',
                responseJson.message,
                [{text: 'OK'}])
        }
    }

    save = async () => {
        let responseJson = await UserInfoService.updateAddress(this.state)
        //console.log(responseJson)
        if (responseJson.status === "success") {
            this.props.navigation.goBack()
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
                    title="Address"
                />
                <KeyboardAvoidingView style={styles.container} behavior={'padding'}>
                    <ScrollView keyboardDismissMode={'interactive'}>

                        <TextInput
                            title="Address Line 1"
                            placeholder="e.g. Plot-02, Road-08"
                            autoCapitalize="none"
                            value={this.state.line_1}
                            onChangeText={(line_1) => this.setState({line_1})}
                        />

                        <TextInput
                            title="Address Line 2"
                            placeholder="e.g. Mohakhali C/A, Dhaka"
                            autoCapitalize="none"
                            value={this.state.line_2}
                            onChangeText={(line_2) => this.setState({line_2})}
                        />

                        <TextInput
                            title="City"
                            placeholder="e.g. Capetown"
                            autoCapitalize="none"
                            value={this.state.city}
                            onChangeText={(city) => this.setState({city})}
                        />

                        <TextInput
                            title="State province"
                            placeholder="e.g. Western Cape"
                            autoCapitalize="none"
                            value={this.state.state_province}
                            onChangeText={(state_province) => this.setState({state_province})}
                        />

                        <View style={styles.pickerContainer}>
                            <Text style={[styles.text, {flex: 1}]}>
                                Country
                            </Text>
                            <CountryPicker
                                onChange={(value) => {
                                    this.setState({country: value.cca2});
                                }}
                                cca2={this.state.country}
                                closeable
                                filterable
                                translation="eng"
                                styles={{flex: 1, justifyContent: 'center'}}
                            />
                        </View>

                        <TextInput
                            title="Postal code"
                            placeholder="e.g. 1212"
                            autoCapitalize="none"
                            value={this.state.postal_code}
                            onChangeText={(postal_code) => this.setState({postal_code})}
                        />
                    </ScrollView>
                    <TouchableHighlight
                        style={styles.submit}
                        onPress={() => this.save()}>
                        <Text style={{color: 'white', fontSize: 18}}>
                            Save
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
        backgroundColor: 'white',
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
    text: {
        fontSize: 18,
        color: Colors.black,
    },
    pickerContainer: {
        flexDirection: 'row',
        padding: 15,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightgray,
    },
})

