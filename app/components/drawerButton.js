import React from 'react'
import { TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import PropTypes from 'prop-types';

const DrawerButton = ({ navigation }) => (
  <TouchableOpacity style={{padding: 10}} underlayColor={'white'}>
    <Icon
      name="ios-menu-outline"
      size={30}
      color="white"
      onPress={() => navigation.navigate('DrawerOpen')}
    />
  </TouchableOpacity>
)

DrawerButton.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default DrawerButton
