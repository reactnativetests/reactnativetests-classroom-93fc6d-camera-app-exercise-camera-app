Create React Native application that allows users to select a profile picture by capturing image using the device’s native camera or selecting image from image library.

Instructions for implementation:


1. Project Setup 
· Create a single screen component called ProfileScreen.
· Set up navigation using React Navigation if building multi-screen app.


2. Basic layout of Profile Screen 
· Display a circular placeholder for a profile picture.
· Add a button labeled "Change Profile Picture".


3. Native Camera/Image Library Integration
· Use expo-image-picker
· Permissions: Request necessary permissions (camera, photo library) before attempting to access them. Display a user-friendly message if permissions are denied.
· "Change Profile Picture" Button Action:
o When the "Change Profile Picture" button is pressed, present the user with an option to either:
  -	"Take Photo" with camera
  -	"Choose from Library" selecting an existing image


· Image Handling:

o After the user takes a photo or selects an image, display the selected image in the circular profile picture placeholder.

o Store the URI of the selected image in the component's state.


4. Local Data Persistence
· Choose a library:
      -  Use AsyncStorage to persist the selected profile picture URI locally.
· Saving:
      -  When a new picture is selected, save its URI to AsyncStorage.
· Loading:
      -  When ProfileScreen mounts, check if a profile picture URI exists in AsyncStorage. If it does, load and display it.


6. UI & Usability
· Ensure the profile picture placeholder is visually appealing (for example circular border).
· Provide clear feedback to the user during the process (for example "Loading camera...", "Saving image...").
· Handle cases where the user cancels the camera/image picker operation.
· Use basic styling for a clean and functional interface.

