
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ListaScreen from './src/screens/listaScreen';
import ConsultaScreen from './src/screens/consultaScreen';
import AtualizarScreen from './src/screens/atualizarScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();

const icones = {
  Listar: 'list',
  Consultar: 'search',
  Atualizar: 'create',
};

export default function App() {
  return (
    <View style={styles.pagina}>
      <View style={styles.aplicativo}>
        <StatusBar style="light" />

        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              headerStyle: {
                backgroundColor: colors.primary,
              },
              headerTintColor: '#fff',
              headerTitleStyle: {
                fontWeight: '700',
                fontSize: 18,
              },
              tabBarActiveTintColor: colors.primary,
              tabBarInactiveTintColor: colors.muted,
              tabBarLabelStyle: {
                fontSize: 11,
                fontWeight: '600',
              },
              tabBarIcon: ({ color, size }) => (
                <Ionicons
                  name={icones[route.name]}
                  size={22}
                  color={color}
                />
              ),
              tabBarStyle: styles.tabBar,
              tabBarItemStyle: {
                paddingVertical: 3,
              },
              sceneStyle: {
                backgroundColor: colors.bg,
              },
            })}
          >
            <Tab.Screen
              name="Listar"
              component={ListaScreen}
              options={{ title: 'Sensores' }}
            />
            <Tab.Screen
              name="Consultar"
              component={ConsultaScreen}
              options={{ title: 'Consultar sensor' }}
            />
            <Tab.Screen
              name="Atualizar"
              component={AtualizarScreen}
              options={{ title: 'Atualizar sensor' }}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  pagina: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#e5e7eb',
  },
  aplicativo: {
    flex: 1,
    width: '100%',
    maxWidth: 430,
    overflow: 'hidden',
    backgroundColor: colors.bg,
  },
  tabBar: {
    height: 62,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: colors.card,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
});
