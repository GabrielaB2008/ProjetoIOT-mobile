
import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { consultarStatus } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import Botao from '../components/botao';
import { colors, shadow } from '../theme';

export default function ConsultaScreen() {
  const [codigo, setCodigo] = useState('');
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState(null);

  const buscar = async () => {
    if (!codigo.trim() || loading) return;

    Keyboard.dismiss();
    setLoading(true);
    setErro(null);
    setResultado(null);

    try {
      const status = await consultarStatus(codigo);
      setResultado({
        codigo: codigo.trim().toUpperCase(),
        status,
      });
    } catch (e) {
      setErro(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.conteudo}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.cabecalho}>
          <View style={styles.iconeTitulo}>
            <Ionicons
              name="search-outline"
              size={25}
              color={colors.primary}
            />
          </View>

          <Text style={styles.titulo}>Consultar sensor</Text>
          <Text style={styles.sub}>
            Digite o código para verificar o status atual.
          </Text>
        </View>

        <View style={styles.formulario}>
          <Text style={styles.label}>Código do sensor</Text>

          <View style={styles.inputBox}>
            <Ionicons
              name="hardware-chip-outline"
              size={20}
              color={colors.muted}
            />

            <TextInput
              style={styles.input}
              value={codigo}
              onChangeText={setCodigo}
              placeholder="Ex.: S1"
              placeholderTextColor={colors.muted}
              autoCapitalize="characters"
              autoCorrect={false}
              onSubmitEditing={buscar}
              returnKeyType="search"
              accessibilityLabel="Código do sensor"
            />
          </View>

          <Botao
            titulo="Consultar"
            onPress={buscar}
            loading={loading}
            disabled={!codigo.trim()}
          />

          {erro && (
            <View style={styles.erroBox}>
              <Ionicons
                name="alert-circle"
                size={20}
                color={colors.danger}
              />
              <Text style={styles.erroTxt}>{erro}</Text>
            </View>
          )}
        </View>

        {resultado && (
          <View style={[styles.resultado, shadow]}>
            <Ionicons
              name="radio-outline"
              size={30}
              color={colors.primary}
            />

            <Text style={styles.resRotulo}>Resultado da consulta</Text>
            <Text style={styles.resCodigo}>{resultado.codigo}</Text>

            <StatusBadge status={resultado.status} large />
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  conteudo: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  cabecalho: {
    marginBottom: 26,
  },
  iconeTitulo: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  titulo: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
  },
  sub: {
    fontSize: 14,
    lineHeight: 21,
    color: colors.muted,
    marginTop: 6,
  },
  formulario: {
    width: '100%',
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 9,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 14,
    fontSize: 16,
    color: colors.text,
  },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.dangerBg,
    padding: 12,
    borderRadius: 10,
    marginTop: 14,
  },
  erroTxt: {
    color: colors.danger,
    flex: 1,
    lineHeight: 20,
  },
  resultado: {
    marginTop: 22,
    backgroundColor: colors.card,
    borderRadius: 18,
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  resRotulo: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  resCodigo: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    maxWidth: '100%',
  },
});
