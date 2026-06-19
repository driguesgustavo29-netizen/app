import { View, Text, StyleSheet } from 'react-native';
import { colors, instituicao, radius, shadow } from '../theme';

// variant="full" -> brasão grande (telas de entrada)
// variant="bar"  -> barra compacta no topo (telas internas)
export default function Header({ subtitle, variant = 'full' }) {
  if (variant === 'bar') {
    return (
      <View style={styles.bar}>
        <View style={styles.logoSmall}>
          <Text style={styles.logoSmallText}>{instituicao.sigla}</Text>
        </View>
        <View>
          <Text style={styles.barTitle}>{instituicao.sigla} · Portal Acadêmico</Text>
          {subtitle && <Text style={styles.barSubtitle}>{subtitle}</Text>}
        </View>
      </View>
    );
  }

  return (
    <View style={styles.full}>
      <View style={[styles.logo, shadow.glow]}>
        <Text style={styles.logoText}>{instituicao.sigla}</Text>
      </View>
      <Text style={styles.nome}>{instituicao.nome}</Text>
      <Text style={styles.lema}>{instituicao.lema}</Text>
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  full: { alignItems: 'center', marginBottom: 28 },
  logo: {
    width: 92, height: 92, borderRadius: radius.xl,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
    marginBottom: 16, borderWidth: 1.5, borderColor: colors.primaryBright,
  },
  logoText: { color: colors.onPrimary, fontSize: 34, fontWeight: '800', letterSpacing: 1 },
  nome: { fontSize: 20, fontWeight: '700', color: colors.text, textAlign: 'center' },
  lema: { fontSize: 13, color: colors.accent, marginTop: 4, textAlign: 'center' },
  subtitle: { fontSize: 16, color: colors.textMuted, marginTop: 16, fontWeight: '600' },

  bar: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.bgElevated,
    paddingVertical: 16, paddingHorizontal: 18,
    borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  logoSmall: {
    width: 42, height: 42, borderRadius: radius.sm,
    backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center',
  },
  logoSmallText: { color: colors.onPrimary, fontWeight: '800', fontSize: 15 },
  barTitle: { color: colors.text, fontWeight: '700', fontSize: 14 },
  barSubtitle: { color: colors.accent, fontSize: 12, marginTop: 1 },
});
