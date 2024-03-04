import { MobifoneStream } from '@/lib/mobifone-stream'
import { StreamingTextResponse } from 'ai'

export const runtime = 'edge'

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json()

  // question is on the last message
  const question = messages[messages.length - 1].content
  messages.pop()

  const stream = await MobifoneStream(question)

  return new StreamingTextResponse(stream)
}
