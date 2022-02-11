import { useEffect, useState } from 'react'
import {
  ScrollView,
  Text,
  ImageBackground,
  View,
  StatusBar,
} from 'react-native'
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
              backgroundColor: 'rgba(0,0,0,0.3)',
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
              padding: 10,
            }}
          >
            {data?.title}
          </Text>
        </ImageBackground>
        <View style={{ padding: 10 }}>
          <Text style={{ color: 'black' }}>
            <Text style={{ fontWeight: '800' }}>Dirección</Text>{' '}
            {data?.director?.name}
          </Text>
          <Text style={{ color: 'black' }}>
            <Text style={{ fontWeight: '800' }}>Duración</Text> {data?.duration}{' '}
            min
          </Text>
          <Text>Clasificación</Text>
          <View
            style={{
              backgroundColor: 'black',
              borderRadius: 4,
              paddingHorizontal: 5,
              paddingVertical: 2.5,
              display: 'flex',
              maxWidth: 40,
            }}
          >
            <Text
              style={{
                color: 'white',
                fontWeight: '700',
                fontSize: 12,
                textAlign: 'center',
              }}
            >
              {data?.classification}
            </Text>
          </View>
          {/* <Text style={{ color: 'black' }}>{data?.tmdbRating}</Text> */}
        </View>

        {data?.description ? (
          <>
            <Text
              style={{
                fontWeight: '700',
                color: 'black',
                padding: 10,
                fontSize: 18,
              }}
            >
              Description
            </Text>
            <Text style={{ color: 'black', paddingHorizontal: 10 }}>
              {data.description}
            </Text>
          </>
        ) : null}

        {data?.trailerUrl ? (
          <>
            <Text
              style={{
                fontWeight: '700',
                color: 'black',
                padding: 10,
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
          </>
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

export default MovieScreen
function setState(arg0: { error: null; data: null; loading: boolean }) {
  throw new Error('Function not implemented.')
}
