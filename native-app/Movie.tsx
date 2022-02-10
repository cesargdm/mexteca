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
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'
import { useRoute } from '@react-navigation/native'

const PROJECT_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6aGJla2hvbnN1aGFwdG14Y2trIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQ0MjgzMzcsImV4cCI6MTk2MDAwNDMzN30.8ZNeKaJZsPvHs9UFYPT4AM2CB4LHyZIHh5pSPuuvXks'
const PROJECT_URL = 'https://yzhbekhonsuhaptmxckk.supabase.co'

const client = createClient(PROJECT_URL, PROJECT_KEY, {
  localStorage: AsyncStorage as any,
  detectSessionInUrl: false,
})

function MovieScreen() {
  const route = useRoute()

  const [{ data, error, loading }, setState] = useState<any>({
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
        console.log('PARAMS', route.params)
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
          .eq('id', (route.params as any)?.id)
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
              backgroundColor: 'black',
              paddingTop: 50,
              opacity: '0.5',
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
          <Text style={{ color: 'black' }}>{data?.director?.name}</Text>
          <Text style={{ color: 'black' }}>{data?.duration}</Text>
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
          <Text style={{ color: 'black' }}>{data?.tmdbRating}</Text>
        </View>
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
        <Text style={{ color: 'black' }}>{data?.description}</Text>

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
        <Text
          style={{
            fontWeight: '700',
            color: 'black',
            padding: 10,
            fontSize: 18,
          }}
        >
          Presentations
        </Text>
        {/* Calendar */}
      </SafeAreaView>
    </ScrollView>
  )
}

export default MovieScreen
function setState(arg0: { error: null; data: null; loading: boolean }) {
  throw new Error('Function not implemented.')
}
