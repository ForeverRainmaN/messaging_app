import { pusherClient } from "@/lib/pusher"
import { toPusherKey } from "@/lib/utils"
import { useEffect } from "react"

type UserEvent =
  | "incoming_friend_requests"
  | "friends"
  | "chats"
  | "new_friend"
  | "new_message"

type ChatEvent = "incoming_message"

type RedisUrlTypes =
  | `user:${string}:${UserEvent}`
  | `chat:${string}`
  | `chat:${string}:${ChatEvent}`

export function usePusherClient(
  url: RedisUrlTypes,
  eventToSubscribeTo: UserEvent | ChatEvent,
  handler: (...args: any[]) => void
) {
  useEffect(() => {
    pusherClient.subscribe(toPusherKey(url))

    pusherClient.bind(eventToSubscribeTo, handler)

    return () => {
      pusherClient.unsubscribe(toPusherKey(url))

      pusherClient.unbind(eventToSubscribeTo, handler)
    }
  }, [url, eventToSubscribeTo, handler])
}
