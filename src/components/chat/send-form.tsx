import { useEnsureRegeneratorRuntime } from '@/app/hooks/useEnsureRegeneratorRuntime'
import { Textarea } from '@/components/ui/textarea'
import { useEffect, useRef, useState } from 'react'
import { Grid } from 'react-loader-spinner'
import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { Button } from '../ui/button'
import { toast } from '../ui/use-toast'

interface SendForm {
  input: string
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  isLoading: boolean
  handleInputChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export default function SendForm({
  input,
  handleSubmit,
  isLoading,
  handleInputChange,
}: SendForm) {
  useEnsureRegeneratorRuntime()

  const [textareaHeight, setTextareaHeight] = useState('h-10')

  const textareaRef = useRef(null)

  const {
    listening,
    browserSupportsSpeechRecognition,
    resetTranscript,
    transcript,
  } = useSpeechRecognition()

  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      toast({
        description: 'Your browser does not support speech recognition',
      })
    }
  }, [browserSupportsSpeechRecognition])

  useEffect(() => {
    const textarea = document.querySelector('.mendable-textarea')
    if (textarea) {
      if (input === '') {
        resetTranscript()
        setTextareaHeight('h-10')
      } else {
        const shouldExpand =
          textarea.scrollHeight > textarea.clientHeight &&
          textareaHeight !== 'h-20'
        if (shouldExpand) {
          setTextareaHeight('h-20')
        }
      }

      if (listening) {
        textarea.scrollTop = textarea.scrollHeight
      }
    }
  }, [listening, input, textareaHeight])

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden' && listening) {
        SpeechRecognition.stopListening()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [listening])

  useEffect(() => {
    if (transcript) {
      updateInputWithTranscript(transcript)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transcript])

  const updateInputWithTranscript = (transcriptValue: string) => {
    const fakeEvent: any = {
      target: { value: transcriptValue },
    }
    handleInputChange(fakeEvent)
  }

  return (
    <form
      onSubmit={(event) => {
        handleSubmit(event)
      }}
      className="flex items-center justify-center w-full space-x-2"
    >
      <div className="relative w-full max-w-xs">
        <Textarea
          value={input}
          onChange={handleInputChange}
          className={`pr-8 resize-none mendable-textarea min-h-[20px] ${textareaHeight}`}
          placeholder="Hỏi điều gì đó..."
          ref={textareaRef}
        />
      </div>

      <Button className="h-10">
        {isLoading ? (
          <div className="flex gap-2 items-center">
            <Grid
              height={12}
              width={12}
              radius={5}
              ariaLabel="grid-loading"
              color="#fff"
              visible={true}
            />
            {'Loading...'}
          </div>
        ) : (
          <div className="flex flex-col w-16">Gửi</div>
        )}
      </Button>
    </form>
  )
}
