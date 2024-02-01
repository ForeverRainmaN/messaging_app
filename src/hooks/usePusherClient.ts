import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { useEffect } from "react"

type FirstKeyPart = "user" | "chat"
type Id = string

type UserEvent = "incoming_friend_requests" | "friends"
type ChatEvent = "message"

type RedisUrl<T extends FirstKeyPart> = `${T}:${Id}:${T extends "user"
  ? UserEvent
  : ChatEvent}`

export function usePusherClient<T extends FirstKeyPart>(
  url: RedisUrl<T>,
  handler: (...args: any[]) => void
) {
  useEffect(() => {
    // last part of url after :
    const eventName = url.split(":").slice(-1)[0]
    pusherClient.subscribe(toPusherKey(url))

    pusherClient.bind(eventName, handler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(url))

      pusherClient.unbind(eventName, handler)
    }
  }, [url, handler])
}
