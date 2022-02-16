import {
  TouchableOpacity,
  View,
  ImageBackground,
  Text,
  FlatList,
} from 'react-native'
import { useNavigation } from '@react-navigation/native'

const LOCATIONS = [
  {
    title: 'Mexiquense',
    image: require('../assets/mexiquense.jpg'),
    address:
      'Boulevar, Jesús Reyes Heroles 302, San Buenaventura, 50110 Toluca, MEX',
  },
]

function LocationsScreen() {
  const navigation = useNavigation<any>()

  function handleRenderItem({ item }: { item: typeof LOCATIONS[0] }) {
    return (
      <View
        style={{
          padding: 20,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        <TouchableOpacity
          style={{ borderRadius: 15, overflow: 'hidden' }}
          onPress={() => navigation.navigate('ListingsScreen')}
        >
          <ImageBackground
            style={{ width: '100%', height: 150 }}
            resizeMode="cover"
            source={item.image}
          >
            <View
              style={{
                padding: 10,
                backgroundColor: 'rgba(0,0,0,0.4)',
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Text style={{ fontSize: 32, fontWeight: '800', color: 'white' }}>
                {item.title}
              </Text>
              <Text style={{ fontWeight: '800', fontSize: 12, color: 'white' }}>
                {item.address}
              </Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <FlatList
      style={{ flex: 1, backgroundColor: 'white' }}
      data={LOCATIONS}
      renderItem={handleRenderItem}
    />
  )
}

export default LocationsScreen
