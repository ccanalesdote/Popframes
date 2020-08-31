import React, { useState, useEffect } from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button, CheckBox, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';

const EditProfile = ({ ...props }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        let email = await AsyncStorage.getItem('email');
        let name = await AsyncStorage.getItem('name');
        setEmail(email);
        setName(name);
    }

    const _saveChanges = async () => {
        let apiToken = await AsyncStorage.getItem('token');
        let userId = await AsyncStorage.getItem('user_id');
        if (password == '') {
            try {
                setLoading(true);
                let response = await fetch('http://api.impri.cl/user', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'apiToken': apiToken
                    },
                    body: JSON.stringify({
                        user_id: userId,
                        email,
                        name,
                        password: ''
                    }),
                });
                let result = await response.json();
                setLoading(false);
                if (result.state) {
                    let { email, name } = result.user;
                    AsyncStorage.setItem('email', email);
                    AsyncStorage.setItem('name', name);
                    Alert.alert('Success', result.msg);
                } else {
                    Alert.alert('Error', result.msg);
                }
            } catch (error) {
                Alert.alert(error.message);
            }
        } else {
            if (password === newPassword) {
                try {
                    setLoading(true);
                    let response = await fetch('http://api.impri.cl/user', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'apiToken': apiToken
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            email,
                            name,
                            password
                        }),
                    });
                    let result = await response.json();
                    setLoading(false);
                    if (result.state) {
                        let { email, name } = result.user;
                        AsyncStorage.setItem('email', email);
                        AsyncStorage.setItem('name', name);
                        Alert.alert('Success', result.msg);
                    } else {
                        Alert.alert('Error', result.msg);
                    }
                } catch (error) {
                    Alert.alert(error.message);
                }
            } else {
                Alert.alert('Error', `Passwords don't match.`);
            }
        }
    }

    return (
        <ScrollView style={styles.root}>
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#929292', marginTop: 24 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10 }}
                placeholderTextColor='#C8C9CB'
                placeholder='Name'
                onChangeText={text => setName(text)}
                value={name}
            />
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#929292', marginTop: 20 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10 }}
                placeholderTextColor='#C8C9CB'
                placeholder='Email'
                onChangeText={text => setEmail(text)}
                value={email}
            />
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#929292', marginTop: 20 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10 }}
                placeholderTextColor='#C8C9CB'
                secureTextEntry={true}
                onChangeText={text => setPassword(text)}
                placeholder='New&nbsp;password'
            />
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#929292', marginTop: 20 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10 }}
                placeholderTextColor='#C8C9CB'
                secureTextEntry={true}
                onChangeText={text => setNewPassword(text)}
                placeholder='Repeat&nbsp;new&nbsp;password'
            />
            <Text
                style={styles.title}>
                If you don't want to change the password, just leave the fields blank.
			</Text>
            <Button
                activeOpacity={0.6}
                buttonStyle={styles.mailButton}
                titleStyle={styles.mailText}
                loading={loading}
                title="Save changes"
                onPress={_saveChanges}
            />
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    root: {
        backgroundColor: '#FFF',
        padding: 20,
    },
    title: {
        marginTop: 40,
        textAlign: 'center',
        fontSize: 16,
        fontFamily: 'SFUIText-Regular',
        color: '#929292'
    },
    mailButton: {
        paddingVertical: 12,
        marginTop: 40,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#F52D56',
        borderWidth: 1,
        borderColor: '#F52D56',
        height: 52
    },
    mailText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold',
        color: '#FFF'
    }
});

export default EditProfile;