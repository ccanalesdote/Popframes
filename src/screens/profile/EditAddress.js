import React, { useState, useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API } from '../../services/Axios';
import RNPickerSelect from 'react-native-picker-select';
import { Button, Input } from 'react-native-elements';
import Toast from 'react-native-tiny-toast'

const EditProfile = ({ ...props }) => {

    const [nameAddress, setNameAddress] = useState('');
    const [address, setAddress] = useState(null);
    const [number, setNumber] = useState('');
    const [city, setCity] = useState('');
    const [commune, setCommune] = useState('');
    const [province, setProvince] = useState('');
    const [region, setRegion] = useState('');
    const [selectRegions, setSelectRegions] = useState([]);
    const [selectProvinces, setSelectProvinces] = useState([]);
    const [selectCommunes, setSelectCommunes] = useState([]);
    const [loading, setLoading] = useState(false);

    const address_id = props.route.params.address_id;

    useEffect(() => {
        getAddress();
        getRegions();
    }, []);

    const getRegions = async () => {
        let response = await API.get('/regions');
        if (response.data.state) {
            let regions = [];
            for (const item of response.data.regions) {
                regions.push({ label: item.region, value: item.id });
            }
            setSelectRegions(regions);
        } else {
            Alert.alert('Error', response.data.msg);
        }
    }

    const getProvinces = async (region_id) => {
        let response = await API.get('/provinces', {
            params: {
                region_id
            }
        });
        if (response.data.state) {
            let provinces = [];
            for (const item of response.data.provinces) {
                provinces.push({ label: item.provincia, value: item.id });
            }
            setSelectProvinces(provinces);
        } else {
            Alert.alert('Error', response.data.msg);
        }
    }

    const getCommunes = async (province_id) => {
        let response = await API.get('/communes', {
            params: {
                province_id
            }
        });
        if (response.data.state) {
            let communes = [];
            for (const item of response.data.communes) {
                communes.push({ label: item.comuna, value: item.id });
            }
            setSelectCommunes(communes);
        } else {
            Alert.alert('Error', response.data.msg);
        }
    }

    const getAddress = async () => {
        const toast = Toast.showLoading('Cargando...');
        let response = await API.get('/address', {
            params: {
                address_id
            }
        });
        if (response.data.state) {
            let { name, address, number, city, commune_id, province_id, region_id } = response.data.address;
            await getProvinces(region_id);
            await getCommunes(province_id);
            setRegion(region_id);
            setProvince(province_id);
            setCommune(commune_id);
            setNameAddress(name);
            setAddress(address);
            setNumber(number.toString());
            setCity(city);
            Toast.hide(toast);
        } else {
            Alert.alert('Error', response.data.msg);
            Toast.hide(toast);
        }
    }

    const changeRegion = (value) => {
        setRegion(value);
        setProvince('');
        if (value) getProvinces(value);
    }

    const changeProvince = (value) => {
        setProvince(value);
        setCommune('');
        if (value) getCommunes(value);
    }

    const saveChanges = async () => {
        if (nameAddress != '' && address != '' && number != '' && city != '' && commune != '' && province != '' && region != '') {
            setLoading(true);
            let response = await API.put('/user_address', {
                address_id,
                name: nameAddress,
                address_line: address,
                number,
                city,
                commune_id: commune,
                province_id: province,
                region_id: region
            });
            setLoading(false);
            if (response.data.state) {
                Alert.alert('Correcto', response.data.msg);
            } else {
                Alert.alert('Error', response.data.msg);
            }
        } else {
            Alert.alert('Error', 'All fields must be completed');
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
                placeholder='Address'
                onChangeText={text => setAddress(text)}
                value={address}
            />
            <Input
                allowFontScaling={false}
                inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                placeholderTextColor='#C8C9CB'
                placeholder='Number'
                onChangeText={text => setNumber(text)}
                value={number}
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
            <RNPickerSelect
                /* useNativeAndroidPickerStyle={false} */
                style={pickerStyle}
                placeholder={{ label: 'Select a Region' }}
                onValueChange={(value) => changeRegion(value)}
                items={selectRegions}
                value={region}
            />
            <View
                style={{
                    marginTop: 0,
                    marginBottom: 20,
                    marginHorizontal: 10,
                    borderBottomColor: '#C8C9CB',
                    borderBottomWidth: 1
                }}
            />
            <RNPickerSelect
                /* useNativeAndroidPickerStyle={false} */
                style={pickerStyle}
                placeholder={{ label: 'Select a Province' }}
                onValueChange={(value) => changeProvince(value)}
                items={selectProvinces}
                value={province}
            />
            <View
                style={{
                    marginTop: 4,
                    marginBottom: 20,
                    marginHorizontal: 10,
                    borderBottomColor: '#C8C9CB',
                    borderBottomWidth: 1
                }}
            />
            <RNPickerSelect
                /* useNativeAndroidPickerStyle={false} */
                style={pickerStyle}
                placeholder={{ label: 'Select a Commune' }}
                onValueChange={(value) => setCommune(value)}
                items={selectCommunes}
                value={commune}
            />
            <View
                style={{
                    marginTop: 4,
                    marginBottom: 0,
                    marginHorizontal: 10,
                    borderBottomColor: '#C8C9CB',
                    borderBottomWidth: 1
                }}
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

const pickerStyle = StyleSheet.create({
    inputIOS: {
        color: "#000",
        marginVertical: 10,
        marginLeft: 20,
        fontSize: 16,
        fontFamily: 'SFUIText-Regular'
    },
    inputAndroid: {
        //color: "#929292",
        color: "#000",
        fontSize: 20,
        fontFamily: 'SFUIText-Regular',
        marginVertical: 4,
        marginLeft: 15
    }
});

export default EditProfile;