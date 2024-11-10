import { cn } from '@/utilities/cn'
import React from 'react'
import RichText from 'src/app/components/RichText'

import type { Page } from '../../../payload-types'

import { CMSLink } from '../../components/Link'

type Props = Extract<Page['layout'][0], { blockType: 'content' }>

export const ContentBlock: React.FC<
  Props & {
    id?: string
  }
> = (props) => {
  const { columns } = props

  const colsSpanClasses = {
    full: '12',
    half: '6',
    oneThird: '4',
    twoThirds: '8',
  }

  return (
    <div className="container my-16">
      <div className="grid grid-cols-4 lg:grid-cols-12 gap-y-8 gap-x-16">
        {columns &&
          columns.length > 0 &&
          columns.map((col, index) => {
            const { enableLink, link, richText, size } = col

            return (
              <div
                className={cn(`col-span-4 lg:col-span-${colsSpanClasses[size ?? 'full']}`, {
                  'md:col-span-2': size !== 'full',
                })}
                key={index}
              >
                <RichText content={richText} enableGutter={false} />
                {enableLink && link && (
                  <CMSLink
                    className="classes.link"
                    {...link}
                    newTab={link.newTab ?? undefined}
                    url={link.url ?? undefined}
                    type={link.type ?? undefined}
                    reference={
                      link.reference
                        ? {
                            relationTo: link.reference.relationTo,
                            value: String(link.reference.value),
                          }
                        : undefined
                    }
                  />
                )}
              </div>
            )
          })}
      </div>
    </div>
  )
}
