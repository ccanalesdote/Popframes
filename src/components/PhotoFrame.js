import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from 'react-native-elements';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ConfirmDialog } from 'react-native-simple-dialogs';
import ImageEdit from './ImageEdit';

const Customize = ({ image, addCountImage, minusCountImage, cropImages }) => {

    const [dialogVisible, setDialogVisible] = useState(false);

    let photo = {
        id: image.id,
        key: `${image.id}_${Date.now()}`,
        type: image.type,
        uri: image.uri
    }

    // se crear el elemento imagen para mandarlo al arreglo de imagenes a subir
    /* let itemImage = {
        id: image.id,
        filename: image.filename,
        height: image.height,
        width: image.width,
        uri: image.uri,
        type: image.type
    }; */

    const [images, setImages] = useState([photo]);
    const [amount, setAmount] = useState(1);

    const changeImages = (type) => {
        // se evalua si de añadirá o quitará una copia
        if (type === 'add') {
            let key = `${image.id}_${Date.now()}`;
            photo.key = key;
            setImages(images => [...images, photo]);
            setAmount(amount + 1);
            addCountImage(1);
        } else {
            if (amount > 1) {
                let temp = images;
                temp.pop();
                setImages(temp);
                setAmount(amount - 1);
                minusCountImage(1);
            }
        }
    }

    const confirmDelete = () => {
        setDialogVisible(true);
    }

    const deleteImage = () => {
        let size = images.length;
        minusCountImage(size);
        setImages([]);
        setDialogVisible(false);
    }

    return (
        <View style={styles.root}>
            {
                images.length > 0 ?
                    <View>
                        <Card containerStyle={styles.cardPhoto}>
                            {
                                images.map((item, i) => (
                                    <View key={i}>
                                        {/* <View
                                            style={{
                                                marginTop: 20,
                                                borderBottomColor: '#E3E3E3',
                                                borderBottomWidth: 1
                                            }}
                                        /> */}
                                        <ImageEdit image={item} cropImages={cropImages} />
                                        <View
                                            style={{
                                                marginTop: 0,
                                                borderBottomColor: '#E3E3E3',
                                                borderBottomWidth: 1
                                            }}
                                        />
                                    </View>
                                ))
                            }
                            <View style={{ marginTop: 10, marginBottom: 10, marginLeft: 10, flexDirection: 'row' }} >
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => changeImages('remove')}>
                                    <View style={styles.buttonCircle}>
                                        <Icon
                                            name="minus"
                                            size={26}
                                            color="#FFF"
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.number}>
                                    <Text style={{ fontSize: 20, color: '#000' }} >{amount}</Text>
                                </View>
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    onPress={() => changeImages('add')}>
                                    <View style={styles.buttonCircle}>
                                        <Icon
                                            name="plus"
                                            size={26}
                                            color="#FFF"
                                        />
                                    </View>
                                </TouchableOpacity>
                                <View style={{ position: 'absolute', right: 10 }}>
                                    <TouchableOpacity
                                        activeOpacity={0.6}
                                        onPress={() => confirmDelete()}>
                                        <View style={styles.buttonCircleTrash}>
                                            <Icon
                                                name="trash-can-outline"
                                                size={26}
                                                color="#FFF"
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Card>
                        {/* {croppedImage ? <Image style={{ height: 200, width: 200 }} source={{ uri: croppedImage }} /> : null} */}
                    </View> : null
            }
            <ConfirmDialog
                title="Delete Image"
                message="Are you sure you want to delete the image?"
                visible={dialogVisible}
                onTouchOutside={() => setDialogVisible(false)}
                positiveButton={{
                    title: "Delete",
                    titleStyle: { color: '#F52D56' },
                    onPress: () => deleteImage()
                }}
                negativeButton={{
                    title: "Cancel",
                    titleStyle: { color: '#787879' },
                    onPress: () => setDialogVisible(false)
                }} >
            </ConfirmDialog>
        </View>
    )
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#F7F7F7'
    },
    number: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonCircle: {
        borderRadius: 50,
        width: 40,
        height: 40,
        backgroundColor: '#F52D56',
        alignItems: 'center',
        justifyContent: 'center'
    },
    buttonCircleTrash: {
        borderRadius: 50,
        width: 40,
        height: 40,
        backgroundColor: '#F52D56',
        alignItems: 'center',
        justifyContent: 'center'
    },
    cardPhoto: {
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        borderColor: '#e3e3e3',
        padding: 0,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 7 },
        shadowOpacity: 0.18,
        shadowRadius: 9.51,
        elevation: 15
    }
});

export default Customize;