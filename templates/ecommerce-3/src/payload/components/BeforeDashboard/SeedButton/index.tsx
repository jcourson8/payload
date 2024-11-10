'use client'
import React, { Fragment, useCallback, useState } from 'react'

export const SeedButton: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [seeded, setSeeded] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const handleClick = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()
      if (loading || seeded) return

      setLoading(true)

      setTimeout(async () => {
        try {
          await fetch('/api/seed')
          setSeeded(true)
        } catch (err) {
          setError(err as Error)
        }
      }, 1000)
    },
    [loading, seeded],
  )

  let message = ''
  if (loading) message = ' (seeding...)'
  if (seeded) message = ' (done!)'
  if (error) message = ` (error: ${error})`

  return (
    <Fragment>
      <a href="/api/seed" onClick={handleClick} rel="noopener noreferrer" target="_blank">
        Seed your database
      </a>
      {message}
    </Fragment>
  )
}
