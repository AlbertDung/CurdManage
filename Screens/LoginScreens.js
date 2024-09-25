import React, { useState, useContext,useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword,GoogleAuthProvider,signInWithCredential, FacebookAuthProvider } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import { AuthContext } from '../App'; // Đảm bảo đường dẫn này chính xác

// import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
// import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

import { onGoogleButtonPress } from '../socialSignIn';
import * as Google from 'expo-auth-session/providers/google';
import * as Facebook from 'expo-auth-session/providers/facebook';
import * as AuthSession from 'expo-auth-session'; // Import AuthSession

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyApjfCQxJzfv8ziC7-UKbw9NISlf6-gFnA",
  authDomain: "curdmanage.firebaseapp.com",
  projectId: "curdmanage",
  storageBucket: "curdmanage.appspot.com",
  messagingSenderId: "725105456854",
  appId: "1:725105456854:web:f2df1d75ee0e387473bb77"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const LoginScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigation = useNavigation();

  const { signIn } = useContext(AuthContext); // Sử dụng AuthContext



  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '756702315456-3t6618id9kfjpqj7467chstrhvdtmps5.apps.googleusercontent.com',
  });


  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).then(() => {
        navigation.navigate('EmployeeList');
      }).catch((err) => {
        setError('Google Sign-In failed. Try again.');
      });
    }
  }, [response]);

  const handleLogin = async () => {
    if (!email.trim() && !password.trim()) {
      setError('Vui lòng nhập email và mật khẩu.');
      return;
    }
    if (!email.trim()) {
      setError('Vui lòng nhập email của bạn.');
      return;
    }
    if (!password.trim()) {
      setError('Vui lòng nhập mật khẩu của bạn.');
      return;
    }
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      signIn();
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        setError('Không tìm thấy tài khoản với email này. Vui lòng kiểm tra lại hoặc đăng ký mới.');
      } else if (error.code === 'auth/wrong-password') {
        setError('Mật khẩu không chính xác. Vui lòng thử lại.');
      } else if (error.code === 'auth/invalid-email') {
        setError('Email không hợp lệ. Vui lòng nhập một địa chỉ email hợp lệ.');
      } else if (error.code === 'auth/too-many-requests') {
        setError('Quá nhiều lần thử không thành công. Vui lòng thử lại sau.');
      } else {
        setError('Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    }
  };
  const handleGoogleSignIn = async () => {
    try {
      const result = await onGoogleButtonPress();
      if (result) {
        navigation.navigate('Main');
      }
     } catch (error) {
      setError('Google Sign-In failed. Try again.');
    }
  };

  const handleGoogleLogin = async (idToken) => {
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      await signInWithCredential(auth, credential);
      navigation.navigate('EmployeeList');
    } catch (err) {
      setError('Google Sign-In failed. Try again.');
    }
  };

  const [fbRequest, fbResponse, fbPromptAsync] = Facebook.useAuthRequest({
    clientId: '1256945355492169', // Thay thế bằng ID ứng dụng Facebook của bạn
    redirectUri: AuthSession.makeRedirectUri(),
  });
  
  const handleFacebookLogin = async () => {
    try {
      const result = await fbPromptAsync();
      if (result?.type === 'success') {
        const { access_token } = result.params;
        const credential = FacebookAuthProvider.credential(access_token);
        await signInWithCredential(auth, credential);
  
        // Facebook login success, navigate to Welcome screen
        Alert.alert('Đăng nhập thành công với Facebook!');
        navigation.navigate('Home');  // Ensure 'Welcome' is a valid route in your navigation
      }
    } catch (error) {
      Alert.alert('Đăng nhập Facebook thất bại', error.message);
    }
  };

  const handleSocialLogin = (platform) => {
    console.log(`Login with ${platform}`);
  };


  // const toTheSignUp = async () => {
  //   navigation.navigate('Signup');
  // };
  return (
    <LinearGradient colors={['#FF9966', '#FF5E62']} style={styles.gradient}>
      <SafeAreaView>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <View style={styles.logoContainer}>
            <Image style={styles.logo} />
          </View>
          <View style={styles.formContainer}>
            <Text style={styles.title}>Welcome Back</Text>
            <View style={styles.inputContainer}>
              <Feather name="mail" size={24} color="#FF5E62" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#999"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.inputContainer}>
              <Feather name="lock" size={24} color="#FF5E62" style={styles.icon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#999"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={24} color="#FF5E62" />
              </TouchableOpacity>
            </View>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
              <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <View style={styles.socialLoginContainer}>
              <TouchableOpacity style={styles.socialButton} onPress={() => {
                  handleGoogleSignIn().then(() => {
                    signIn(); // Cập nhật trạng thái đăng nhập
                  }).catch(error => {
                    console.error(error);
                    setError('Google Sign-In failed. Try again.');
                  });
                }}>
                <FontAwesome name="google" size={24} color="#DB4437" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={handleFacebookLogin}>
                <FontAwesome name="facebook" size={24} color="#4267B2" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton} onPress={() => handleSocialLogin('github')}>
                <FontAwesome name="github" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.forgotPassword} onPress={() => navigation.navigate('ForgotPassword')}>
              <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
            </TouchableOpacity>
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Don't have an account?</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                <Text style={styles.signupLink}>Sign Up</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingBottom: 150,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
  },
  formContainer: {
    width: '90%',
    maxWidth: 400,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF5E62',
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  button: {
    backgroundColor: '#FF5E62',
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 30,
    alignItems: 'center',
    marginTop: 20,
    width: '100%',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: '#FF3B30',
    marginBottom: 10,
  },
  forgotPassword: {
    marginTop: 15,
  },
  forgotPasswordText: {
    color: '#FF5E62',
    fontSize: 16,
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#666',
    fontSize: 16,
  },
  signupLink: {
    color: '#FF5E62',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 5,
  },
  socialLoginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  socialButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
});

export default LoginScreen;
