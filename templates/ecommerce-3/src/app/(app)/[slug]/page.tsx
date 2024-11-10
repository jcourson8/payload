import type { Metadata } from 'next'

import { Blocks } from '@/components/Blocks'
import { Hero } from '@/components/Hero'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import { draftMode, headers } from 'next/headers'
import React from 'react'

import type { Page } from '../../../payload-types'

export async function generateStaticParams() {
  const payload = await getPayloadHMR({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    limit: 1000,
    overrideAccess: false,
  })

  return pages.docs?.map(({ slug }) => slug)
}

export default async function Page({ params: { slug = 'home' } }) {
  const url = '/' + slug

  const page = await queryPageBySlug({
    slug,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <Hero {...hero} />
      <Blocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: { slug = 'home' } }): Promise<Metadata> {
  const page = await queryPageBySlug({
    slug,
  })

  // Return basic metadata if page is not found
  if (!page) {
    return {
      title: 'Page Not Found',
    }
  }

  return generateMeta({ doc: page })
}

const queryPageBySlug = async ({ slug }: { slug: string }) => {
  const draftModeData = await draftMode()
  const draft = draftModeData.isEnabled

  const payload = await getPayloadHMR({ config: configPromise })
  const headersData = await headers()

  // Convert Next.js headers to standard Headers object
  const headersList = new Headers()
  for (const [key, value] of headersData.entries()) {
    headersList.set(key, value)
  }

  const authResult = draft ? await payload.auth({ headers: headersList }) : undefined

  const user = authResult?.user

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    overrideAccess: false,
    user,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
}
