export async function MobifoneStream(question: any) {
  const url = process.env.MOBIFONE_CHATBOT_URL as string

  const data = {
    userid: '4',
    botname: '40',
    message: question,
    request_id: '',
  }

  const stream = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.body)
    .then((rb) => {
      const reader = (
        rb as any
      ).getReader() as ReadableStreamDefaultReader<Uint8Array>

      return new ReadableStream({
        start(controller) {
          function push() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close()
                return
              }

              controller.enqueue(value)
              push()
            })
          }

          push()
        },
      })
    })
    .catch((error) => {
      console.log('error', error)
      throw new Error('Stream error')
    })

  return stream
}
