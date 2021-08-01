import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API } from '../../services/Axios';
import RNPickerSelect from 'react-native-picker-select';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-tiny-toast';
import { ConfirmDialog } from 'react-native-simple-dialogs';

const EditProfile = ({ ...props }) => {

    const [nameAddress, setNameAddress] = useState('');
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [countryName, setCountryName] = useState('');
    const [postCode, setPostCode] = useState('');
    const [city, setCity] = useState('');
    const [loading, setLoading] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMsg, setDialogMsg] = useState('');

    const address_id = props.route.params.address_id;

    useEffect(() => {
        getAddress();
    }, []);

    const getAddress = async () => {
        const toast = Toast.showLoading('Loading...');
        let response = await API.get('/address', {
            params: {
                address_id
            }
        });
        if (response.data.state) {
            console.log(response.data.address);
            let { name, address_line_1, address_line_2, city, country_name, post_code } = response.data.address;
            setAddressLine1(address_line_1);
            setAddressLine2(address_line_2);
            setCountryName(country_name);
            setPostCode(post_code);
            setNameAddress(name);
            setCity(city);
            Toast.hide(toast);
        } else {
            setDialogVisible(true);
            setDialogTitle('Error');
            setDialogMsg(response.data.msg);
            Toast.hide(toast);
        }
    }

    const saveChanges = async () => {
        if (nameAddress != '' && addressLine1 != '' && city != '' && countryName != '' && postCode != '') {
            setLoading(true);
            let response = await API.put('/user_address', {
                address_id,
                name: nameAddress,
                address_line_1: addressLine1,
                address_line_2: addressLine2,
                city,
                country_name: countryName,
                post_code: postCode
            });
            setLoading(false);
            if (response.data.state) {
                setDialogVisible(true);
                setDialogTitle('Success');
                setDialogMsg(response.data.msg);                
            } else {
                setDialogVisible(true);
                setDialogTitle('Error');
                setDialogMsg(response.data.msg);                
            }
        } else {
            setDialogVisible(true);
            setDialogTitle('Error');
            setDialogMsg('All fields must be completed');            
        }
    }

    return (
        <ScrollView style={styles.root}>
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 10 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                placeholderTextColor='#C8C9CB'
                placeholder='Address&nbsp;name'
                onChangeText={text => setNameAddress(text)}
                value={nameAddress}
            />
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                placeholderTextColor='#C8C9CB'
                placeholder='Address Line 1'
                onChangeText={text => setAddressLine1(text)}
                value={addressLine1}
            />
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                placeholderTextColor='#C8C9CB'
                placeholder='Address Line 2'
                onChangeText={text => setAddressLine2(text)}
                value={addressLine2}
            />
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                placeholderTextColor='#C8C9CB'
                placeholder='City'
                onChangeText={text => setCity(text)}
                value={city}
            />
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                placeholderTextColor='#C8C9CB'
                placeholder='Country'
                onChangeText={text => setCountryName(text)}
                value={countryName}
            />
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                placeholderTextColor='#C8C9CB'
                placeholder='Post Code'
                onChangeText={text => setPostCode(text)}
                value={postCode}
            />
            <Button
                activeOpacity={0.6}
                buttonStyle={styles.mailButton}
                titleStyle={styles.mailText}
                loading={loading}
                title="Save changes"
                onPress={saveChanges}
            />
            <View style={{ height: 20 }} />
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