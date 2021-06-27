import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { API, FormAPI } from '../../services/Axios';
import { Card, CheckBox, Input } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import RNPickerSelect from 'react-native-picker-select';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { useRecoilValue } from 'recoil';
import { calculateDescriptionTotal, calculateTotal } from "../../utils/Helpers";
import { croppedImages } from '../../store/atoms';
import { color } from 'react-native-reanimated';
import { ApplePay } from 'react-native-apay';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Address = ({ ...props }) => {

    // gestión de estado
    const croppedImagesSelected = useRecoilValue(croppedImages);

    // hooks
    const [addressId, setAddressId] = useState(0);
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
    const [saveNew, setSaveNew] = useState(false);
    const [showNewBox, setShowNewBox] = useState(true);
    const [blockAddress, setBlockAddress] = useState(false);
    const [selectAddress, setSelectAddress] = useState([]);
    const [imagesCount, setImagesCount] = useState(0);
    const [totalDescription, setTotalDescription] = useState('Pay $0');
    const [total, setTotal] = useState(0);
    const [subTotal, setSubTotal] = useState(0);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [promoCode, setPromoCode] = useState('');
    const [promoCodeID, setPromoCodeID] = useState('');
    const [discount, setDiscount] = useState(0);
    const [load, setLoad] = useState(false);
    const [loadingPhotos, setLoadingPhotos] = useState(false);

    useEffect(() => {
        uploadPhotos();
        // getUserAddress();
        // getRegions();
        // getAmount();
    }, []);

    const getAmount = async () => {
        let images_count = await AsyncStorage.getItem('images_count');
        let total = calculateDescriptionTotal(images_count, 'Pay');
        let number = calculateTotal(images_count);
        let price = number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        setImagesCount(images_count);
        setTotalDescription(total);
        setSubTotal(price);
        setTotal(price);
    }

    const pay = async () => {
        console.log('final test');
        const requestData = {
            merchantIdentifier: 'merchant.com.popframes',
            supportedNetworks: ['mastercard', 'visa'],
            countryCode: 'US',
            currencyCode: 'USD',
            paymentSummaryItems: [
                {
                    label: 'Payment Test',
                    amount: '0.50',
                },
            ],
        }
        console.log(requestData);
        // Check if ApplePay is available
        if (ApplePay.canMakePayments) {
            ApplePay.requestPayment(requestData)
                .then((paymentData) => {
                    console.log(paymentData);
                    // Simulate a request to the gateway
                    setTimeout(() => {
                        // Show status to user ApplePay.SUCCESS || ApplePay.FAILURE
                        ApplePay.complete(ApplePay.SUCCESS)
                            .then(() => {
                                console.log('completed');
                                Alert.alert('OK', 'pago realizado correctamente');
                                // do something
                            });
                    }, 1000);
                });
        };
        /* if (loadingPhotos) {
            Alert.alert('Loading...', 'Wait a few seconds, not all your photos have been uploaded yet.');
        } else {
            if (addressId == 0) {
                let address_id = await saveAddress();
                await updateOrder(address_id);
            } else {
                await updateOrder(addressId);
            }
            createZipFile();
            setAddressId(0);
            cleanAddress();
            props.navigation.navigate('Invoice');
        } */
    }

    const uploadPhotos = async () => {
        try {
            setLoadingPhotos(true);
            let orderID = await AsyncStorage.getItem('order_id');
            let token = await AsyncStorage.getItem('token');
            console.log('orderID', orderID);
            let formData = new FormData();
            formData.append("order_id", orderID);
            formData.append("test", 'prueba');
            let i = 0;
            console.log('array', croppedImagesSelected);
            for (const item of croppedImagesSelected) {
                i++;
                var ext = (item.cropped_uri).split(".");
                let name = `${Date.now().toString()}_${item.key}_${i}`;
                let file_name = `${name}.${ext[(ext.length - 1)]}`;
                console.log(file_name);
                console.log(item.cropped_uri);
                formData.append("doc", {
                    uri: item.cropped_uri,
                    type: item.type,
                    name: file_name
                });
            }
            let response = await fetch('http://localhost:8082/file', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': token
                },
                body: formData
            });
            let result = await response.json();
            console.log(result);
            setLoadingPhotos(false);
        } catch (error) {
            console.log('There has been a problem with your fetch operation: ' + error.message);
            throw error;
        }
    }

    const updateOrder = async (address_id) => {
        let token = await AsyncStorage.getItem('token');
        let order_id = await AsyncStorage.getItem('order_id');
        let response = await fetch(`http://api.impri.cl/order`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                order_id,
                address_id,
                promocode_id: promoCodeID,
                discount,
                sub_total: subTotal,
                total
            })
        });
        let result = await response.json();
        if (result.state) {
            Alert.alert('OK', result.msg);
        } else {
            Alert.alert('Error', result.msg);
        }
    }

    const createZipFile = async () => {
        let token = await AsyncStorage.getItem('token');
        let order_id = await AsyncStorage.getItem('order_id');
        let response = await fetch(`http://api.impri.cl/files?order_id=${order_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        let result = await response.json();
        console.log(result);
    }

    const saveAddress = async () => {
        if (nameAddress != '' && address != '' && number != '' && city != '' && commune != '' && province != '' && region != '') {
            setLoad(true);
            let token = await AsyncStorage.getItem('token');
            let UID = await AsyncStorage.getItem('user_id');
            let response = await fetch('http://api.impri.cl/user_address', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({
                    user_id: UID,
                    name: nameAddress,
                    address_line: address,
                    number,
                    city,
                    commune_id: commune,
                    province_id: province,
                    region_id: region
                }),
            });
            let result = await response.json();
            setLoad(false);
            if (result.state) {
                let address_id = result.address_id;
                setAddressId(address_id);
                return address_id;
            } else {
                Alert.alert('Error', result.msg);
            }
        } else {
            Alert.alert('Error', 'All address fields must be completed');
        }
    }

    const getUserAddress = async () => {
        let token = await AsyncStorage.getItem('token');
        let UID = await AsyncStorage.getItem('user_id');
        let response = await fetch(`http://api.impri.cl/user_address?user_id=${UID}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        let result = await response.json();
        if (result.state) {
            let array = [];
            (result.address).map((item) => {
                array.push({ label: item.name, value: item.id });
            });
            setSelectAddress(array);
        } else {
            //Alert.alert('Aviso', result.msg);
        }
    }

    const getAddress = async (address_id) => {
        let token = await AsyncStorage.getItem('token');
        let response = await fetch(`http://api.impri.cl/address?address_id=${address_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        let result = await response.json();
        if (result.state) {
            let { name, address, number, city, commune_id, province_id, region_id } = result.address;
            await getProvinces(region_id);
            await getCommunes(province_id);
            setRegion(region_id);
            setProvince(province_id);
            setCommune(commune_id);
            setNameAddress(name);
            setAddress(address);
            setNumber(number.toString());
            setCity(city);
            setBlockAddress(true);
        } else {
            Alert.alert('Error', result.msg);
        }
    }

    const getRegions = async () => {
        let token = await AsyncStorage.getItem('token');
        let response = await fetch(`http://api.impri.cl/regions`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        let result = await response.json();
        if (result.state) {
            let regions = [];
            (result.regions).map((item) => {
                regions.push({ label: item.region, value: item.id });
            });
            setSelectRegions(regions);
        } else {
            Alert.alert('Error', result.msg);
        }
    }

    const getProvinces = async (region_id) => {
        let token = await AsyncStorage.getItem('token');
        let response = await fetch(`http://api.impri.cl/provinces?region_id=${region_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        let result = await response.json();
        if (result.state) {
            let provinces = [];
            (result.provinces).map((item) => {
                provinces.push({ label: item.provincia, value: item.id });
            });
            setSelectProvinces(provinces);
        } else {
            Alert.alert('Error', result.msg);
        }
    }

    const getCommunes = async (province_id) => {
        let token = await AsyncStorage.getItem('token');
        let response = await fetch(`http://api.impri.cl/communes?province_id=${province_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            }
        });
        let result = await response.json();
        if (result.state) {
            let communes = [];
            (result.communes).map((item) => {
                communes.push({ label: item.comuna, value: item.id });
            });
            setSelectCommunes(communes);
        } else {
            Alert.alert('Error', result.msg);
        }
    }

    const changeAddress = (value) => {
        setAddressId(value);
        if (value > 0) {
            getAddress(value);
            setShowNewBox(false);
        } else {
            cleanAddress();
        }
    }

    const cleanAddress = () => {
        setSaveNew(false);
        setShowNewBox(true);
        setBlockAddress(false);
        setNameAddress('');
        setAddress('');
        setNumber('');
        setCity('');
        setRegion('');
        setProvince('');
        setCommune('');
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

    const getPromoDiscount = async (promo_code) => {
        if (!promoCode) {
            Alert.alert('Error', 'You must enter the promocode');
            return false;
        }
        let token = await AsyncStorage.getItem('token');
        let response = await fetch(`http://api.impri.cl/promo`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                promo_code
            }),
        });
        let result = await response.json();
        if (result.state) {
            let { id, discount } = result.code;
            let discount_format = discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            let subtotal = calculateTotal(imagesCount);
            let total = subtotal - discount;
            let price = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            setTotalDescription(`Pay ${price}`);
            setDiscount(discount_format);
            setTotal(price);
            setPromoCodeID(id);
        } else {
            Alert.alert('Error', result.msg);
        }
        setDialogVisible(false);
        setPromoCode('');
    }

    const pickerStyle = StyleSheet.create({
        inputIOS: {
            color: blockAddress ? '#929292' : '#000',
            marginVertical: 10,
            marginLeft: 20,
            fontSize: 16,
            fontFamily: 'SFUIText-Regular'
        },
        inputAndroid: {
            color: blockAddress ? '#929292' : '#000',
            marginVertical: 4,
            marginLeft: 15
        },
        iconContainer: {
            top: 5,
            right: 15,
        }
    });

    return (
        <View style={styles.root}>
            <ScrollView
                showsVerticalScrollIndicator={false} >
                <Text
                    allowFontScaling={false}
                    style={styles.title}>
                    Shipping address
                </Text>
                <Card containerStyle={{ borderRadius: 10, borderColor: '#FFF', padding: 0 }}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 20, marginBottom: 16 }}>
                        <Text
                            allowFontScaling={false}
                            style={styles.total}>
                            Addresses previously saved
                        </Text>
                    </View>
                    <RNPickerSelect
                        /* useNativeAndroidPickerStyle={false} */
                        style={pickerStyle}
                        placeholder={{ label: 'New address', value: 0 }}
                        onValueChange={(value) => changeAddress(value)}
                        items={selectAddress}
                        value={addressId}
                        Icon={() => {
                            return <Icon name="ios-chevron-down" size={28} color="#C8C9CB" />;
                        }}
                    />
                    <View
                        style={{
                            marginTop: 0,
                            marginBottom: 0,
                            marginHorizontal: 10,
                            borderBottomColor: '#C8C9CB',
                            borderBottomWidth: 1
                        }}
                    />
                    <Input
                        allowFontScaling={false}
                        inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 24 }}
                        inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                        placeholderTextColor='#C8C9CB'
                        placeholder='Address&nbsp;name'
                        onChangeText={text => setNameAddress(text)}
                        disabled={blockAddress}
                        value={nameAddress}
                    />
                    <Input
                        allowFontScaling={false}
                        inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                        inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                        placeholderTextColor='#C8C9CB'
                        placeholder='Address'
                        onChangeText={text => setAddress(text)}
                        disabled={blockAddress}
                        value={address}
                    />
                    <Input
                        allowFontScaling={false}
                        inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                        inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                        placeholderTextColor='#C8C9CB'
                        placeholder='Number'
                        onChangeText={text => setNumber(text)}
                        disabled={blockAddress}
                        value={number}
                    />
                    <Input
                        allowFontScaling={false}
                        inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                        inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                        placeholderTextColor='#C8C9CB'
                        placeholder='City'
                        onChangeText={text => setCity(text)}
                        disabled={blockAddress}
                        value={city}
                    />
                    <View style={{ height: 0 }} />
                    <RNPickerSelect
                        /* useNativeAndroidPickerStyle={false} */
                        style={pickerStyle}
                        placeholder={{ label: 'Select a Region' }}
                        onValueChange={(value) => changeRegion(value)}
                        items={selectRegions}
                        disabled={blockAddress}
                        value={region}
                        Icon={() => {
                            return <Icon name="ios-chevron-down" size={28} color="#C8C9CB" />;
                        }}
                    />
                    <View
                        style={{
                            marginTop: 0,
                            marginBottom: 24,
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
                        disabled={blockAddress}
                        value={province}
                        Icon={() => {
                            return <Icon name="ios-chevron-down" size={28} color="#C8C9CB" />;
                        }}
                    />
                    <View
                        style={{
                            marginTop: 0,
                            marginBottom: 24,
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
                        disabled={blockAddress}
                        value={commune}
                        Icon={() => {
                            return <Icon name="ios-chevron-down" size={28} color="#C8C9CB" />;
                        }}
                    />
                    <View
                        style={{
                            marginTop: 0,
                            marginBottom: 10,
                            marginHorizontal: 10,
                            borderBottomColor: '#C8C9CB',
                            borderBottomWidth: 1
                        }}
                    />
                    {
                        showNewBox ?
                            <CheckBox
                                activeOpacity={0.6}
                                allowFontScaling={false}
                                containerStyle={{ backgroundColor: '#FFF', borderWidth: 0, marginBottom: 20 }}
                                fontFamily="SFUIText-Regular"
                                checkedColor='#F52D56'
                                textStyle={{ fontSize: 16, color: '#999999', fontWeight: 'normal' }}
                                title='Save this address for future purchases'
                                onPress={() => setSaveNew(!saveNew)}
                                checked={saveNew}
                            /> : <View style={{ height: 20 }} />
                    }
                </Card>
                <Text
                    allowFontScaling={false}
                    style={styles.title}>
                    Your Order
                </Text>
                <Card containerStyle={{ borderRadius: 10, borderColor: '#FFF', padding: 0 }}>
                    <View style={{ paddingHorizontal: 20, paddingTop: 30, flexDirection: 'row' }} >
                        <View style={{ flex: 4 }}>
                            <Text
                                allowFontScaling={false}
                                style={styles.name}>
                                Print {imagesCount} photos
                            </Text>
                            <Text
                                allowFontScaling={false}
                                style={styles.name}>
                                Photo album
                            </Text>
                            <Text
                                allowFontScaling={false}
                                style={styles.name}>
                                Shipping
                            </Text>
                            {
                                discount > 0 ?
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.namePromo}>
                                        Discount
                                    </Text> : null
                            }
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text
                                allowFontScaling={false}
                                style={styles.price}>
                                ${subTotal}
                            </Text>
                            <Text
                                allowFontScaling={false}
                                style={styles.price}>
                                $0
                            </Text>
                            <Text
                                allowFontScaling={false}
                                style={styles.price}>
                                $0
                            </Text>
                            {
                                discount > 0 ?
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.price}>
                                        -${discount}
                                    </Text> : null
                            }
                        </View>
                    </View>
                    <View
                        style={{
                            marginTop: 0,
                            marginBottom: 20,
                            marginHorizontal: 20,
                            borderBottomColor: '#E3E3E3',
                            borderBottomWidth: 1
                        }}
                    />
                    <View style={{ paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row' }}>
                        <View style={{ flex: 4 }}>
                            <Text
                                allowFontScaling={false}
                                style={styles.total}>
                                TOTAL
                            </Text>
                        </View>
                        <View style={{ flex: 2 }}>
                            <Text
                                allowFontScaling={false}
                                style={styles.price}>
                                ${total}
                            </Text>
                        </View>
                    </View>
                </Card>
                <View style={{ paddingHorizontal: 20 }}>
                    <TouchableOpacity
                        activeOpacity={0.6}
                        onPress={() => setDialogVisible(true)}>
                        <Text
                            allowFontScaling={false}
                            style={styles.promo}>
                            Add promocode
                        </Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
            <View>
                <TouchableOpacity
                    style={styles.payButton}
                    onPress={pay}>
                    {
                        load ?
                            <ActivityIndicator size="small" color="#FFF" /> :
                            <Text style={styles.payText}>{totalDescription}</Text>
                    }
                </TouchableOpacity>
            </View>
            {/* <Button
                activeOpacity={0.6}
                onPress={pay}
                buttonStyle={styles.payButton}
                titleStyle={styles.payText}
                title={totalDescription}
                loading={load}
            /> */}
            <ConfirmDialog
                title="Promotional Code"
                visible={dialogVisible}
                onTouchOutside={() => setDialogVisible(false)}
                positiveButton={{
                    title: "Redeem",
                    titleStyle: { color: '#000' },
                    onPress: () => getPromoDiscount(promoCode)
                }}
                negativeButton={{
                    title: "Cancel",
                    titleStyle: { color: '#787879' },
                    onPress: () => setDialogVisible(false)
                }} >
                <View>
                    <Input
                        allowFontScaling={false}
                        inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 10 }}
                        inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 0, fontSize: 16 }}
                        placeholderTextColor='#C8C9CB'
                        placeholder='Code'
                        autoCapitalize='characters'
                        onChangeText={(value) => setPromoCode(value)}
                        value={promoCode}
                    />
                </View>
            </ConfirmDialog>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F7F7F7'
    },
    payButton: {
        position: 'absolute',
        bottom: 30,
        left: SCREEN_WIDTH * .1,
        width: SCREEN_WIDTH * .8,
        borderRadius: 10,
        backgroundColor: '#F52D56',
        height: 52,
        fontSize: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    payText: {
        fontSize: 18,
        fontFamily: 'SFUIText-Semibold',
        color: 'white'
    },
    title: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 24,
        paddingHorizontal: 24,
        marginTop: 24,
        textAlign: 'left',
        color: '#929292'
    },
    name: {
        fontFamily: 'SFUIText-Regular',
        fontSize: 14,
        textAlign: 'left',
        color: '#999999',
        marginBottom: 16
    },
    namePromo: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 15,
        textAlign: 'left',
        color: '#F52D56',
        marginBottom: 10
    },
    total: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 14,
        textAlign: 'left',
        color: '#999999',
        marginBottom: 10
    },
    price: {
        fontFamily: 'SFUIText-Semibold',
        fontSize: 15,
        textAlign: 'right',
        color: '#000',
        marginBottom: 15
    },
    promo: {
        fontFamily: 'SFUIText-Regular',
        fontSize: 14,
        textAlign: 'right',
        color: '#9B9B9B',
        marginTop: 10,
        marginBottom: 0,
        textDecorationLine: 'underline'
    },
});

export default Address;