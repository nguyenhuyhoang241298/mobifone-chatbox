'use client'

import { useEnsureRegeneratorRuntime } from '@/app/hooks/useEnsureRegeneratorRuntime'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'
import { welcomeMessage } from '@/lib/strings'
import { useChat } from 'ai/react'
import { useEffect, useRef } from 'react'
import Bubble from './chat/bubble'
import SendForm from './chat/send-form'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat()

  useEnsureRegeneratorRuntime()

  const scrollAreaRef = useRef<null | HTMLDivElement>(null)

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      })
    }
  }, [messages])

  return (
    <Card className="w-[440px]">
      <CardHeader>
        <div className="flex flex-row items-start justify-between max-w-[100%]">
          <CardTitle className="text-lg">Chatbot</CardTitle>
        </div>
        <CardDescription className=" leading-3">
          Trợ lý ảo Mobifone
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea
          ref={scrollAreaRef}
          className="h-[450px] overflow-y-auto w-full spacy-y-4 pr-4"
        >
          <Bubble
            message={{
              role: 'assistant',
              content: welcomeMessage,
              id: 'initialai',
            }}
          />
          {messages.map((message) => (
            <Bubble key={message.id} message={message} />
          ))}
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <SendForm
          input={input}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          handleInputChange={handleInputChange}
        />
      </CardFooter>
    </Card>
  )
}
