import Pusher from 'pusher-js'

export const usePusher = () => {
  const config = useRuntimeConfig()
  
  const pusher = new Pusher(config.public.pusherKey, {
    cluster: config.public.pusherCluster,
  })

  return {
    pusher
  }
}
