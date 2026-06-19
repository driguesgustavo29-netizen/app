import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import Button from '../components/Button';
import { colors, radius, shadow, instituicao } from '../theme';

export default function HomeScreen({ navigation }) {
  const features = [
    { icon: '📝', titulo: 'Cadastro digital', desc: 'Matrícula 100% online com validação automática de CPF, RG e demais dados.' },
    { icon: '📤', titulo: 'Envio de documentos', desc: 'Anexe documento pessoal e certificado direto pela câmera ou galeria.' },
    { icon: '✅', titulo: 'Validação ágil', desc: 'A equipe acadêmica confere e aprova seus documentos em tempo real.' },
  ];

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      {/* HERO */}
      <View style={styles.hero}>
        <View style={styles.topBar}>
          <View style={styles.logoSmall}><Text style={styles.logoSmallText}>{instituicao.sigla}</Text></View>
          <Text style={styles.topBarText}>Portal Acadêmico</Text>
        </View>

        <View style={styles.glowOrb} />

        <Text style={styles.badge}>● SISTEMA ACADÊMICO DIGITAL</Text>
        <Text style={styles.heroTitle}>
          O futuro da sua{'\n'}<Text style={styles.heroTitleAccent}>vida acadêmica</Text>{'\n'}começa aqui.
        </Text>
        <Text style={styles.heroSubtitle}>
          {instituicao.nome}. Faça sua matrícula, envie seus documentos e acompanhe a validação — tudo em um só lugar.
        </Text>

        <Button title="Acessar minha conta  ›" onPress={() => navigation.navigate('Login')} />
        <Button title="Criar nova matrícula" variant="outline" onPress={() => navigation.navigate('Register')} />
      </View>

      {/* FEATURES */}
      <View style={styles.section}>
        <Text style={styles.sectionLabel}>COMO FUNCIONA</Text>
        <Text style={styles.sectionTitle}>Tudo o que você precisa, digital</Text>

        {features.map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.featureIcon}><Text style={styles.featureIconText}>{f.icon}</Text></View>
            <View style={styles.featureContent}>
              <Text style={styles.featureTitle}>{f.titulo}</Text>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}
      </View>

      {/* STATS */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}><Text style={styles.statNum}>30+</Text><Text style={styles.statLabel}>cursos</Text></View>
        <View style={styles.statBox}><Text style={styles.statNum}>100%</Text><Text style={styles.statLabel}>online</Text></View>
        <View style={styles.statBox}><Text style={styles.statNum}>24h</Text><Text style={styles.statLabel}>acesso</Text></View>
      </View>

      {/* CTA FINAL */}
      <View style={styles.ctaCard}>
        <Text style={styles.ctaTitle}>Pronto para começar?</Text>
        <Text style={styles.ctaDesc}>Crie sua conta e faça sua matrícula em minutos.</Text>
        <Button title="Começar agora  ›" onPress={() => navigation.navigate('Register')} />
      </View>

      <Text style={styles.footer}>© 2026 {instituicao.nome}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.bg },
  container: { paddingBottom: 40 },

  hero: { paddingHorizontal: 24, paddingTop: 16, paddingBottom: 36, position: 'relative', overflow: 'hidden' },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 40 },
  logoSmall: { width: 38, height: 38, borderRadius: radius.sm, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  logoSmallText: { color: colors.onPrimary, fontWeight: '800', fontSize: 14 },
  topBarText: { color: colors.textMuted, fontSize: 14, fontWeight: '600' },

  glowOrb: {
    position: 'absolute', top: -60, right: -80, width: 260, height: 260, borderRadius: 130,
    backgroundColor: colors.primary, opacity: 0.18,
  },

  badge: { color: colors.accent, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 16 },
  heroTitle: { color: colors.text, fontSize: 38, fontWeight: '800', lineHeight: 44, marginBottom: 16 },
  heroTitleAccent: { color: colors.primaryBright },
  heroSubtitle: { color: colors.textMuted, fontSize: 15, lineHeight: 22, marginBottom: 28 },

  section: { paddingHorizontal: 24, paddingVertical: 20 },
  sectionLabel: { color: colors.primaryBright, fontSize: 12, fontWeight: '700', letterSpacing: 1, marginBottom: 6 },
  sectionTitle: { color: colors.text, fontSize: 24, fontWeight: '700', marginBottom: 20 },

  featureCard: {
    flexDirection: 'row', backgroundColor: colors.surface, borderRadius: radius.lg, padding: 18, marginBottom: 14,
    borderWidth: 1, borderColor: colors.border, gap: 14, ...shadow.card,
  },
  featureIcon: { width: 48, height: 48, borderRadius: radius.md, backgroundColor: colors.surfaceLight, alignItems: 'center', justifyContent: 'center' },
  featureIconText: { fontSize: 24 },
  featureContent: { flex: 1 },
  featureTitle: { color: colors.text, fontSize: 16, fontWeight: '700', marginBottom: 4 },
  featureDesc: { color: colors.textMuted, fontSize: 13, lineHeight: 19 },

  statsRow: { flexDirection: 'row', gap: 12, paddingHorizontal: 24, marginVertical: 12 },
  statBox: { flex: 1, backgroundColor: colors.bgElevated, borderRadius: radius.lg, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  statNum: { color: colors.primaryBright, fontSize: 26, fontWeight: '800' },
  statLabel: { color: colors.textMuted, fontSize: 12, marginTop: 2 },

  ctaCard: {
    margin: 24, padding: 26, borderRadius: radius.xl, alignItems: 'center',
    backgroundColor: colors.surface, borderWidth: 1.5, borderColor: colors.primary, ...shadow.glow,
  },
  ctaTitle: { color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: 6 },
  ctaDesc: { color: colors.textMuted, fontSize: 14, textAlign: 'center', marginBottom: 18 },

  footer: { textAlign: 'center', color: colors.textDim, fontSize: 12, marginTop: 12 },
});
