import { useCallback, useEffect, useState } from 'react'
import {
  Text,
  View,
  FlatList,
  StyleSheet,
  RefreshControl,
  ImageBackground,
  TouchableOpacity,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native'
import { Star, ChevronLeft, ChevronRight } from 'react-native-feather'
import { formatInTimeZone } from 'date-fns-tz'
import { startOfDay, endOfDay } from 'date-fns/esm'
import { es } from 'date-fns/esm/locale'

import * as Notifications from 'expo-notifications'
import { Bell } from 'react-native-feather'
import { addDays, formatRelative } from 'date-fns'

import { registerForPushNotificationsAsync } from '../utils'
import { client } from '../utils/supabase'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
})

const locale = es
const now = startOfDay(new Date())

function Listing() {
  const navigation = useNavigation<any>()
  const route = useRoute()
  const [permissionStatus] = Notifications.usePermissions()

  function registerForPushNotifications() {
    registerForPushNotificationsAsync().then((token) => {
      if (!token) return
      client
        .from('notificationSettings')
        .insert({ token, all: true })
        .then(({ data }) => {
          if (data)
            alert('Te avisaremos cuando se publiquen una nuevas funciones')
          else alert('Hubo un problema al registrarte')
        })
    })
  }

  const [selectedDate, setSelectedDate] = useState(now)
  const [{ data, error, loading }, setState] = useState<any>({
    data: null,
    error: null,
    loading: true,
  })

  let { width } = useWindowDimensions()
  const maxWidth = Math.min(width, 800)
  const numberOfColumns = Math.round(maxWidth / 200)
  const posterWidth = maxWidth / numberOfColumns

  useEffect(() => {
    let headerTitle = formatRelative(selectedDate, now, {
      locale,
    })
      .replace(/a las*/i, '')
      .replace(/\d+:\d\d$/i, '')
      .replace(/^el/i, '')
      .trim()
    // capitalize header title
    headerTitle = headerTitle.charAt(0).toUpperCase() + headerTitle.slice(1)

    navigation.setOptions({
      headerTitle: () => (
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => setSelectedDate(addDays(selectedDate, -1))}
          >
            <ChevronLeft strokeWidth={4} width={20} height={20} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setSelectedDate(now)}>
            <Text
              style={{
                fontSize: 17,
                fontWeight: '600',
                marginHorizontal: 5,
                width: 140,
                textAlign: 'center',
              }}
            >
              {headerTitle}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{ padding: 5 }}
            onPress={() => setSelectedDate(addDays(selectedDate, 1))}
          >
            <ChevronRight strokeWidth={4} width={20} height={20} />
          </TouchableOpacity>
        </View>
      ),
    })
  }, [navigation, route, selectedDate])

  const fetchData = useCallback(async () => {
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
        .order('date', { ascending: true })
        .gte('date', selectedDate.toISOString())
        .lte('date', endOfDay(selectedDate).toISOString())

      if (error) {
        console.log(error)
        throw new Error('Could not get presentations')
      }

      setState({ data, loading: false, error })
    } catch (error) {
      console.log(error)
      setState((prev: any) => ({ ...prev, loading: false, error }))
    }
  }, [selectedDate])

  useEffect(() => {
    fetchData()
  }, [selectedDate])

  function renderItem({ item: presentation }: any) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('MovieScreen', {
            id: presentation.movie.id,
            title: presentation.movie.title,
            posterUrl: presentation.movie.posterUrl,
          })
        }
        style={{ width: posterWidth, padding: 10, paddingBottom: 20 }}
      >
        <View
          style={{
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
          }}
        >
          <ImageBackground
            style={{
              width: '100%',
              height: posterWidth * 1.48,
              borderRadius: 5,
              borderWidth: 1,
              borderColor: '#ddd',
              overflow: 'hidden',
            }}
            resizeMode="cover"
            source={{ uri: presentation.movie.posterUrl }}
          >
            <View
              style={{
                padding: 5,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text
                style={{
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  fontWeight: '800',
                  fontSize: 10,
                  borderRadius: 4,
                  overflow: 'hidden',
                  color: 'white',
                  padding: 2,
                  paddingHorizontal: 5,
                }}
              >
                Sala {presentation.room}
              </Text>
              <Text
                style={{
                  fontWeight: '700',
                  fontSize: 12,
                  color: 'white',
                }}
              >
                {formatInTimeZone(
                  presentation.date,
                  'America/Mexico_City',
                  'h:mm aaa',
                )}
              </Text>
            </View>
          </ImageBackground>
        </View>

        <Text
          style={{
            marginTop: 5,
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
              .map((_, index) => (
                <Star
                  key={index}
                  width={12.5}
                  height={12.5}
                  stroke="none"
                  fill="gold"
                />
              ))}
          </View>
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
          { justifyContent: 'center', alignItems: 'center', padding: 20 },
        ]}
      >
        <Text
          style={{
            color: 'black',
            textAlign: 'center',
            fontSize: 20,
            fontWeight: '700',
            opacity: 0.9,
          }}
        >
          No hemos encontrado funciones para este día, intenta revisar después
        </Text>
        {!permissionStatus?.granted ? (
          <TouchableOpacity onPress={() => registerForPushNotifications()}>
            <Text style={{ marginTop: 30, opacity: 0.6, fontWeight: '600' }}>
              Si quieres también podemos avisarte
            </Text>
            <View
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
              }}
            >
              <Bell width={15} height={15} stroke="black" fill="black" />
              <Text
                style={{
                  alignItems: 'center',
                  fontWeight: '800',
                  color: 'black',
                  marginLeft: 5,
                }}
              >
                recibir notificaciones
              </Text>
            </View>
          </TouchableOpacity>
        ) : null}
      </View>
    )
  }

  return (
    <FlatList
      refreshControl={
        <RefreshControl onRefresh={() => fetchData()} refreshing={false} />
      }
      key={numberOfColumns}
      numColumns={numberOfColumns}
      data={data}
      renderItem={renderItem}
      columnWrapperStyle={{
        maxWidth: 800,
        margin: 0,
        marginHorizontal: 'auto',
      }}
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
})

export default Listing
