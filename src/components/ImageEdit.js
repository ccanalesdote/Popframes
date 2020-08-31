import React, { useState, useEffect } from 'react';
import { Animated, Dimensions, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Image } from 'react-native-elements';
import Horizontal from '../assets/icons/horizontal.png';
import Vertical from '../assets/icons/vertical.png';
import FullHorizontal from '../assets/icons/full-horizontal.png';
import FullVertical from '../assets/icons/full-vertical.png';
import HorizontalHover from '../assets/icons/horizontal-hover.png';
import VerticalHover from '../assets/icons/vertical-hover.png';
import FullHorizontalHover from '../assets/icons/full-horizontal-hover.png';
import FullVerticalHover from '../assets/icons/full-vertical-hover.png';
import ImageCropper from 'react-native-simple-image-cropper';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { croppedImages, doCropImages } from '../store/atoms';

const SCREEN_WIDTH = Dimensions.get('window').width;
const SCREEN_HEIGHT = Dimensions.get('window').height;

const window = Dimensions.get('window');
const w = window.width;
const h = window.height;

const CROP_AREA_WIDTH = w;
const CROP_AREA_HEIGHT = w;

const ImageEdit = ({ image, cropImages }) => {

    const [imageHeight, setImageHeight] = useState(w - 120);
    const [cropperParams, setCropperParams] = useState({});
    const [type, setType] = useState(1);
    // gestión de estado para las imágenes recortadas
    const setCroppedImages = useSetRecoilState(croppedImages);
    //const croppedImagesSelected = useRecoilValue(croppedImages);
    const setDoCropImages = useSetRecoilState(doCropImages);
    const doCropImagesState = useRecoilValue(doCropImages);

    useEffect(() => {
        if (type == 1 || type == 3) {
            setImageHeight(w - 120);
        }
        if (type == 2 || type == 4) {
            setImageHeight(w - 30);
        }
    }, [type]);

    // se observa evento que dispara el recorte de imágenes
    useEffect(() => {
        if (doCropImagesState) {
            setDoCropImages(false);
            handleCropImage();
        }
    }, [cropImages]);

    const changeCropperParams = value => {
        setCropperParams(value);
    };

    const handleCropImage = async () => {
        // se establecen dimensiones por defecto
        const cropSize = {
            width: 1200,
            height: 1200,
        };
        // se define el formato
        const cropAreaSize = {
            width: w - 30,
            height: imageHeight,
        };
        // se recorta la imagen
        try {
            const result = await ImageCropper.crop({
                ...cropperParams,
                imageUri: image.uri,
                cropSize,
                cropAreaSize,
            });
            // se crea el objeto a subir
            let croppedNewImage = {
                id: image.id,
                key: image.key,
                type: image.type ? image.type : 'image',
                original_uri: image.uri,
                cropped_uri: result
            }
            console.log(croppedNewImage);
            // se añade a la gestión de estado
            setCroppedImages((oldTodoList) => [
                ...oldTodoList,
                croppedNewImage,
            ]);
        } catch (error) {
            console.log(error);
        }
    };

    return (

        <View>
            <View style={{ /* borderColor: '#e3e3e3', borderWidth: 1, */ height: imageHeight }} >
                <ImageCropper
                    imageUri={image.uri}
                    cropAreaWidth={w - 30}
                    cropAreaHeight={imageHeight}
                    containerColor="black"
                    areaColor="black"
                    setCropperParams={changeCropperParams}
                />
                {/* <View style={{ backgroundColor: '#FFF', width: 180 }}>
                    <Text>{image.key}</Text>
                </View> */}
            </View>
            <View style={{ marginLeft: 10, flexDirection: 'row' }} >
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setType(1)}>
                    <View style={styles.icon} >
                        <Image
                            source={type == 1 ? HorizontalHover : Horizontal}
                            style={styles.stretch}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setType(2)}>
                    <View style={styles.icon} >
                        <Image
                            source={type == 2 ? VerticalHover : Vertical}
                            style={styles.stretch}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setType(3)}>
                    <View style={styles.icon} >
                        <Image
                            source={type == 3 ? FullHorizontalHover : FullHorizontal}
                            style={styles.stretch}
                        />
                    </View>
                </TouchableOpacity>
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setType(4)}>
                    <View style={styles.icon} >
                        <Image
                            source={type == 4 ? FullVerticalHover : FullVertical}
                            style={styles.stretch}
                        />
                    </View>
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
    stretch: {
        width: 50,
        height: 50,
        resizeMode: 'contain',
    },
    icon: {
        flex: 1,
        padding: 14
    },
    heightHorizontal: {
        height: SCREEN_WIDTH - 120
    },
    heightVertical: {
        height: SCREEN_WIDTH - 30
    }
});

export default ImageEdit;