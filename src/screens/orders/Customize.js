import React, { useState, useEffect } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { Button } from 'react-native-elements';
import PhotoFrame from '../../components/PhotoFrame';
import { ScrollView } from 'react-native-gesture-handler';
import { calculateDescriptionTotal } from "../../utils/Helpers";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import _ from 'lodash';
import { images, croppedImages, doCropImages } from '../../store/atoms';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const Customize = ({ ...props }) => {

    // gestión de estado
    const imagesSelected = useRecoilValue(images);
    const setDoCropImages = useSetRecoilState(doCropImages);
    const setCroppedImages = useSetRecoilState(croppedImages);
    let count = imagesSelected.length;

    // hooks
    const [imagesUpload, setImagesUpload] = useState([]);
    const [imagesCount, setImagesCount] = useState(count);
    const [totalDescription, setTotalDescription] = useState('Print $0');
    const [loading, setLoading] = useState(false);
    const [cropImages, setCropImages] = useState(false);

    useEffect(() => {
        setCroppedImages([]);
    }, []);

    useEffect(() => {
        console.log(imagesCount);
        let total = calculateDescriptionTotal(imagesCount, 'Next');
        setTotalDescription(total);
        AsyncStorage.setItem('images_count', imagesCount.toString());
        if (imagesCount < 1) {
            props.navigation.navigate('Home');
        }
    }, [imagesCount]);

    const addCountImage = (count) => {
        setImagesCount(imagesCount + count);
    }

    const minusCountImage = (count) => {
        setImagesCount(imagesCount - count);
    }

    const createOrder = async () => {
        setLoading(true);
        let token = await AsyncStorage.getItem('token');
        let UID = await AsyncStorage.getItem('user_id');
        let response = await fetch('http://api.impri.cl/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
            body: JSON.stringify({
                user_id: UID,
                quantity: imagesCount
            }),
        });
        let result = await response.json();
        if (result.state) {
            let order = result.order_id;
            return order;
        } else {
            Alert.alert('Error', result.msg);
            return 0;
        }
    }

    const goToAddress = async () => {
        setCropImages(!cropImages);
        setDoCropImages(true);
        let order_id = await createOrder();
        if (order_id != 0) {
            AsyncStorage.setItem('order_id', order_id.toString());
            setLoading(false);
            props.navigation.navigate('Address');
        }
    }

    return (
        <View style={styles.root}>
            <ScrollView
                //scrollEnabled={false}
                showsVerticalScrollIndicator={false} >
                {
                    imagesSelected.map((item, i) => (
                        <PhotoFrame key={i} image={item} addCountImage={addCountImage} minusCountImage={minusCountImage} cropImages={cropImages} />
                    ))
                }
                <View style={{ height: 100 }} />
            </ScrollView >
            <View>
                <TouchableOpacity
                    style={styles.payButton}
                    onPress={goToAddress}>
                    {
                        loading ?
                            <ActivityIndicator size="small" color="#FFF" /> :
                            <Text style={styles.payText}>{totalDescription}</Text>
                    }
                </TouchableOpacity>
            </View>
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
        //backgroundColor: '#F52D56DC',
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
        fontFamily: 'SFUIText-Semibold',
        fontSize: 14,
        textAlign: 'left',
        color: '#000'
    }
});

export default Customize;