import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function StatusBadge({ status, large }) {
  const ativo = Number(status) === 1;
  const cor = ativo ? colors.success : colors.danger;
  return (
    <View style={[styles.badge, { backgroundColor: ativo ? colors.successBg : colors.dangerBg }, large && styles.large]}>
      <View style={[styles.dot, { backgroundColor: cor }]} />
      <Text style={{ color: cor, fontWeight: '700', fontSize: large ? 16 : 13 }}>
        {ativo ? 'Ativo' : 'Inativo'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20 },
  large: { paddingHorizontal: 16, paddingVertical: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
});