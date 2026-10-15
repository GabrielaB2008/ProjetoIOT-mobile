
import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { atualizarStatus } from '../services/api';
import Botao from '../components/botao';
import { colors, shadow } from '../theme';

export default function AtualizarScreen({ route }) {
  const [codigo, setCodigo] = useState('');
  const [status, setStatus] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  useEffect(() => {
    if (route.params?.codigo) {
      setCodigo(route.params.codigo);
      setMsg(null);
    }
  }, [route.params?.codigo]);

  const salvar = async () => {
    if (!codigo.trim() || loading) {
      if (!codigo.trim()) {
        setMsg({
          ok: false,
          texto: 'Informe o código do sensor.',
        });
      }
      return;
    }

    Keyboard.dismiss();
    setLoading(true);
    setMsg(null);

    try {
      await atualizarStatus(codigo, status);
      setMsg({
        ok: true,
        texto: `Sensor ${codigo.trim().toUpperCase()} atualizado com sucesso!`,
      });
    } catch (e) {
      setMsg({ ok: false, texto: e.message });
    } finally {
      setLoading(false);
    }
  };

  const Opcao = ({ valor, titulo, icone, cor, corBg }) => {
    const sel = status === valor;

    return (
      <Pressable
        accessibilityRole="radio"
        accessibilityState={{ selected: sel }}
        onPress={() => setStatus(valor)}
        style={({ pressed }) => [
          styles.opcao,
          sel && { backgroundColor: corBg, borderColor: cor },
          pressed && { opacity: 0.8 },
        ]}
      >
        <Ionicons
          name={icone}
          size={27}
          color={sel ? cor : colors.muted}
        />
        <Text
          style={[
            styles.opcaoTxt,
            sel && { color: cor },
          ]}
        >
          {titulo}
        </Text>
      </Pressable>
    );
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
              name="create-outline"
              size={25}
              color={colors.primary}
            />
          </View>

          <Text style={styles.titulo}>Atualizar status</Text>
          <Text style={styles.sub}>
            Selecione o sensor e escolha o novo status.
          </Text>
        </View>

        <View style={[styles.formulario, shadow]}>
          <Text style={styles.label}>Código do sensor</Text>

          <TextInput
            style={styles.input}
            value={codigo}
            onChangeText={setCodigo}
            placeholder="Ex.: S1"
            placeholderTextColor={colors.muted}
            autoCapitalize="characters"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <Text style={styles.label}>Novo status</Text>

          <View style={styles.opcoes}>
            <Opcao
              valor={1}
              titulo="Ativo"
              icone="checkmark-circle"
              cor={colors.success}
              corBg={colors.successBg}
            />

            <Opcao
              valor={0}
              titulo="Inativo"
              icone="close-circle"
              cor={colors.danger}
              corBg={colors.dangerBg}
            />
          </View>

          <Botao
            titulo="Salvar alteração"
            onPress={salvar}
            loading={loading}
            disabled={!codigo.trim()}
          />

          {msg && (
            <View
              style={[
                styles.msg,
                {
                  backgroundColor: msg.ok
                    ? colors.successBg
                    : colors.dangerBg,
                },
              ]}
            >
              <Ionicons
                name={msg.ok ? 'checkmark-circle' : 'alert-circle'}
                size={20}
                color={msg.ok ? colors.success : colors.danger}
              />
              <Text
                style={{
                  color: msg.ok ? colors.success : colors.danger,
                  flex: 1,
                  lineHeight: 20,
                }}
              >
                {msg.texto}
              </Text>
            </View>
          )}
        </View>
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
    marginBottom: 24,
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
    color: colors.muted,
    fontSize: 14,
    lineHeight: 21,
    marginTop: 6,
  },
  formulario: {
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
  input: {
    width: '100%',
    backgroundColor: colors.bg,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 22,
    color: colors.text,
  },
  opcoes: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  opcao: {
    flex: 1,
    minWidth: 0,
    minHeight: 104,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 6,
    borderRadius: 14,
    backgroundColor: colors.bg,
    borderWidth: 2,
    borderColor: colors.border,
  },
  opcaoTxt: {
    fontWeight: '700',
    fontSize: 14,
    color: colors.muted,
  },
  msg: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 12,
    borderRadius: 10,
    marginTop: 16,
  },
});
