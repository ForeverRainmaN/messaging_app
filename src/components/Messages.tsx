"use client"

import { usePusherClient } from "@/hooks/usePusherClient"
import { cn } from "@/lib/utils"
import { Message } from "@/lib/validations/message"
import { format } from "date-fns"
import Image from "next/image"
import { FC, useCallback, useRef, useState } from "react"

interface MessagesProps {
  initialMessages: Message[]
  sessionId: string
  chatId: string
  sessionImg: string | null | undefined
  chatPartner: User
}

const Messages: FC<MessagesProps> = ({
  initialMessages,
  sessionId,
  chatId,
  chatPartner,
  sessionImg,
}) => {
  const scrollDownRef = useRef<HTMLDivElement | null>(null)
  const [messages, setMessages] = useState<Message[]>(initialMessages)

  const memoizedHandler = useCallback((message: Message) => {
    setMessages((prev) => [message, ...prev])
  }, [])

  usePusherClient(`chat:${chatId}`, "incoming_message", memoizedHandler)

  const formatTimestamp = (timestamp: number) => format(timestamp, "HH:mm a")
  return (
    <div
      id="messages"
      className="flex h-full flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbard-w-2 scrolling-touch">
      <div ref={scrollDownRef} />

      {messages.map((msg, i) => {
        const isCurrentUser = msg.senderId === sessionId

        const hasNextMessageFromSameUser =
          messages[i - 1]?.senderId === messages[i].senderId

        return (
          <div
            className="chat-message"
            key={`${msg.id} - ${msg.timestamp}`}>
            <div
              className={cn("flex items-end", {
                "justify-end": isCurrentUser,
              })}>
              <div
                className={cn(
                  "flex flex-col space-y-2 text-base max-w-xs mx-2",
                  {
                    "order-1 items-end": isCurrentUser,
                    "oreder-2 items-start": !isCurrentUser,
                  }
                )}>
                <span
                  className={cn("px-4 py-2 rounded-lg inline-block", {
                    "bg-indigo-600 text-white": isCurrentUser,
                    "bg-gray-200 text-gray-900": !isCurrentUser,
                    "rounded-br-none":
                      !hasNextMessageFromSameUser && isCurrentUser,
                    "rounded-bl-none":
                      !hasNextMessageFromSameUser && !isCurrentUser,
                  })}>
                  {msg.text}{" "}
                  <span className="ml-2 text-xs text-gray-400">
                    {formatTimestamp(msg.timestamp)}
                  </span>
                </span>
              </div>

              <div
                className={cn("relative w-6 h-6", {
                  "order-2": isCurrentUser,
                  "order-1": !isCurrentUser,
                  invisible: hasNextMessageFromSameUser,
                })}>
                <Image
                  fill
                  src={
                    isCurrentUser ? (sessionImg as string) : chatPartner.image
                  }
                  alt="Profile picture"
                  referrerPolicy="no-referrer"
                  className="rounded-full"
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default Messages
