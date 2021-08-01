import React, { useState, Fragment } from 'react';
import { Alert, Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { API } from '../../services/Axios';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraRollSelector from "react-native-camera-roll-selector";
import { ConfirmDialog } from 'react-native-simple-dialogs';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { images } from '../../store/atoms';
import _ from 'lodash';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Home = ({ ...props }) => {

    const [totalDescription, setTotalDescription] = useState('Print £0');
    const [countImages, setCountImages] = useState(0);
    const [showPromo, setShowPromo] = useState(false);
    const [nextStepEnable, setNextStepEnable] = useState(true);
    const [promoMsg, setPromoMsg] = useState('');
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [dialogMsg, setDialogMsg] = useState('');
    // gestión de estado
    const setImages = useSetRecoilState(images);
    const imagesSelected = useRecoilValue(images);

    const addImage = newImage => {
        setImages((oldTodoList) => [
            ...oldTodoList,
            newImage,
        ]);
    };

    const removeImage = index => {
        let newState = [...imagesSelected];
        newState.splice(index, 1);
        setImages(newState);
    };

    const calculate = async (quantity) => {
        let response = await API.get('/calculate_price', {
            params: {
                quantity
            }
        });
        if (response.data.state) {
            let text = `Print £${response.data.amount}`;
            setTotalDescription(text);
            setNextStepEnable(false);
            if (response.data.promo) {
                setShowPromo(true);
                setPromoMsg(response.data.promo_msg);
            } else {
                setShowPromo(false);
                setPromoMsg('');
            }
        } else {
            let text = `Print £0`;
            setTotalDescription(text);
            setNextStepEnable(true);
            setShowPromo(false);
            setPromoMsg('');
        }
    }

    const goToCustomization = () => {
        if (imagesSelected.length > 0) {
            props.navigation.navigate('Customize');
        } else {
            setDialogVisible(true);
            setDialogTitle('Error');
            setDialogMsg('You must select at least one image');            
            return false;
        }
    }

    const CustomMarker = () => {
        return (
            <View style={[styles.marker, { borderRadius: 25, overflow: "hidden", margin: 4 }]}>
                <Image
                    style={{ width: 20, height: 20, backgroundColor: '#03DE73' }}
                    source={require("../../assets/icons/checkmark.png")}
                />
            </View>
        )
    }

    return (
        <Fragment>
            {
                showPromo ?
                    <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, width: SCREEN_WIDTH, height: 50, backgroundColor: '#F5F5F5', zIndex: 1, borderBottomStartRadius: 10, borderBottomEndRadius: 10 }}>
                        <Text style={styles.promoText}>{promoMsg}</Text>
                        <Icon onPress={() => setShowPromo(false)} style={{ position: 'absolute', right: 8 }} name="ios-close-outline" size={24} color="#616161" />
                    </View> : null
            }
            <View style={styles.root}>
                <CameraRollSelector
                    maximum={100}
                    imagesPerRow={3}
                    spacing={2}
                    customMarker={<CustomMarker />}
                    imageContainerStyle={{ borderRadius: 10, width: SCREEN_WIDTH * .31, height: SCREEN_WIDTH * .31 }}
                    callback={(selectedImages, currentSelectedImage) => {
                        calculate(selectedImages.length);
                        setCountImages(selectedImages.length);
                        let index = _.findIndex(imagesSelected, { 'id': currentSelectedImage.id });
                        if (index != -1) {
                            removeImage(index);
                        } else {
                            addImage(currentSelectedImage);
                        }
                    }}
                />
                <View>
                    <TouchableOpacity
                        disabled={nextStepEnable}
                        style={countImages > 0 ? styles.payButton : styles.payDisabledButton}
                        onPress={goToCustomization}>
                        <Text style={styles.payText}>{totalDescription}</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        </Fragment>
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
        backgroundColor: '#4B187FDC',
        height: 52,
        fontSize: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    payDisabledButton: {
        position: 'absolute',
        bottom: 30,
        left: SCREEN_WIDTH * .1,
        width: SCREEN_WIDTH * .8,
        borderRadius: 10,
        backgroundColor: '#A366E2DC',
        height: 52,
        fontSize: 24,
        justifyContent: 'center',
        alignItems: 'center'
    },
    promoText: {
        textAlign: 'center',
        marginHorizontal: 40,
        fontSize: 14,
        fontFamily: 'SFUIText-Regular',
        color: '#000'
    },
    payText: {
        fontSize: 18,
        fontFamily: 'SFUIText-Semibold',
        color: 'white'
    },
    marker: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "transparent",
        zIndex: 1000
    }
});

export default Home;