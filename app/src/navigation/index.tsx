import { TouchableOpacity } from 'react-native'
import { Info, X } from 'react-native-feather'

import { createNativeStackNavigator } from '@react-navigation/native-stack'

const Stack = createNativeStackNavigator()

import ListingsScreen from '../screens/Listings'
import MovieScreen from '../screens/Movie'
import AboutScreen from '../screens/About'
import LocationsScreen from '../screens/Locations'

function Navigator() {
  return (
    <Stack.Navigator initialRouteName="LocationsScreen">
      <Stack.Screen
        options={({ navigation }) => ({
          headerTintColor: 'black',
          title: 'Cinetecas',
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate('AboutScreen')}
            >
              <Info width={30} height={30} />
            </TouchableOpacity>
          ),
        })}
        name="LocationsScreen"
        component={LocationsScreen}
      />
      <Stack.Screen
        options={{
          headerTintColor: 'black',
          title: 'Hoy',
          headerBackTitleVisible: false,
        }}
        name="ListingsScreen"
        component={ListingsScreen}
      />
      <Stack.Screen
        options={{
          headerTransparent: true,
          headerTintColor: 'white',
          title: '',
          headerBackTitle: '',
          headerBackTitleVisible: false,
        }}
        name="MovieScreen"
        component={MovieScreen}
      />
      <Stack.Screen
        options={({ navigation }) => ({
          title: 'Mexteca',
          presentation: 'modal',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <X color="black" height={30} width={30} />
            </TouchableOpacity>
          ),
        })}
        name="AboutScreen"
        component={AboutScreen}
      />
    </Stack.Navigator>
  )
}

export default Navigator
