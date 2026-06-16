import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CadastroAlunoScreen from '../screens/CadastroAlunoScreen';
import AtendenteScreen from '../screens/AtendenteScreen';
import VisualizarDocumentosScreen from '../screens/VisualizarDocumentosScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Cadastro' }}
        />

        <Stack.Screen
          name="CadastroAluno"
          component={CadastroAlunoScreen}
          options={{ title: 'Cadastro do Aluno' }}
        />

        <Stack.Screen
          name="Atendente"
          component={AtendenteScreen}
          options={{ title: 'Atendente' }}
        />

        <Stack.Screen
          name="VisualizarDocumentos"
          component={VisualizarDocumentosScreen}
          options={{ title: 'Documentos' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}