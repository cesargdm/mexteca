import 'react-native-url-polyfill/auto'
import { StatusBar } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { Provider } from 'react-supabase'

import { client } from './src/utils/supabase'
import Navigator from './src/navigation'

export default function Navigation() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <Provider value={client}>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </Provider>
    </>
  )
}
