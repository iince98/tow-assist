import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url)
  const driver = searchParams.get('driver')

  console.log('--- CONNECT DRIVER ---')
  console.log('Driver phone:', driver)

  return new NextResponse(
    `<Response>
      <Gather
        numDigits="1"
        timeout="10"
        method="POST"
        action="https://www.getroadhelp.com/api/twilio/voice-record?driver=${encodeURIComponent(
          driver!
        )}"
      >
        <Say language="de-DE">
          Dieser Anruf kann zu Qualitätszwecken aufgezeichnet werden.
          Drücken Sie die 1, um der Aufzeichnung zuzustimmen.
          Andernfalls bleiben Sie bitte in der Leitung.
        </Say>
      </Gather>

      <Say language="de-DE">
        Wir verbinden Sie jetzt.
      </Say>

      <Redirect method="POST">
        https://www.getroadhelp.com/api/twilio/voice-record?driver=${encodeURIComponent(
          driver!
        )}
      </Redirect>
    </Response>`,
    { headers: { 'Content-Type': 'text/xml' } }
  )
}
