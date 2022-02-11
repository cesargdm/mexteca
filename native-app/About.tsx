import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { Github } from 'react-native-feather'

function AboutScreen() {
  return (
    <View>
      <StatusBar animated barStyle="light-content" />
      <Text style={{ fontWeight: '600', fontSize: 24 }}>Cinemexteca</Text>
      <Text style={{ fontWeight: '700' }}>
        App no oficial de la Cineteca del Estado de México
      </Text>
      <TouchableOpacity
        style={{ borderWidth: 2, borderRadius: 10, borderColor: '#ccc' }}
        onPress={() => undefined}
      >
        <Text>
          Github
          <Github />
        </Text>
      </TouchableOpacity>
      <Text>Credits</Text>
      <Text>The Movie Database</Text>
    </View>
  )
}

export default AboutScreen
