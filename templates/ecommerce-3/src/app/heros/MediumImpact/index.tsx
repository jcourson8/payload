import React from 'react'

import type { Page } from '../../../payload-types'

import { CMSLink } from '../../components/Link'
import { Media } from '../../components/Media'
import RichText from '../../components/RichText'

export const MediumImpactHero: React.FC<Page['hero']> = ({ links, media, richText }) => {
  return (
    <div className="">
      <div className="container mb-8">
        <RichText className="mb-6" content={richText} enableGutter={false} />
        {Array.isArray(links) && links.length > 0 && (
          <ul className="flex gap-4">
            {links.map(({ link }, i) => {
              return (
                <li key={i}>
                  <CMSLink
                    {...link}
                    newTab={link?.newTab ?? undefined}
                    url={link?.url ?? undefined}
                    type={link?.type ?? undefined}
                    reference={
                      link?.reference
                        ? {
                            relationTo: link.reference.relationTo,
                            value: String(link.reference.value),
                          }
                        : undefined
                    }
                  />
                </li>
              )
            })}
          </ul>
        )}
      </div>
      <div className="container ">
        {typeof media === 'object' && media !== null && (
          <div>
            <Media
              className="-mx-4 md:-mx-8 2xl:-mx-16"
              imgClassName=""
              priority
              resource={media}
            />
            {media?.caption && (
              <div className="mt-3">
                <RichText content={media.caption} enableGutter={false} />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
