import React, { useState, useEffect, Fragment } from 'react';
import { Alert, Button, Dimensions, Image, PermissionsAndroid, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
//import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import CameraRollSelector from "react-native-camera-roll-selector";
import { calculateDescriptionTotal } from "../../utils/Helpers";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { images } from '../../store/atoms';
import _ from 'lodash';
import { abs } from 'react-native-reanimated';

const SCREEN_WIDTH = Dimensions.get('window').width;

const Home = ({ ...props }) => {

    const [totalDescription, setTotalDescription] = useState('Print $0');
    const [countImages, setCountImages] = useState(0);
    const [showPromo, setShowPromo] = useState(false);
    const [percent, setPercent] = useState(0);
    const [addCountPromo, setAddCountPromo] = useState(0);
    // gestión de estado
    const setImages = useSetRecoilState(images);
    const imagesSelected = useRecoilValue(images);
    //const setCountImages = useSetRecoilState(countImages);
    //const countImagesState = useRecoilValue(countImages);

    useEffect(() => {
        calculateMsg();
    }, [countImages]);

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

    const calculateMsg = () => {
        console.log(countImages);
        if (countImages == 2) {
            setPercent(12);
            setAddCountPromo(1);
            setShowPromo(true);
        } else {
            setShowPromo(false);
            setPercent(0);
            setAddCountPromo(0);
        }
    };

    const goToCustomization = () => {
        if (imagesSelected.length > 0) {
            props.navigation.navigate('Customize');
        } else {
            Alert.alert('Error', 'You must select at least one image');
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
                        <Text style={styles.promoText}>Add {addCountPromo} photo more and get an {percent}% of discount in your order</Text>
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
                        setCountImages(selectedImages.length);
                        let total = calculateDescriptionTotal(selectedImages.length, 'Print');
                        setTotalDescription(total);
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
                        style={styles.payButton}
                        onPress={goToCustomization}>
                        <Text style={styles.payText}>{totalDescription}</Text>
                    </TouchableOpacity>
                </View>
            </View>
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
        backgroundColor: '#F52D56DC',
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