import auth from "@react-native-firebase/auth";
// import { LoginManager, AccessToken } from "react-native-fbsdk-next";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: '725105456854-mfh61k5g46clhjhmq8nje2qu3n1bvt75.apps.googleusercontent.com', // The correct web client ID
});


// export async function onGoogleButtonPress() {
  
//   // Check if your device supports Google Play
//   await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
//   // Get the users ID token
//   const { idToken } = await GoogleSignin.signIn();

//   // Create a Google credential with the token
//   const googleCredential = auth.GoogleAuthProvider.credential(idToken);

//   // Sign-in the user with the credential
//   return auth().signInWithCredential(googleCredential);
// }
export async function onGoogleButtonPress() {
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

    await GoogleSignin.signOut(); // Ensure fresh sign-in
    
    const userInfo = await GoogleSignin.signIn(); // Capture the full user info

    // console.log("User Info:", userInfo); // Log the entire user object
    console.log("User Info Structure:", JSON.stringify(userInfo, null, 2));

    const { idToken } = userInfo.data;
    console.log(idToken); // become undefined
    if (!idToken) {
      throw new Error('Google Sign-In failed: No idToken received.');
    }

    const googleCredential = auth.GoogleAuthProvider.credential(idToken);

    return auth().signInWithCredential(googleCredential);
  } catch (error) {
    console.error("Google Sign-In Error", error);
    throw error;
  }
}

