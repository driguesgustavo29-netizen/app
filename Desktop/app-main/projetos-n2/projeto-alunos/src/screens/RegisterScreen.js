import { View, Text, StyleSheet, Alert, ScrollView, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useState } from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import Header from '../components/Header';
import { registerUser } from '../services/authService';
import { salvarPerfilUsuario } from '../services/firestoreService';
import { validarEmail } from '../utils/validators';
import { colors, shadow, radius } from '../theme';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [perfil, setPerfil] = useState('aluno');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!email || !password || !confirm) return Alert.alert('Erro', 'Preencha todos os campos');
    if (!validarEmail(email)) return Alert.alert('Erro', 'E-mail inválido');
    if (password.length < 6) return Alert.alert('Erro', 'A senha deve ter pelo menos 6 caracteres');
    if (password !== confirm) return Alert.alert('Erro', 'Senhas não coincidem');

    setLoading(true);
    const result = await registerUser(email.trim().toLowerCase(), password);
    if (result.success) {
      await salvarPerfilUsuario(result.user.uid, perfil);
      Alert.alert('Sucesso', 'Cadastro realizado! Faça login.');
      navigation.navigate('Login');
    } else {
      Alert.alert('Erro', result.error);
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Header subtitle="Criar conta" />
        <View style={styles.card}>
          <Input label="E-mail" placeholder="seu@email.com" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
          <Input label="Senha" placeholder="Mín. 6 caracteres" value={password} onChangeText={setPassword} secureTextEntry />
          <Input label="Confirmar senha" placeholder="Repita a senha" value={confirm} onChangeText={setConfirm} secureTextEntry />

          <Text style={styles.perfilLabel}>Tipo de perfil</Text>
          <View style={styles.perfilOptions}>
            <TouchableOpacity
              style={[styles.perfilCard, perfil === 'aluno' && styles.perfilCardActive]}
              onPress={() => setPerfil('aluno')}
              activeOpacity={0.8}
            >
              <Text style={[styles.perfilEmoji]}>🎓</Text>
              <Text style={[styles.perfilText, perfil === 'aluno' && styles.perfilTextActive]}>Aluno</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.perfilCard, perfil === 'atendente' && styles.perfilCardActive]}
              onPress={() => setPerfil('atendente')}
              activeOpacity={0.8}
            >
              <Text style={[styles.perfilEmoji]}>🧑‍💼</Text>
              <Text style={[styles.perfilText, perfil === 'atendente' && styles.perfilTextActive]}>Atendente</Text>
            </TouchableOpacity>
          </View>

          <Button title={loading ? 'Cadastrando...' : 'Cadastrar'} onPress={handleRegister} disabled={loading} />
          <Button title="Voltar ao login" onPress={() => navigation.goBack()} variant="outline" />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 22, borderWidth: 1, borderColor: colors.border, ...shadow.card },
  perfilLabel: { fontSize: 13, color: colors.textMuted, marginTop: 10, marginBottom: 8, fontWeight: '600' },
  perfilOptions: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  perfilCard: {
    flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: radius.md,
    borderWidth: 1.5, borderColor: colors.border, backgroundColor: colors.surfaceLight,
  },
  perfilCardActive: { borderColor: colors.primaryBright, backgroundColor: colors.bgElevated },
  perfilEmoji: { fontSize: 26, marginBottom: 4 },
  perfilText: { fontSize: 15, fontWeight: '600', color: colors.textMuted },
  perfilTextActive: { color: colors.accent },
});
