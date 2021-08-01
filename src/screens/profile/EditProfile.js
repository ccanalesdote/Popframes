import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API } from '../../services/Axios';
import { Button, Input } from 'react-native-elements';
import { ConfirmDialog } from 'react-native-simple-dialogs';

const EditProfile = ({ ...props }) => {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMsg, setDialogMsg] = useState('');

    useEffect(() => {
        getUser();
    }, []);

    const getUser = async () => {
        let user_email = await AsyncStorage.getItem('email');
        let user_name = await AsyncStorage.getItem('name');
        setEmail(user_email);
        setName(user_name);
    }

    const saveChanges = async () => {
        let userId = await AsyncStorage.getItem('user_id');
        if (password == '') {
            try {
                setLoading(true);
                let response = await API.put('/user', {
                    user_id: userId,
                    email,
                    name,
                    password: ''
                });
                setLoading(false);
                if (response.data.state) {
                    let { email, name } = response.data.user;
                    AsyncStorage.setItem('email', email);
                    AsyncStorage.setItem('name', name);
                    setDialogVisible(true);
                    setDialogTitle('Success');
                    setDialogMsg(response.data.msg);
                } else {
                    setDialogVisible(true);
                    setDialogTitle('Error');
                    setDialogMsg(response.data.msg);
                }
            } catch (error) {
                setDialogVisible(true);
                setDialogTitle('Error');
                setDialogMsg(error.message);
            }
        } else {
            if (password === newPassword) {
                try {
                    setLoading(true);
                    let response = await API.put('/user', {
                        user_id: userId,
                        email,
                        name,
                        password
                    });
                    setLoading(false);
                    if (response.data.state) {
                        let { email, name } = response.data.user;
                        AsyncStorage.setItem('email', email);
                        AsyncStorage.setItem('name', name);
                        setDialogVisible(true);
                        setDialogTitle('Success');
                        setDialogMsg(response.data.msg);                        
                    } else {
                        setDialogVisible(true);
                        setDialogTitle('Error');
                        setDialogMsg(response.data.msg);                        
                    }
                } catch (error) {
                    setDialogVisible(true);
                    setDialogTitle('Error');
                    setDialogMsg(error.message);                    
                }
            } else {
                setDialogVisible(true);
                setDialogTitle('Error');
                setDialogMsg(`Passwords don't match`);                
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
                onPress={saveChanges}
            />
            <ConfirmDialog
                title={dialogTitle}
                message={dialogMsg}
                visible={dialogVisible}
                onTouchOutside={() => setDialogVisible(false)}
                positiveButton={{
                    title: "OK",
                    titleStyle: { color: '#4B187F' },
                    onPress: () => setDialogVisible(false)
                }}
            >
            </ConfirmDialog>
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
        backgroundColor: '#4B187F',
        borderWidth: 1,
        borderColor: '#4B187F',
        height: 52
    },
    mailText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold',
        color: '#FFF'
    }
});

export default EditProfile;