import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';
import { loginUser } from '../services/authService';
import { getPerfilUsuario } from '../services/firestoreService';
import { colors, shadow, radius } from '../theme';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }
    setLoading(true);
    const result = await loginUser(email, password);
    if (result.success) {
      const perfilResult = await getPerfilUsuario(result.user.uid);
      if (perfilResult.success && perfilResult.perfil === 'atendente') navigation.replace('Atendente');
      else navigation.replace('CadastroAluno');
    } else {
      Alert.alert('Erro', result.error);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header subtitle="Portal Acadêmico" />
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Acesso ao sistema</Text>
          <Input label="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Senha" placeholder="••••••••" value={password} onChangeText={setPassword} secureTextEntry />
          <Button title={loading ? 'Entrando...' : 'Entrar'} onPress={handleLogin} disabled={loading} />
          <Button title="Criar nova conta" onPress={() => navigation.navigate('Register')} variant="outline" />
          <Button title="‹ Voltar ao início" onPress={() => navigation.navigate('Home')} variant="ghost" />
        </View>
        <Text style={styles.footer}>© 2026 Instituto Politécnico Horizonte</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 22, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 14, textAlign: 'center' },
  footer: { textAlign: 'center', color: colors.textDim, fontSize: 12, marginTop: 24 },
});
