import React, { useState, useEffect } from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { Image } from 'react-native-elements';
import Refresh from '../assets/icons/refresh.png';
import ImageCropper from 'react-native-simple-image-cropper';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { croppedImages, doCropImages } from '../store/atoms';

const SCREEN_WIDTH = Dimensions.get('window').width;

const window = Dimensions.get('window');
const w = window.width;

const ImageEdit = ({ image, cropImages }) => {

    const [imageHeight, setImageHeight] = useState(w - 120);
    const [cropperParams, setCropperParams] = useState({});
    const [vertical, setVertical] = useState(true);
    // gestión de estado para las imágenes recortadas
    const setCroppedImages = useSetRecoilState(croppedImages);
    const setDoCropImages = useSetRecoilState(doCropImages);
    const doCropImagesState = useRecoilValue(doCropImages);

    useEffect(() => {
        if (vertical) {
            setImageHeight(w + 90);
        } else {
            setImageHeight(w - 120);
        }
    }, [vertical]);

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
            <View style={{ height: imageHeight, justifyContent: 'center' }} >
                <ImageCropper
                    imageUri={image.uri}
                    cropAreaWidth={w - 30}
                    cropAreaHeight={imageHeight}
                    containerColor="black"
                    areaColor="black"
                    setCropperParams={changeCropperParams}
                />
            </View>
            <View style={{ marginLeft: 10, flexDirection: 'row', alignSelf: 'flex-end' }} >               
                <TouchableOpacity
                    activeOpacity={0.6}
                    onPress={() => setVertical(!vertical)}>
                    <View style={styles.icon} >
                        <Image
                            source={Refresh}
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
        width: 35,
        height: 35,
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