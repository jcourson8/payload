import type { Footer } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import React from 'react'

interface Props {
  menu: Footer['navItems']
}

export default function FooterMenu({ menu }: Props) {
  if (!menu?.length) return null

  return (
    <nav>
      <ul>
        {menu.map((item) => {
          return (
            <li key={item.id}>
              <CMSLink
                appearance="link"
                {...item.link}
                newTab={item.link?.newTab ?? undefined}
                url={item.link?.url ?? undefined}
                type={item.link?.type ?? undefined}
                reference={
                  item.link?.reference
                    ? {
                        relationTo: item.link.reference.relationTo,
                        value: String(item.link.reference.value),
                      }
                    : undefined
                }
              />
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
