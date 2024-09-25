import React, { useState } from 'react';
import { View } from "react-native";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './Screens/LoginScreens';
import SignupScreen from './Screens/Signup';
import ForgotPasswordScreen from './Screens/ForgotPassword';
import EmployeeList from './Screens/EmployeeList';

export const AuthContext = React.createContext();
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  );
}
function MainStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="EmployeeList" component={EmployeeList} />
      
    </Stack.Navigator>
  );
}
function RootNavigator() {
  const { isLoggedIn } = React.useContext(AuthContext);
  
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
        <Stack.Screen name="Main" component={MainStack} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
    </Stack.Navigator>
  );
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const authContext = React.useMemo(
    () => ({
      signIn: () => {
        setIsLoggedIn(true);
      },
      signOut: () => {
        setIsLoggedIn(false);
      },
      isLoggedIn,
    }),
    [isLoggedIn]
  );

  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        <View style={{ flex: 1 }}>
          <RootNavigator />
        </View>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}

export default App;