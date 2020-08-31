import React from 'react';
import { Text } from 'react-native';
import Ripple from 'react-native-material-ripple';
import { Ionicons } from 'react-native-vector-icons';
import Icon from 'react-native-vector-icons/Ionicons';

const BackButton = ({ onPress, navigation, color = '#000' }) => {

    console.log(navigation);

    return (
        <Ripple style={{
            paddingLeft: 10,
        }} rippleContainerBorderRadius={40} onPress={onPress ? onPress : () => {
            if (navigation)
                navigation.goBack();
        }}>
            <Icon name="ios-arrow-back" size={28} color="#FFF" />
        </Ripple>
    )
}

export default BackButton;