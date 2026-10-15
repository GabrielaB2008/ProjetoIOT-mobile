import { useCallback, useMemo, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, RefreshControl, Pressable, ScrollView, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { listarSensores } from '../services/api';
import StatusBadge from '../components/StatusBadge';
import { colors, tipoIcone, shadow } from '../theme';

export default function ListaScreen({ navigation }) {
  const [sensores, setSensores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState('todos');

  const carregar = async () => {
    try {
      setErro(null);
      setSensores(await listarSensores());
    } catch (e) {
      setErro(e.message);
    }
  };

  useFocusEffect(
    useCallback(() => {
      carregar().finally(() => setLoading(false));
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await carregar();
    setRefreshing(false);
  };

  const tipos = useMemo(() => ['todos', ...new Set(sensores.map((s) => s.tipo))], [sensores]);
  const filtrados = filtro === 'todos' ? sensores : sensores.filter((s) => s.tipo === filtro);
  const ativos = sensores.filter((s) => Number(s.status) === 1).length;

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color={colors.primary} />;

  const Resumo = ({ valor, rotulo, cor }) => (
    <View style={[styles.resumo, shadow]}>
      <Text style={[styles.resumoValor, { color: cor }]}>{valor}</Text>
      <Text style={styles.resumoRotulo}>{rotulo}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.codigo}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 24,
}}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />}
        ListHeaderComponent={
          <>
            <View style={styles.resumoLinha}>
              <Resumo valor={sensores.length} rotulo="Total" cor={colors.primary} />
              <Resumo valor={ativos} rotulo="Ativos" cor={colors.success} />
              <Resumo valor={sensores.length - ativos} rotulo="Inativos" cor={colors.danger} />
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
              {tipos.map((t) => (
                <Pressable key={t} onPress={() => setFiltro(t)} style={[styles.chip, filtro === t && styles.chipAtivo]}>
                  <Text style={[styles.chipTxt, filtro === t && { color: '#fff' }]}>{t}</Text>
                </Pressable>
              ))}
            </ScrollView>

            {erro && (
              <View style={styles.erroBox}>
                <Ionicons name="alert-circle" size={18} color={colors.danger} />
                <Text style={styles.erroTxt}>{erro}</Text>
              </View>
            )}
          </>
        }
        ListEmptyComponent={!erro && <Text style={styles.vazio}>Nenhum sensor encontrado.</Text>}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => navigation.navigate('Atualizar', { codigo: item.codigo })}
            style={({ pressed }) => [styles.card, shadow, pressed && { opacity: 0.8 }]}
          >
            <View style={styles.icone}>
              <Ionicons name={tipoIcone[item.tipo] || 'hardware-chip-outline'} size={24} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.codigo}>{item.codigo}</Text>
              <Text style={styles.tipo}>{item.tipo}</Text>
            </View>
            <StatusBadge status={item.status} />
          </Pressable>
        )}
      />
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  
resumoLinha: {
  flexDirection: 'row',
  gap: 8,
  marginBottom: 16,
},
resumo: {
  flex: 1,
  minWidth: 0,
  backgroundColor: colors.card,
  borderRadius: 14,
  paddingVertical: 14,
  paddingHorizontal: 4,
  alignItems: 'center',
  justifyContent: 'center',
},
resumoValor: {
  fontSize: 22,
  fontWeight: '800',
},
resumoRotulo: {
  color: colors.muted,
  fontSize: 12,
  marginTop: 3,
},

  chip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: colors.card,
    marginRight: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipAtivo: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipTxt: {
    color: colors.text,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 12,
    borderRadius: 14,
    marginBottom: 10,
    gap: 10,
  },
  icone: {
    width: 42,
    height: 42,
    flexShrink: 0,
    borderRadius: 14,
    backgroundColor: '#eef2ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  codigo: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  tipo: {
    color: colors.muted,
    textTransform: 'capitalize',
    marginTop: 3,
    fontSize: 13,
  },
  erroBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: colors.dangerBg,
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  erroTxt: {
    color: colors.danger,
    flex: 1,
    lineHeight: 20,
  },
  vazio: {
    textAlign: 'center',
    marginTop: 32,
    color: colors.muted,
  },
});

