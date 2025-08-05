jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

jest.mock('expo-image-picker', () => ({
    requestCameraPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    requestMediaLibraryPermissionsAsync: jest.fn(() => Promise.resolve({ granted: true })),
    launchCameraAsync: jest.fn(() => 
        Promise.resolve({ 
            cancelled: false, 
            assets: [{uri: 'mock-camera-uri'}],
        })
    ),
    launchImageLibraryAsync: jest.fn(() => 
        Promise.resolve({ 
            cancelled: false, 
            assets: [{uri: 'mock-library-uri'}] 
        })
    )
}));