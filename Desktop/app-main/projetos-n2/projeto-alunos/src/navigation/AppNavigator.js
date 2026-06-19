import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CadastroAlunoScreen from '../screens/CadastroAlunoScreen';
import AtendenteScreen from '../screens/AtendenteScreen';
import VisualizarDocumentosScreen from '../screens/VisualizarDocumentosScreen';
import { colors } from '../theme';

const Stack = createStackNavigator();

// tema escuro pro container de navegação (evita "flash" branco entre telas)
const navTheme = {
  ...DefaultTheme,
  colors: { ...DefaultTheme.colors, background: colors.bg },
};

export default function AppNavigator() {
  return (
    <NavigationContainer theme={navTheme}>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="CadastroAluno" component={CadastroAlunoScreen} />
        <Stack.Screen name="Atendente" component={AtendenteScreen} />
        <Stack.Screen name="VisualizarDocumentos" component={VisualizarDocumentosScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
