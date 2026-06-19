import { View, Text, Image, StyleSheet, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { mascaraCPF, mascaraRG, mascaraTelefone } from '../utils/validators';
import { atualizarStatusAluno } from '../services/firestoreService';
import Button from '../components/Button';
import Header from '../components/Header';
import { colors, shadow, radius } from '../theme';

export default function VisualizarDocumentosScreen({ route, navigation }) {
  const { aluno } = route.params;
  const [status, setStatus] = useState(aluno.status);

  const getSource = (uri) => (uri ? { uri } : null);

  const marcarEntregue = async () => {
    const result = await atualizarStatusAluno(aluno.id, 'Entregue');
    if (result.success) {
      setStatus('Entregue');
      Alert.alert('Sucesso', 'Status atualizado para Entregue.');
    } else {
      Alert.alert('Erro', result.error);
    }
  };

  const Linha = ({ label, valor }) => (
    <View style={styles.linha}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.valor}>{valor || '-'}</Text>
    </View>
  );

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <Header variant="bar" subtitle="Documentos do aluno" />

      <View style={styles.body}>
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{aluno.nome ? aluno.nome.charAt(0).toUpperCase() : '?'}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{aluno.nome}</Text>
              <View style={[styles.badge, status === 'Entregue' ? styles.badgeOk : styles.badgePend]}>
                <Text style={[styles.badgeText, status === 'Entregue' ? styles.badgeTextOk : styles.badgeTextPend]}>{status}</Text>
              </View>
            </View>
          </View>

          <Linha label="CPF" valor={aluno.cpf ? mascaraCPF(aluno.cpf) : '-'} />
          <Linha label="RG" valor={aluno.rg ? mascaraRG(aluno.rg) : '-'} />
          <Linha label="Nascimento" valor={aluno.dataNascimento} />
          <Linha label="E-mail" valor={aluno.email} />
          <Linha label="Telefone" valor={aluno.telefone ? mascaraTelefone(aluno.telefone) : '-'} />
          <Linha label="Curso" valor={aluno.curso} />
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Documento Pessoal</Text>
          {aluno.caminhoDocumento
            ? <Image source={getSource(aluno.caminhoDocumento)} style={styles.image} />
            : <Text style={styles.semImg}>Não enviado</Text>}
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Certificado</Text>
          {aluno.caminhoCertificado
            ? <Image source={getSource(aluno.caminhoCertificado)} style={styles.image} />
            : <Text style={styles.semImg}>Não enviado</Text>}
        </View>

        {status === 'Pendente' && (
          <Button title="✓ Marcar como Entregue" onPress={marcarEntregue} />
        )}
        <Button title="Voltar" onPress={() => navigation.goBack()} variant="outline" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { paddingBottom: 30 },
  body: { padding: 16 },
  card: { backgroundColor: colors.surface, borderRadius: radius.lg, padding: 18, marginBottom: 16, ...shadow.card },
  headerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 14, gap: 12 },
  avatar: { width: 54, height: 54, borderRadius: radius.full, backgroundColor: colors.primaryBright, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: colors.onPrimary, fontSize: 22, fontWeight: '700' },
  nome: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  badge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 3, borderRadius: radius.full },
  badgeOk: { backgroundColor: 'rgba(45,212,191,0.15)' },
  badgePend: { backgroundColor: 'rgba(251,191,36,0.15)' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  badgeTextOk: { color: colors.success },
  badgeTextPend: { color: colors.warning },
  linha: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: colors.border },
  label: { fontSize: 14, color: colors.textMuted, fontWeight: '600' },
  valor: { fontSize: 14, color: colors.text, flex: 1, textAlign: 'right', marginLeft: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.accent, marginBottom: 12 },
  image: { width: '100%', height: 260, resizeMode: 'contain', borderRadius: radius.md, backgroundColor: colors.surfaceLight },
  semImg: { color: colors.textMuted, textAlign: 'center', paddingVertical: 20 },
});
