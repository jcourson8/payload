import React from 'react'
import RichText from 'src/app/components/RichText'

import type { Page } from '../../../payload-types'

import { CMSLink } from '../../components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'cta' }>

export const CallToActionBlock: React.FC<
  Props & {
    id?: string
  }
> = ({ links, richText }) => {
  return (
    <div className="container">
      <div className="bg-card rounded border-border border p-4 flex flex-col gap-8 md:flex-row md:justify-between md:items-center">
        <div className="max-w-[48rem] flex items-center">
          <RichText className="" content={richText} enableGutter={false} />
        </div>
        <div className="flex flex-col gap-8">
          {(links || []).map(({ link }, i) => {
            const sanitizedLink = {
              ...link,
              newTab: link.newTab ?? undefined,
              reference: link.reference
                ? {
                    relationTo: link.reference.relationTo,
                    value: String(link.reference.value),
                  }
                : undefined,
              type: link.type ?? undefined,
              url: link.url ?? undefined,
            }
            return <CMSLink key={i} size="lg" {...sanitizedLink} />
          })}
        </div>
      </div>
    </div>
  )
}
