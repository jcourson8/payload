import { draftMode } from 'next/headers'

// eslint-disable-next-line @typescript-eslint/require-await
export async function GET(): Promise<Response> {
  const draft = await draftMode()
  draft.disable()
  return new Response('Draft mode is disabled')
}
