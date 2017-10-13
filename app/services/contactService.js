import Expo from 'expo'
import {Alert} from 'react-native'

var contactService = {
    getAllContacts: async () => {
        const time = Date.now();
        const permission = await Expo.Permissions.askAsync(Expo.Permissions.CONTACTS)
        if (permission.status !== 'granted') {
            Alert.alert(
                'Error',
                'Permission denied'
            )
            return
        }


        const getTotal = await Expo.Contacts.getContactsAsync({
            fields: [
                Expo.Contacts.PHONE_NUMBERS,
                Expo.Contacts.EMAILS,
                Expo.Contacts.THUMBNAIL,
            ],
            pageSize: 60,
            pageOffset: 0,
        })

        const contacts = await Expo.Contacts.getContactsAsync({
            fields: [
                Expo.Contacts.PHONE_NUMBERS,
                Expo.Contacts.EMAILS,
                Expo.Contacts.THUMBNAIL,
            ],
            pageSize: getTotal.total,
            pageOffset: 0,
        })
        /*const elapsed = (Date.now() - time) / 1000;
        Alert.alert('Contacts Read', `Read ${contacts.data.length} contacts in ${elapsed} seconds`);*/

        var data = []
        contacts.data.forEach((node) => {
            if (typeof (node.phoneNumbers) !== "undefined") {
                node.phoneNumbers.forEach((number) => {
                    var newData = {
                        name: node.name,
                        contact: number.number,
                    }
                    data.push(newData)
                })
            }
            if (typeof (node.emails) !== "undefined") {
                node.emails.forEach((email) => {
                    var newData = {
                        name: node.name,
                        contact: email.email,
                    }
                    data.push(newData)
                })
            }
        })

        data = data.sort((a, b) => {
            if (a.name < b.name) {
                return -1
            }
            else if (a.name > b.name) {
                return 1
            }
            else {
                return 0
            }
        })

        return data
    },
}

export default contactService
