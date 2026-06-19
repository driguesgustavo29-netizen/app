import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { listarAlunos, atualizarStatusAluno } from '../services/firestoreService';
import { logoutUser } from '../services/authService';
import { mascaraCPF } from '../utils/validators';
import Header from '../components/Header';
import { colors, shadow, radius } from '../theme';

export default function AtendenteScreen({ navigation }) {
  const [alunos, setAlunos] = useState([]);

  useEffect(() => {
    const unsubscribe = listarAlunos(setAlunos);
    return unsubscribe;
  }, []);

  const handleStatus = async (id, status) => {
    if (status === 'Pendente') {
      const result = await atualizarStatusAluno(id, 'Entregue');
      if (!result.success) Alert.alert('Erro', result.error);
    } else {
      Alert.alert('Aviso', 'Documentos já entregues.');
    }
  };

  const handleLogout = async () => {
    await logoutUser();
    navigation.replace('Login');
  };

  const pendentes = alunos.filter((a) => a.status === 'Pendente').length;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('VisualizarDocumentos', { aluno: item })}
      activeOpacity={0.8}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.nome ? item.nome.charAt(0).toUpperCase() : '?'}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.nome}>{item.nome}</Text>
        <Text style={styles.detalhe}>CPF: {item.cpf ? mascaraCPF(item.cpf) : '-'}</Text>
        <Text style={styles.detalhe}>{item.curso}</Text>
        <View style={styles.cardFooter}>
          <View style={[styles.badge, item.status === 'Entregue' ? styles.badgeOk : styles.badgePend]}>
            <Text style={[styles.badgeText, item.status === 'Entregue' ? styles.badgeTextOk : styles.badgeTextPend]}>
              {item.status}
            </Text>
          </View>
          {item.status === 'Pendente' && (
            <TouchableOpacity style={styles.aprovarBtn} onPress={() => handleStatus(item.id, item.status)}>
              <Text style={styles.aprovarText}>✓ Marcar entregue</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.flex}>
      <Header variant="bar" subtitle="Painel do atendente" />

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{alunos.length}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.warning }]}>{pendentes}</Text>
          <Text style={styles.statLabel}>Pendentes</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={[styles.statNumber, { color: colors.success }]}>{alunos.length - pendentes}</Text>
          <Text style={styles.statLabel}>Entregues</Text>
        </View>
      </View>

      <FlatList
        data={alunos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.vazio}>Nenhum aluno cadastrado ainda.</Text>}
      />

      <TouchableOpacity style={styles.logout} onPress={handleLogout}>
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  statsRow: { flexDirection: 'row', gap: 10, padding: 16, paddingBottom: 6 },
  statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: radius.md, padding: 14, alignItems: 'center', ...shadow.card },
  statNumber: { fontSize: 24, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textMuted, marginTop: 2 },
  list: { padding: 16, paddingTop: 6 },
  card: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 14, marginBottom: 12, ...shadow.card },
  avatar: { width: 48, height: 48, borderRadius: radius.full, backgroundColor: colors.primaryBright, alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: colors.onPrimary, fontSize: 20, fontWeight: '700' },
  cardInfo: { flex: 1 },
  nome: { fontSize: 16, fontWeight: '700', color: colors.text },
  detalhe: { fontSize: 13, color: colors.textMuted, marginTop: 1 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.full },
  badgeOk: { backgroundColor: 'rgba(45,212,191,0.15)' },
  badgePend: { backgroundColor: 'rgba(251,191,36,0.15)' },
  badgeText: { fontSize: 12, fontWeight: '700' },
  badgeTextOk: { color: colors.success },
  badgeTextPend: { color: colors.warning },
  aprovarBtn: { backgroundColor: colors.primary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: radius.sm },
  aprovarText: { color: colors.onPrimary, fontSize: 12, fontWeight: '600' },
  vazio: { textAlign: 'center', marginTop: 50, color: colors.textMuted },
  logout: { backgroundColor: colors.surfaceLight, margin: 16, marginTop: 0, padding: 14, borderRadius: radius.md, alignItems: 'center' },
  logoutText: { color: colors.white, fontWeight: '700', fontSize: 15 },
});
