import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput} from 'react-native'
import CountryPicker from 'react-native-country-picker-modal'
import Colors from './../config/colors'

export default class Account extends Component {

    constructor(props) {
        super(props)
        this.state = {
            cca2: 'US',
        }
    }

    render() {
        return (
            <View style={styles.inputContainer}>
                <Text style={styles.text}>
                    {this.props.title}
                </Text>
                <View style={styles.countryPicker}>
                    <CountryPicker
                        onChange={(value) => {
                            this.setState({cca2: value.cca2})
                            this.props.changeCountryCode(value.callingCode)
                        }}
                        closeable
                        filterable
                        cca2={this.state.cca2}
                        translation="eng"
                        styles={{flex: 1, justifyContent: 'center'}}
                    />
                    <TextInput
                        {...this.props}
                        style={styles.input}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        flex: 3,
        height: 50,
        width: "100%",
        paddingLeft: 0,
        fontSize: 16,
        color: Colors.black,
        fontWeight: 'normal',
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
    },
    country: {
        flex: 1,
    },
    text: {
        fontSize: 16,
        color: Colors.black,
    },
    inputContainer: {
        flexDirection: 'column',
        marginHorizontal: 20,
        paddingTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.lightgray,
    },
    countryPicker: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
})
