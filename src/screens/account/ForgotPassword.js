import React, { useState, useEffect } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, CheckBox, Input } from 'react-native-elements';
import { validateEmail } from '../../utils/Helpers';
import Icon from 'react-native-vector-icons/Ionicons';
import BackButton from '../../components/BackButton';

const ForgotPassword = ({ ...props }) => {

    const [email, setEmail] = useState('');

    const _LoginWithMail = async () => {
        if (email == '') {
            Alert.alert('Error', 'Please complete the email.');
            return false;
        }
        if (!validateEmail(email)) {
            Alert.alert('Error', 'Please enter a valid email.');
            return false;
        }
        try {
            let response = await fetch('http://167.172.134.231/api_rest/public/index.php/Usuarios/remember/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email
                }),
            });
            if (response.status == 401) {
                let result = await response.json();
                Alert.alert('Error', result.mensaje);
            } else if (response.status == 200) {
                let result = await response.json();
                Alert.alert('Success', 'If the email is in our records, you will receive an message.');
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    return (
        <ScrollView style={styles.root}>
            <View style={{ marginTop: 20 }} >
                <BackButton navigation={props.navigation} />
            </View>
            <View style={styles.imageContainer}>
                <Image
                    style={{ width: 70, height: 62, alignSelf: 'center' }}
                    source={require('../../assets/images/impri.png')} />
            </View>
            <Text
                allowFontScaling={false}
                style={styles.title}>
                Enter your email
                </Text>
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#FFF', marginTop: 20 }}
                inputStyle={{ color: '#FFF', fontFamily: 'SFUIText-Regular' }}
                placeholderTextColor='#FFF'
                placeholder='Email'
                keyboardType="email-address"
                onChangeText={text => setEmail(text)}
            />
            <Button
                activeOpacity={0.6}
                onPress={_LoginWithMail}
                buttonStyle={styles.mailButton}
                titleStyle={styles.mailText}
                title="Recover password"
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#F52D56',
        padding: 16
    },
    imageContainer: {
        width: 110,
        height: 110,
        alignSelf: 'center',
        marginBottom: 20,
        borderRadius: 30,
        backgroundColor: '#FFF',
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        fontSize: 30,
        fontFamily: 'SFUIText-Bold',
        color: '#FFFFFF'
    },
    mailButton: {
        paddingVertical: 12,
        marginVertical: 40,
        borderRadius: 10,
        backgroundColor: '#F7F7F7',
        borderWidth: 1,
        borderColor: '#F52D56',
        height: 52
    },
    mailText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold',
        color: '#F52D56'
    }
});

export default ForgotPassword;