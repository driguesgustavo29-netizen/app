import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/LoginScreen';
import ListaComprasScreen from '../screens/ListaComprasScreen';
import CadastroProdutoScreen from '../screens/CadastroProdutoScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ListaCompras" component={ListaComprasScreen} options={{ title: 'Lista de Compras' }} />
        <Stack.Screen name="CadastroProduto" component={CadastroProdutoScreen} options={{ title: 'Adicionar Produto' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
