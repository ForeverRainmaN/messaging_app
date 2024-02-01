import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { useEffect } from "react"

export function usePusherClient<T>(
  sessionId: string,
  eventName: string,
  handler: (...args: T[]) => void
) {
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(`user:${sessionId}:${eventName}`))

    pusherClient.bind(eventName, handler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(`user:${sessionId}:${eventName}`))

      pusherClient.unbind(eventName, handler)
    }
  }, [sessionId, eventName, handler])
}
