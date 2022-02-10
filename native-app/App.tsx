import 'react-native-url-polyfill/auto'

import { useEffect, useState } from 'react'
import {
  Image,
  StyleSheet,
  Text,
  FlatList,
  View,
  useWindowDimensions,
  ActivityIndicator,
  StatusBar,
  Button,
  TouchableOpacity,
} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { NavigationContainer, useNavigation } from '@react-navigation/native'
import { Star, Info, X } from 'react-native-feather'
import { createClient } from '@supabase/supabase-js'
import { formatInTimeZone } from 'date-fns-tz'
import { startOfDay, endOfDay } from 'date-fns/esm'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import DateTimePicker from '@react-native-community/datetimepicker'
import {
  addWeeks,
  endOfWeek,
  formatRelative,
  startOfMonth,
  subMonths,
} from 'date-fns'

import MovieScreen from './Movie'
import AboutScreen from './About'

const PROJECT_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6aGJla2hvbnN1aGFwdG14Y2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ0MjgzMzcsImV4cCI6MTk2MDAwNDMzN30.8ZNeKaJZsPvHs9UFYPT4AM2CB4LHyZIHh5pSPuuvXks'
const PROJECT_URL = 'https://yzhbekhonsuhaptmxckk.supabase.co'

const client = createClient(PROJECT_URL, PROJECT_KEY, {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false,
})

const Stack = createNativeStackNavigator()

const now = new Date()

function HomeScreen() {
  const navigation = useNavigation()

  const [selectedDate, setSelectedDate] = useState(startOfDay(now))
  const [{ data, error, loading }, setState] = useState<any>({
    data: null,
    error: null,
    loading: true,
  })

  const { width } = useWindowDimensions()

  useEffect(() => {
    function onChange(_value: any, selectedDate: any) {
      setSelectedDate(startOfDay(selectedDate))
    }

    navigation.setOptions({
      title: formatRelative(selectedDate, now),
      headerLeft() {
        return (
          <TouchableOpacity onPress={() => navigation.navigate('AboutScreen')}>
            <Info width={30} height={30} />
          </TouchableOpacity>
        )
      },
      headerRight() {
        return (
          <View style={{ width: 100 }}>
            <DateTimePicker
              textColor="black"
              themeVariant="light"
              // dateFormat="dayofweek"
              minimumDate={startOfMonth(subMonths(now, 1))}
              maximumDate={endOfWeek(addWeeks(now, 1))}
              value={selectedDate}
              mode="date"
              display="compact"
              onChange={onChange}
            />
          </View>
        )
      },
    })
  }, [selectedDate])

  useEffect(() => {
    async function fetchData() {
      setState({ error: null, data: null, loading: true })

      try {
        const { data, error } = await client
          .from('presentations')
          .select(
            `
          id,
          date,
          room,
          movie (
            id,
            title,
            posterUrl,
            duration,
            tmdbRating,
            year,
            classification
          )
        `,
          )
          .gte('date', selectedDate.toISOString())
          .lte('date', endOfDay(selectedDate).toISOString())

        if (error) {
          console.log(error)
          throw new Error('Could not get presentations')
        }

        setState({ data, loading: false, error })
      } catch (error) {
        console.log(error)
        setState((prev) => ({ ...prev, loading: false, error }))
      }
    }

    fetchData()
  }, [selectedDate])

  function renderItem({ item: presentation }) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MovieScreen', {
            id: presentation.movie.id,
            title: presentation.movie.title,
            posterUrl: presentation.movie.posterUrl,
          })
        }
        style={{ width: width / 2, padding: 10, paddingBottom: 20 }}
      >
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          <Image
            style={{
              width: '100%',
              height: width * 0.67,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#ddd',
            }}
            // resizeMode="cover"
            source={{ uri: presentation.movie.posterUrl }}
          />
        </View>
        <Text
          style={{
            marginTop: 8,
            color: 'black',
            width: '100%',
            fontWeight: '700',
            fontSize: 18,
            textAlign: 'center',
          }}
        >
          {presentation.movie.title ?? 'No title'}
        </Text>
        <Text
          style={{
            color: '#666',
            textAlign: 'center',
            fontSize: 13,
            marginTop: 2.5,
          }}
        >
          {presentation.movie.year} · {presentation.movie.duration} min ·{' '}
          {presentation.movie.classification}
        </Text>
        <View
          style={{
            marginTop: 2.5,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            marginBottom: 10,
          }}
        >
          <View style={{ display: 'flex', flexDirection: 'row' }}>
            {new Array(Math.round(presentation.movie.tmdbRating / 2))
              .fill(null)
              .map(() => (
                <Star width={12.5} height={12.5} stroke="none" fill="gold" />
              ))}
          </View>
        </View>
        <View
          style={{
            marginTop: 4,
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          <Text style={{ color: 'black', fontWeight: '700' }}>
            Sala {presentation.room}
          </Text>
          <Text style={{ color: 'black' }}>
            {formatInTimeZone(
              presentation.date,
              'America/Mexico_City',
              'h:mm aaa',
            )}
          </Text>
        </View>
      </TouchableOpacity>
    )
  }

  if (!data) {
    if (loading) {
      return (
        <View
          style={[
            styles.container,
            { justifyContent: 'center', alignItems: 'center' },
          ]}
        >
          <ActivityIndicator size="large" />
          <Text style={{ color: 'black', marginTop: 4, fontWeight: '800' }}>
            Obteniendo cartelera
          </Text>
        </View>
      )
    }
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center' },
        ]}
      >
        <Text style={{ color: 'black', marginTop: 4, fontWeight: '800' }}>
          Error
          {JSON.stringify(error)}
        </Text>
      </View>
    )
  }

  if (data.length === 0) {
    return (
      <View
        style={[
          styles.container,
          { justifyContent: 'center', alignItems: 'center', padding: 10 },
        ]}
      >
        <Text
          style={{
            color: 'black',
            marginTop: 4,
            fontWeight: '800',
            textAlign: 'center',
          }}
        >
          {
            "We haven't found presentations for this day , you may want to check later"
          }
        </Text>
        <Button title="Notify Me" onPress={() => undefined} />
      </View>
    )
  }

  return (
    <>
      <FlatList
        numColumns={2}
        data={data}
        renderItem={renderItem}
        contentInsetAdjustmentBehavior="automatic"
        style={styles.container}
      />
    </>
  )
}

export default function Navigation() {
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{
              headerTintColor: 'black',
              title: 'home',
              headerTitle: 'Home',
            }}
            name="HomeScreen"
            component={HomeScreen}
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
              title: 'About',
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
      </NavigationContainer>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f3f3',
  },
})
