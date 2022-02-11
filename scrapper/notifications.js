/* eslint-disable @typescript-eslint/no-var-requires */
const { Expo } = require('expo-server-sdk')

const { EXPO_ACCESS_TOKEN } = process.env

const expo = new Expo({ accessToken: EXPO_ACCESS_TOKEN })

function sendNotifications({ client, insertedCount }) {
  let { data: tokens } = await client
    .from('notificationSettings')
    .select('token')
    .eq('all', true)
  tokens = tokens?.map(({ token }) => token)

  const messages = []
  for (const token of tokens) {
    // Each push token looks like ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxx]

    // Check that all your push tokens appear to be valid Expo push tokens
    if (!Expo.isExpoPushToken(token)) {
      // eslint-disable-next-line no-console
      console.error(`Push token ${token} is not a valid Expo push token`)
      continue
    }

    messages.push({
      to: token,
      sound: 'default',
      body: `Hay ${insertedCount} nuevas presentaciones disponibles!`,
    })
  }

  // The Expo push notification service accepts batches of notifications so
  // that you don't need to send 1000 requests to send 1000 notifications. We
  // recommend you batch your notifications to reduce the number of requests
  // and to compress them (notifications with similar content will get
  // compressed).
  const chunks = expo.chunkPushNotifications(messages)
  const tickets = []
  ;(async () => {
    // Send the chunks to the Expo push notification service. There are
    // different strategies you could use. A simple one is to send one chunk at a
    // time, which nicely spreads the load out over time:
    for (const chunk of chunks) {
      try {
        const ticketChunk = await expo.sendPushNotificationsAsync(chunk)
        // eslint-disable-next-line no-console
        console.log(ticketChunk)
        tickets.push(...ticketChunk)
        // NOTE: If a ticket contains an error code in ticket.details.error, you
        // must handle it appropriately. The error codes are listed in the Expo
        // documentation:
        // https://docs.expo.io/push-notifications/sending-notifications/#individual-errors
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
      }
    }
  })()
}

module.exports = { sendNotifications }
