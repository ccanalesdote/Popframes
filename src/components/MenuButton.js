import React from 'react';
import { Text } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Ionicons } from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/Feather';
import { DrawerActions } from '@react-navigation/native';

const MenuButton = ({ onPress, navigation, color = '#000' }) => {

    return (
        <Ripple style={{
            paddingHorizontal: 16,
        }} rippleContainerBorderRadius={40} onPress={onPress ? onPress : () => {
            navigation.dispatch(DrawerActions.toggleDrawer());
        }}>
            <Icon name="align-left" size={28} color="#FFF" />
        </Ripple>
    )
}

export default MenuButton;