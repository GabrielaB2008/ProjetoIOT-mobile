import { Pressable, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '../theme';

export default function Botao({ titulo, onPress, loading, disabled }) {
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [styles.btn, (pressed || loading || disabled) && { opacity: 0.7 }]}
    >
      {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.txt}>{titulo}</Text>}
    </Pressable>
  );
}



const styles = StyleSheet.create({
  btn: {
    width: '100%',
    minHeight: 50,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  txt: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    textAlign: 'center',
  },
});

