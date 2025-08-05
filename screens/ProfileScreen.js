import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Button, StyleSheet, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen() {
    const [imageUri, setImageUri] = useState(null);
    
    useEffect(() => {
        const loadImage = async () => {
            const storedUri = await AsyncStorage.getItem('profileImageUri');
            if (storedUri) {
                setImageUri(storedUri);
            }
        };
        loadImage();
    }, []);

    const handleChangePicture = async () => {
        const options = [
            { text: 'Take Photo', onPress: handleTakePhoto },
            { text: 'Choose from Library', onPress: handlePickImage },
            { text: 'Cancel', style: 'cancel' },
        ];
        Alert.alert('Change Profile Picture', 'Choose an option:', options);
    };

    const requestPermissions = async () => {
        const cameraStatus = await ImagePicker.requestCameraPermissionsAsync();
        const mediaLibraryStatus = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if(!cameraStatus.granted || !mediaLibraryStatus.granted) {
            Alert.alert('Permissions Denied', 'Please grant camera and library access.');
            return false;
        }
        return true;
    };

    const handleTakePhoto = async () => {
        const granted = await requestPermissions();
        if (!granted) return;

        const result = await ImagePicker.launchCameraAsync({ allowsEditing: true });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            await AsyncStorage.setItem('profileImageUri', result.assets[0].uri);
        }
    };

    const handlePickImage = async () => {
        const granted = await requestPermissions();
        if (!granted) return;

        const result = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });
        if (!result.canceled) {
            setImageUri(result.assets[0].uri);
            await AsyncStorage.setItem('profileImageUri', result.assets[0].uri);
        }
    }

    return (
        <View style={styles.container}>
            <Image source={imageUri ? { uri: imageUri } : require('../assets/placeholder.png')}
                style={styles.profileImage}
                testID='profile-image'
            />
            <Button title="Change Profile Picture" onPress={handleChangePicture} testID='change-profile-picture-button' />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        marginBottom: 20,
    },
});