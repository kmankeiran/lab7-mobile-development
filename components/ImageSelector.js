import React, { useState } from 'react';
import { View, Button, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const ImageSelector = props => {

    const verifyPermissions = async () => {
        const cameraResult = await ImagePicker.requestCameraPermissionsAsync();
        const libraryResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(cameraResult.status !== 'granted' && libraryResult.status !== 'granted') {
            Alert.alert('Insufficient Permissions!', 'You need to grant camera permissions to use this app.', [{ text: 'Okay'}]);
            return false;
        }
        return true;
    }

    const retrieveImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if(!hasPermission) {
            return false;
        }

        const image = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [6, 5],
            quality: 0.5
        });

        if(!image.cancelled) { //If the image is selected 
            props.onImageSelected(image.uri);
        }
    }

    const takeImageHandler = async () => {
        const hasPermission = await verifyPermissions();
        if(!hasPermission) {
            return false;
        }

        const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [6, 5],
            quality: 0.5
        });

        if(!image.cancelled) { //If the image is selected 
            props.onImageSelected(image.uri);
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.buttonContainer}>
                <Button style={styles.button} title="Retrieve from Gallery" onPress={retrieveImageHandler} />
                <Button style={styles.button} title="Take image" onPress={takeImageHandler} />
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 5,
        height: 250
    },
    buttonContainer: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        width: '100%',
        minHeight: 100
    },
    button: {
        paddingVertical: 25,
        width: '100%',
    }
})

export default ImageSelector;