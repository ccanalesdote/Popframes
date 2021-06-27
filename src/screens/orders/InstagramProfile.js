import React, { useRef, useState, useEffect, Fragment } from 'react';
import { Alert, Dimensions, Image, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { API } from '../../services/Axios';
import AsyncStorage from '@react-native-community/async-storage';
import InstagramLogin from 'react-native-instagram-login';
import CameraRollSelector from "react-native-camera-roll-selector";
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'rn-fetch-blob';
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import { calculateDescriptionTotal } from "../../utils/Helpers";
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { images } from '../../store';
import _ from 'lodash';

const SCREEN_WIDTH = Dimensions.get('window').width;

const InstagramProfile = ({ ...props }) => {

    const [photos, setPhotos] = useState([]);
    const [error, setError] = useState('');
    const [load, setLoad] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [totalDescription, setTotalDescription] = useState('Imprimir $0');
    const [countImages, setCountImages] = useState(0);
    const [showPromo, setShowPromo] = useState(false);
    const [percent, setPercent] = useState(0);
    const [addCountPromo, setAddCountPromo] = useState(0);
    const [nextPage, setNextPage] = useState('');
    // gestión de estado
    const setImages = useSetRecoilState(images);
    const imagesSelected = useRecoilValue(images);

    const _instagramLoginRef = useRef(null);

    useEffect(() => {
        console.log(photos);
    }, [photos]);

    useEffect(() => {
        console.log(_instagramLoginRef);
    }, [_instagramLoginRef]);

    useEffect(() => {
        calculateMsg();
    }, [countImages]);

    useEffect(() => {
        getUser();
    }, []);

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

    const getUser = async () => {
        let accessToken = await AsyncStorage.getItem('access_token');
        getMultimedia(accessToken);
    }

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

    const getMultimedia = async (accessToken) => {
        if (accessToken) {
            console.log(accessToken);
            try {
                let response = await API.get('https://graph.instagram.com/me/media', {
                    params: {
                        fields: 'id,media_type,media_url',
                        access_token: accessToken
                    }
                });
                if (response.data.error) {
                    setError(response.data.error);
                    setLoad(true);
                } else {
                    let instagram_images_local = [];
                    let instagram_images = response.data.data;
                    let size = instagram_images.length;
                    let next = response.data.paging.next;
                    setNextPage(next);
                    for (const item of instagram_images) {
                        if (item.media_type === 'IMAGE') {
                            let result = await RNFetchBlob.config({ fileCache: true }).fetch('GET', item.media_url);
                            let path = result.path();
                            let image = { uri: `file://${path}`, id: item.id };
                            if (!instagram_images_local.includes(image)) {
                                instagram_images_local.push(image);
                            }                            
                        }
                    }
                    setPhotos(instagram_images_local);
                    setError(false);
                    setLoad(true);
                }
            } catch (e) {
                console.log(e);
                Alert.alert(e.message);
            }
        }
    }

    const getMoreMultimedia = async () => {
        console.log('more multimedia');
        try {
            let response = await fetch(nextPage, {
                method: 'GET'
            });
            let result = await response.json();
            if (result.error) {
                setError(result.error);
                setLoad(true);
            } else {
                let images = result.data;
                let size = images.length;
                let next = result.paging.next;
                setNextPage(next);
                console.log(next);
                images.forEach(async (item, index) => {
                    if (item.media_type === 'IMAGE') {
                        console.log(item.media_url);
                        let result = await RNFetchBlob.config({ fileCache: true }).fetch('GET', item.media_url);
                        let path = result.path();
                        let image = { uri: `file://${path}`, id: item.id };
                        setPhotos(oldArray => [...oldArray, image]);
                    }
                    if (index == size - 1) {
                        setError(false);
                        setLoad(true);
                        //setRefresh(false);
                    }
                });
            }
        } catch (error) {
            Alert.alert(error.message);
        }
    }

    const loginInstagram = async (data) => {
        await AsyncStorage.setItem('access_token', data.access_token);
        await AsyncStorage.setItem('user_instagram_id', (data.user_id).toString());
        getUser();
    }

    const goToCustomization = () => {
        props.navigation.navigate('Customize');
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
        <View style={styles.root}>
            {
                error || !load ?
                    <View style={styles.body}>
                        <View style={styles.texts}>
                            <Text
                                style={styles.title}>
                                You don't have your instagram associated yet
                            </Text>
                            <Text style={styles.titleBold}>
                                Connect it here
                            </Text>
                        </View>
                        <Image
                            source={require('../../assets/images/arrow.png')}
                            style={styles.arrow} />
                        <Button
                            icon={
                                <Icon
                                    name="logo-instagram"
                                    size={32}
                                    color="white"
                                />
                            }
                            onPress={() => _instagramLoginRef.current.show()}
                            allowFontScaling={false}
                            buttonStyle={styles.instagramButton}
                            titleStyle={styles.instagramText}
                            title="Log in with Instagram"
                        />
                    </View>
                    :
                    <Fragment>
                        {
                            showPromo ?
                                <View style={{ alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, width: SCREEN_WIDTH, height: 50, backgroundColor: '#F5F5F5', zIndex: 1, borderBottomStartRadius: 10, borderBottomEndRadius: 10 }}>
                                    <Text style={styles.promoText}>Agrega {addCountPromo} foto más y obten un {percent}% de descuento en tu pedido</Text>
                                    <Icon onPress={() => setShowPromo(false)} style={{ position: 'absolute', right: 8 }} name="ios-close-outline" size={24} color="#616161" />
                                </View> : null
                        }
                        <CameraRollSelector
                            refreshing={refresh}
                            enableCameraRoll={false}
                            maximum={100}
                            imagesPerRow={3}
                            spacing={2}
                            customMarker={<CustomMarker />}
                            imageContainerStyle={{ borderRadius: 10, width: SCREEN_WIDTH * .31, height: SCREEN_WIDTH * .31 }}
                            //onEndReached={getMoreMultimedia}
                            onGetData={(fetchParams, resolve) => {
                                resolve({
                                    assets: photos,
                                    pageInfo: {
                                        hasNextPage: false
                                    }
                                });
                            }}
                            callback={(selectedImages, currentSelectedImage) => {
                                setCountImages(selectedImages.length);
                                let total = calculateDescriptionTotal(selectedImages.length, 'Imprimir');
                                setTotalDescription(total);
                                let index = _.findIndex(imagesSelected, { 'id': currentSelectedImage.id });
                                if (index != -1) {
                                    removeImage(index);
                                } else {
                                    addImage(currentSelectedImage);
                                }
                            }}
                        />
                    </Fragment>
            }
            {
                !error && load ?
                    <Button
                        activeOpacity={0.8}
                        //onPress={goToCustomization}
                        onPress={() => console.log(photos)}
                        buttonStyle={styles.payButton}
                        titleStyle={styles.payText}
                        title="Imprimir $6000" />
                    : null
            }
            <InstagramLogin
                activeOpacity={0.8}
                ref={_instagramLoginRef}
                appId='211059646802354'
                appSecret='3a76f6b919fa1100569d19c2c77b5896'
                redirectUrl="https://www.google.com/"
                scopes={['user_profile', 'user_media']}
                onLoginSuccess={loginInstagram}
                onLoginFailure={(data) => console.log(data)}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F7F7F7'
    },
    body: {
        flex: 1,
        padding: 24,
        justifyContent: 'center'
    },
    payButton: {
        position: 'absolute',
        bottom: 30,
        left: SCREEN_WIDTH * .1,
        width: SCREEN_WIDTH * .8,
        borderRadius: 10,
        backgroundColor: '#F52D56',
        height: 52
    },
    payText: {
        fontSize: 16,
        fontFamily: 'SFUIText-Semibold'
    },
    instagramButton: {
        paddingVertical: 8,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#F52D56',
        justifyContent: 'flex-start'
    },
    instagramText: {
        marginLeft: 38,
        fontSize: 16,
        fontFamily: 'SFUIText-SemiBold'
    },
    texts: {
        paddingHorizontal: 40,
        paddingBottom: 0
    },
    title: {
        fontFamily: 'SFUIText-Regular',
        fontSize: 20,
        textAlign: 'center',
        color: '#929292'
    },
    titleBold: {
        fontFamily: 'SFUIText-Bold',
        fontSize: 20,
        textAlign: 'center',
        color: '#929292'
    },
    marker: {
        position: "absolute",
        top: 5,
        right: 5,
        backgroundColor: "transparent",
        zIndex: 1000
    },
    arrow: {
        width: 60,
        height: 60,
        alignSelf: 'flex-end',
        marginBottom: 20,
        marginRight: 20,
        transform: [{ rotate: '320deg' }]
    },
    promoText: {
        textAlign: 'center',
        marginHorizontal: 40,
        fontSize: 14,
        fontFamily: 'SFUIText-Regular',
        color: '#000'
    }
});

export default InstagramProfile;