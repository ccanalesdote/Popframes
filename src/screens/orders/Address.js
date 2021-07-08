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
    const [addressLine1, setAddressLine1] = useState('');
    const [addressLine2, setAddressLine2] = useState('');
    const [city, setCity] = useState('');
    const [countryName, setCountryName] = useState('');
    const [postCode, setPostCode] = useState('');
    const [saveNew, setSaveNew] = useState(false);
    const [showNewBox, setShowNewBox] = useState(true);
    const [blockAddress, setBlockAddress] = useState(false);
    const [selectAddress, setSelectAddress] = useState([]);
    const [imagesCount, setImagesCount] = useState(0);
    const [totalDescription, setTotalDescription] = useState('Pay £0');
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
        getUserAddress();
        getAmount();
    }, []);

    useEffect(() => {
        if (croppedImagesSelected.length < 1) {
            console.log(croppedImagesSelected.length);
            props.navigation.navigate('Customize');
        }
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
        if (!addressLine1) {
            Alert.alert('Error', 'Please complete the address information.');
            return false;
        }
        if (loadingPhotos) {
            Alert.alert('Loading...', 'Wait a few seconds, not all your photos have been uploaded yet.');
            return false;
        }
        /* const requestData = {
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
                            .then(async () => {
                                console.log('completed');                                    
                                if (addressId == 0) {
                                    let address_id = await saveAddress();
                                    await updateOrder(address_id);
                                } else {
                                    await updateOrder(addressId);
                                }
                                createZipFile();
                                setAddressId(0);
                                cleanAddress();
                                Alert.alert('Successful Payment', 'The order has been received.');
                                // props.navigation.navigate('Invoice');                                    
                            });
                    }, 1000);
                });
        }; */
        if (addressId == 0) {
            let address_id = await saveAddress();
            await updateOrder(address_id);
        } else {
            await updateOrder(addressId);
        }
        createZipFile();
        setAddressId(0);
        cleanAddress();
        Alert.alert('Successful Payment', 'The order has been received.');
        // props.navigation.navigate('Invoice');
    }

    const uploadPhotos = async () => {
        try {
            setLoadingPhotos(true);
            let orderID = await AsyncStorage.getItem('order_id');
            console.log('orderID', orderID);
            let formData = new FormData();
            formData.append("order_id", orderID);
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
            let response = await FormAPI.post('/file', formData);
            console.log(response.data);
            setLoadingPhotos(false);
        } catch (error) {
            console.log('There has been a problem with your fetch operation <upload photos>: ' + error.message);
            throw error;
        }
    }

    const updateOrder = async (address_id) => {
        let order_id = await AsyncStorage.getItem('order_id');
        let response = await API.put('/order', {
            order_id,
            address_id,
            promocode_id: promoCodeID,
            discount,
            sub_total: subTotal,
            total
        });
        console.log(response.data);
        if (!response.data.state) {
            Alert.alert('Error', response.data.msg);
        }
    }

    const createZipFile = async () => {
        let order_id = await AsyncStorage.getItem('order_id');
        let response = await API.get('/files', {
            params: {
                order_id
            }
        });
        console.log(response.data);
    }

    const saveAddress = async () => {
        if (nameAddress != '' && addressLine1 != '' && city != '' && countryName != '' && postCode != '') {
            setLoad(true);
            let UID = await AsyncStorage.getItem('user_id');
            let response = await API.post('/user_address', {
                user_id: UID,
                name: nameAddress,
                address_line_1: addressLine1,
                address_line_2: addressLine2,                
                city,
                country_name: countryName,
                post_code: postCode                
            });
            setLoad(false);
            if (response.data.state) {
                let address_id = response.data.address_id;
                setAddressId(address_id);
                return address_id;
            } else {
                Alert.alert('Error', response.data.msg);
            }
        } else {
            Alert.alert('Error', 'All address fields must be completed');
        }
    }

    const getUserAddress = async () => {
        let UID = await AsyncStorage.getItem('user_id');
        let response = await API.get('/user_address', {
            params: {
                user_id: UID
            }
        });
        if (response.data.state) {
            let array = [];
            for (const item of response.data.address) {
                array.push({ label: item.name, value: item.id });
            }
            setSelectAddress(array);
        } else {
            Alert.alert('Aviso', response.data.msg);
        }
    }

    const getAddress = async (address_id) => {
        let response = await API.get('/address', {
            params: {
                address_id
            }
        });
        console.log(response.data);
        if (response.data.state) {
            let { name, address_line_1, address_line_2, city, country_name, post_code } = response.data.address;
            setNameAddress(name);
            setAddressLine1(address_line_1);
            setAddressLine2(address_line_2);            
            setCity(city);
            setCountryName(country_name);
            setPostCode(post_code);
            setBlockAddress(true);
        } else {
            Alert.alert('Error', response.data.msg);
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
        setAddressLine1('');
        setAddressLine2('');
        setCity('');
        setCountryName('');
        setPostCode('');
    }

    const getPromoDiscount = async (promo_code) => {
        if (!promoCode) {
            Alert.alert('Error', 'You must enter the promocode');
            return false;
        }
        let response = await API.get('/promo', {
            params: {
                promo_code
            }
        });
        if (response.data.state) {
            let { id, discount } = response.data.code;
            let discount_format = discount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            let subtotal = calculateTotal(imagesCount);
            let total = subtotal - discount;
            let price = total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
            setTotalDescription(`Pay ${price}`);
            setDiscount(discount_format);
            setTotal(price);
            setPromoCodeID(id);
        } else {
            Alert.alert('Error', response.data.msg);
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
                        placeholder='Friendly&nbsp;name'
                        onChangeText={text => setNameAddress(text)}
                        disabled={blockAddress}
                        value={nameAddress}
                    />
                    <Input
                        allowFontScaling={false}
                        inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                        inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                        placeholderTextColor='#C8C9CB'
                        placeholder='Address Line 1'
                        onChangeText={text => setAddressLine1(text)}
                        disabled={blockAddress}
                        value={addressLine1}
                    />
                    <Input
                        allowFontScaling={false}
                        inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                        inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                        placeholderTextColor='#C8C9CB'
                        placeholder='Address Line 2'
                        onChangeText={text => setAddressLine2(text)}
                        disabled={blockAddress}
                        value={addressLine2}
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
                    <Input
                        allowFontScaling={false}
                        inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                        inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                        placeholderTextColor='#C8C9CB'
                        placeholder='Country'
                        onChangeText={text => setCountryName(text)}
                        disabled={blockAddress}
                        value={countryName}
                    />
                    <Input
                        allowFontScaling={false}
                        inputContainerStyle={{ borderBottomColor: '#C8C9CB', marginTop: 0 }}
                        inputStyle={{ color: '#000', fontFamily: 'SFUIText-Regular', marginLeft: 10, fontSize: 16 }}
                        placeholderTextColor='#C8C9CB'
                        placeholder='Post Code'
                        onChangeText={text => setPostCode(text)}
                        disabled={blockAddress}
                        value={postCode}
                    />
                    <View style={{ height: 0 }} />                    
                    {
                        showNewBox ?
                            <CheckBox
                                activeOpacity={0.6}
                                allowFontScaling={false}
                                containerStyle={{ backgroundColor: '#FFF', borderWidth: 0, marginBottom: 20 }}
                                fontFamily="SFUIText-Regular"
                                checkedColor='#4B187F'
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
                                £{subTotal}
                            </Text>
                            <Text
                                allowFontScaling={false}
                                style={styles.price}>
                                £0
                            </Text>
                            {
                                discount > 0 ?
                                    <Text
                                        allowFontScaling={false}
                                        style={styles.price}>
                                        -£{discount}
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
                                £{total}
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
        backgroundColor: '#4B187F',
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
        color: '#4B187F',
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