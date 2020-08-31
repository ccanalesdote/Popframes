import React from 'react';
import { ActivityIndicator, Text, StyleSheet } from 'react-native';
import Ripple from 'react-native-material-ripple';
import Icon from 'react-native-vector-icons/Ionicons';

const Button = ({
    text,
    color,
    textColor,
    disabled,
    extraStyles = {},
    leftIcon,
    onPress,
    loading = false,
    ...props
}) => {
    return (
        <Ripple style={[{
            backgroundColor: color,
            borderRadius: 10,
            paddingVertical: 10,
            flexDirection: 'row',
        }, extraStyles.root]} onPress={onPress}>
            {leftIcon ? <Icon style={styles.icon} name={leftIcon} size={32} color="#FFF" /> : <Icon style={styles.icon} name="logo-instagram" size={32} color="#F7F7F7" />}
            {
                loading ?
                    <ActivityIndicator
                        color="#FFF"
                        style={{ flex: 1, justifyContent: 'center' }} /> :
                    <Text
                        style={[styles.button, extraStyles.text, { color: textColor }]}>
                        {text}
                    </Text>
            }

        </Ripple>
    )
}

const styles = StyleSheet.create({
    button: {
        alignSelf: 'center',
        fontFamily: 'SFUIText-SemiBold',
        fontSize: 16,
        textAlign: 'center'
    },
    icon: {
        marginLeft: '6%',
        marginRight: '10%'
    }
});

export default Button;