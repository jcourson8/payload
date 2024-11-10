import jwt from 'jsonwebtoken'
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

const payloadToken = 'payload-token'

export async function GET(
  req: Request & {
    cookies: {
      get: (name: string) => {
        value: string
      }
    }
  },
): Promise<Response> {
  const token = req.cookies.get(payloadToken)?.value
  const { searchParams } = new URL(req.url)
  const path = searchParams.get('path')

  if (!path) {
    return new Response('No path provided', { status: 404 })
  }

  if (!token) {
    return new Response('You are not allowed to preview this page', { status: 403 })
  }

  try {
    const user = jwt.verify(token, process.env.PAYLOAD_SECRET as string)
    const draft = await draftMode()

    if (!user) {
      draft.disable()
      return new Response('You are not allowed to preview this page', { status: 403 })
    }

    draft.enable()
    redirect(path)
  } catch (err) {
    const draft = await draftMode()
    draft.disable()
    return new Response('Invalid token', { status: 403 })
  }
}
