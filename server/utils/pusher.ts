import Pusher from 'pusher'

const config = useRuntimeConfig()

export const pusher = new Pusher({
  appId: config.pusherAppId,
  key: config.public.pusherKey,
  secret: config.pusherSecret,
  cluster: config.public.pusherCluster,
  useTLS: true,
})
