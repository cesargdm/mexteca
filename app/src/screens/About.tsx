import { View, Text, TouchableOpacity, StatusBar, Linking } from 'react-native'
import { Github, Coffee } from 'react-native-feather'

function AboutScreen() {
  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: 'white' }}>
      <StatusBar animated barStyle="light-content" />
      <Text
        style={{
          fontWeight: '600',
          opacity: 0.8,
          textAlign: 'center',
          marginBottom: 30,
          marginTop: 10,
          fontSize: 16,
        }}
      >
        App no oficial de las Cinetecas de México
      </Text>
      <View style={{ alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderRadius: 10,
            borderColor: '#ddd',
            backgroundColor: '#f6f6f6',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            flexDirection: 'row',
            padding: 5,
            maxWidth: 250,
            marginBottom: 10,
            width: '100%',
          }}
          onPress={() => Linking.openURL('https://github.com/cesargdm/mexteca')}
        >
          <Text style={{ fontWeight: '700', marginRight: 5 }}>Github</Text>
          <Github fill="black" stroke={0} />
        </TouchableOpacity>
      </View>
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: '700', fontSize: 18 }}>Aviso</Text>
        <Text>
          No nos hacemos responsables por cambios en los horarios, funciones,
          disponibilidad o cualquier cambio de la información aquí presentada.
        </Text>
      </View>
      <View style={{ marginVertical: 10 }}>
        <Text style={{ fontWeight: '700', fontSize: 18 }}>Créditos</Text>
        <Text>- Cineteca Mexiquense</Text>
        <Text>- The Movie Database</Text>
      </View>
    </View>
  )
}

export default AboutScreen
