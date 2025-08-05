import { render, waitFor, fireEvent } from "@testing-library/react-native";
import ProfileScreen from "../screens/ProfileScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

jest.useFakeTimers();
jest.spyOn(Alert, 'alert');

describe("ProfileScreen", () => {
    beforeEach(() => {
       jest.clearAllMocks();

        // Mock the initial state of AsyncStorage
        AsyncStorage.getItem.mockResolvedValue(null);
    });

    it('loads and displays saved profile image', async () => {
        const { getByRole } = render(<ProfileScreen />);
        await waitFor(() => {
            expect(getByRole('button')).toBeTruthy();
        });
    });

    it('renders placeholder image when URI is not saved', async () => {
        const { getByTestId } = render(<ProfileScreen />);
        const image = getByTestId('profile-image');
        expect(image.props.source).toEqual(require('../assets/placeholder.png'));
    });

    it('loads saved image URI from AsyncStorage', async () => {
        AsyncStorage.getItem.mockResolvedValue('saved-uri');
        const { getByTestId } = render(<ProfileScreen />);
        await waitFor(() => {
            const image = getByTestId('profile-image');
            expect(image.props.source).toMatchObject({ uri: 'saved-uri' });
        });
    });

    it('shows alert with options when "Change Profile Picture" is pressed', async () => {
        const { getByTestId } = render(<ProfileScreen />);
        const button = getByTestId('change-profile-picture-button');
        fireEvent.press(button);

        await waitFor(() => {
            expect(Alert.alert).toHaveBeenCalledWith(
                'Change Profile Picture',
                'Choose an option:',
                expect.arrayContaining([
                    expect.objectContaining({ text: 'Take Photo'}),
                    expect.objectContaining({ text: 'Choose from Library' }),
                    expect.objectContaining({ text: 'Cancel'}),
                ])
            );
        });
    });
    
    it('stores image from camera in AsyncStorage', async () => {
        const { getByTestId } = render(<ProfileScreen />);
        const button = getByTestId('change-profile-picture-button');
        fireEvent.press(button);

        const takePhotoOption = Alert.alert.mock.calls[0][2].find(option => option.text === 'Take Photo');
        await waitFor(() => {
            takePhotoOption.onPress();
        });

        expect(ImagePicker.launchCameraAsync).toHaveBeenCalled();
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('profileImageUri', 'mock-camera-uri');
    });

    it('stores image from library in AsyncStorage', async () => {
        const { getByTestId } = render(<ProfileScreen />);
        const button = getByTestId('change-profile-picture-button');
        fireEvent.press(button);

        const chooseFromLibraryOption = Alert.alert.mock.calls[0][2].find(option => option.text === 'Choose from Library');
        await waitFor(() => {
            chooseFromLibraryOption.onPress();
        });

        expect(ImagePicker.launchImageLibraryAsync).toHaveBeenCalled();
        expect(AsyncStorage.setItem).toHaveBeenCalledWith('profileImageUri', 'mock-library-uri');
    });

    it('shows alert if camera permission is denied', async () => {
        ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: false });
        const { getByTestId } = render(<ProfileScreen />);
        const button = getByTestId('change-profile-picture-button');
        fireEvent.press(button);

        const takePhotoOption = Alert.alert.mock.calls[0][2].find(option => option.text === 'Take Photo');
        await waitFor(() => {
            takePhotoOption.onPress();
        });

        expect(Alert.alert).toHaveBeenCalledWith(
            'Permissions Denied',
            'Please grant camera and library access.'
        );
        expect(ImagePicker.launchCameraAsync).not.toHaveBeenCalled();
        expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });

    it('shows alert if media library permission is denied', async () => {
        ImagePicker.requestCameraPermissionsAsync.mockResolvedValue({ granted: true });
        ImagePicker.requestMediaLibraryPermissionsAsync.mockResolvedValue({ granted: false });

        const { getByTestId } = render(<ProfileScreen />);
        const button = getByTestId('change-profile-picture-button');
        fireEvent.press(button);

        const pickImageOption = Alert.alert.mock.calls[0][2].find(option => option.text === 'Choose from Library');
        await waitFor(() => {
            pickImageOption.onPress();
        });

        expect(Alert.alert).toHaveBeenCalledWith(
            'Permissions Denied',
            'Please grant camera and library access.'
        );
        expect(ImagePicker.launchImageLibraryAsync).not.toHaveBeenCalled();
        expect(AsyncStorage.setItem).not.toHaveBeenCalled();
    });
});