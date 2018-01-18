import React, {Component} from 'react'
import {View, Text, StyleSheet, TextInput} from 'react-native'
import Colors from './../config/colors'
import Icon from "react-native-vector-icons/Ionicons";

export default class Account extends Component {
    constructor() {
        super();
        this.state = {
            textColor: Colors.black,
            borderColor: Colors.lightgray
        }
    }

    render() {
        return (
            <View style={[styles.inputContainer, {borderBottomColor: this.state.borderColor}]}>
                {   this.props.editable ?
                    <View style={{flexDirection: 'row'}}>
                        <Text style={[styles.text, {color: this.state.textColor, flex: 1}]}>
                            {this.props.title}
                        </Text>
                        <Icon name="md-create"
                              size={35}
                              style={{padding: 10}}
                              onPress={this.props.editable}
                        />
                    </View> :
                    <Text style={[styles.text, {color: this.state.textColor}]}>
                        {this.props.title}
                    </Text>
                }
                <TextInput
                    onFocus={() => this.setState({
                        textColor: Colors.lightblue,
                        borderColor: Colors.lightblue
                    })}
                    onBlur={() => this.setState({
                        textColor: Colors.black,
                        borderColor: Colors.lightgray
                    })}
                    {...this.props}
                    underlineColorAndroid="white"
                    style={[styles.input, {fontSize: this.props.fontSize ? this.props.fontSize : 22}]}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    input: {
        height: 26,
        paddingLeft: 0,
        color: Colors.black,
        fontWeight: 'normal',
        borderColor: 'white',
        borderWidth: 1,
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        paddingBottom: 15,
    },
    inputContainer: {
        flexDirection: 'column',
        marginLeft: 20,
        marginRight: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
    },
})
