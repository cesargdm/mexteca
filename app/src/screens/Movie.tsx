import { useEffect, useState } from 'react'
import {
  ScrollView,
  Text,
  ImageBackground,
  View,
  StatusBar,
  StyleSheet,
} from 'react-native'
import { Clock, UserCheck, Star, Film } from 'react-native-feather'
import { SafeAreaView } from 'react-native-safe-area-context'
import { WebView } from 'react-native-webview'
import { useRoute } from '@react-navigation/native'

import { client } from '../utils/supabase'

function MovieScreen() {
  const route = useRoute()
  const movieId = (route.params as any)?.id
  const [{ data }, setState] = useState<any>({
    data: {
      title: (route.params as any)?.title,
      posterUrl: (route.params as any)?.posterUrl,
    },
    error: null,
    loading: true,
  })

  useEffect(() => {
    async function fetchData() {
      setState({ error: null, data: null, loading: true })

      try {
        const { data, error } = await client
          .from('movies')
          .select(
            `
            id,
            title,
            posterUrl,
            duration,
            tmdbRating,
            year,
            classification,
            description,
            trailerUrl,
            director (
                name
            )
            `,
          )
          .eq('id', movieId)
          .single()

        if (error) {
          console.log(error)
          throw new Error('Could not get presentations')
        }

        setState({ data, loading: false, error })
      } catch (error) {
        console.log(error)
        setState((prev: any) => ({ ...prev, loading: false, error }))
      }
    }

    fetchData()
  }, [])

  return (
    <ScrollView automaticallyAdjustContentInsets>
      <StatusBar barStyle="light-content" />
      <SafeAreaView edges={['bottom', 'left', 'right']}>
        <ImageBackground
          style={{ width: '100%', height: 250, position: 'relative' }}
          source={{ uri: data?.posterUrl, cache: 'force-cache' }}
        >
          <View
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.4)',
              paddingTop: 50,
            }}
          />
          <Text
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              color: 'white',
              fontSize: 35,
              fontWeight: '600',
              padding: 20,
            }}
          >
            {data?.title}
          </Text>
        </ImageBackground>
        <View style={styles.characteristicContainer}>
          {data?.director?.name && (
            <View style={styles.characteristic}>
              <Film color="black" style={styles.characteristicIcon} />
              <Text
                style={{
                  fontWeight: '700',
                  maxWidth: 80,
                  textAlign: 'center',
                }}
              >
                {data.director.name}
              </Text>
            </View>
          )}
          <View style={styles.characteristic}>
            <Clock color="black" style={styles.characteristicIcon} />
            <Text
              style={{ color: 'black', textAlign: 'center', fontWeight: '700' }}
            >
              {data?.duration} min
            </Text>
          </View>
          <View style={styles.characteristic}>
            <UserCheck color="black" style={styles.characteristicIcon} />
            <Text style={styles.classificationText}>
              {data?.classification}
            </Text>
          </View>
          {data?.tmdbRating ? (
            <View style={styles.characteristic}>
              <Star color="black" style={styles.characteristicIcon} />
              <Text style={{ fontWeight: '700' }}>{data?.tmdbRating}</Text>
            </View>
          ) : null}
        </View>

        {data?.description ? (
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontWeight: '700',
                color: 'black',
                paddingVertical: 10,
                fontSize: 18,
              }}
            >
              Description
            </Text>
            <Text style={{ color: 'black' }}>{data.description}</Text>
          </View>
        ) : null}

        {data?.trailerUrl ? (
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontWeight: '700',
                color: 'black',
                paddingVertical: 10,
                fontSize: 18,
              }}
            >
              Trailer
            </Text>
            <WebView
              style={{ flex: 1, width: '100%', height: 200 }}
              javaScriptEnabled={true}
              source={{ uri: data.trailerUrl }}
            />
          </View>
        ) : null}
        {/* <View style={{ marginTop: 10 }}>
          <Text
            style={{
              fontWeight: '700',
              color: 'black',
              padding: 10,
              fontSize: 18,
            }}
          >
            Presentaciones
          </Text>
          <Text style={{ color: 'red' }}>{JSON.stringify(all, null, 10)}</Text>
          <View>
            <View
              style={{
                borderTopWidth: 1,
                borderColor: '#ddd',
                padding: 10,
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              <Text>Jueves 18, 10:00AM</Text>
              <Text>Sala 1</Text>
            </View>
          </View>
        </View> */}
      </SafeAreaView>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  characteristicContainer: {
    padding: 20,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignContent: 'flex-start',
    alignItems: 'flex-start',
  },
  characteristicIcon: { marginBottom: 5 },
  characteristic: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  classificationText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 12,
    textAlign: 'center',
    backgroundColor: 'black',
    padding: 1,
    paddingHorizontal: 10,
    borderRadius: 6,
    overflow: 'hidden',
  },
})

export default MovieScreen
