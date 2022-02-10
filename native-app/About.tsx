import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import { Github } from 'react-native-feather'

function AboutScreen() {
  return (
    <View>
      <StatusBar animated barStyle="light-content" />
      <Text>About</Text>
      <TouchableOpacity onPress={() => undefined}>
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
