import { keepPreviousData, useQuery } from '@tanstack/react-query'
import classNames from 'classnames'
import { ApiQuery, getUser } from 'frontend-api'

const getProfileInitials = (nameString: string): string => {
  const parts = nameString.split(' ')
  if (parts.length === 1) {
    return parts[0].charAt(0)
  }

  return parts[0].charAt(0) + parts[1].charAt(0)
}

export type ProfileCircleProps = {
  interactive?: boolean
  className?: string
}

export function ProfileCircle({ interactive = true, className }: ProfileCircleProps) {
  const { data: user } = useQuery({
    queryKey: [ApiQuery.User],
    queryFn: async () => {
      const res = await getUser()
      if (res.ok && res.parsedBody?.payload) {
        return res.parsedBody.payload
      }
    },
    placeholderData: keepPreviousData
  })

  return (
    <div
      className={classNames(
        'flex items-center justify-center w-12 h-12 text-base font-semibold rounded-full text-cyan bg-lighter-green',
        interactive && 'hover:bg-opacity-20 cursor-pointer',
        className
      )}
    >
      {getProfileInitials(user?.name ?? '')}
    </div>
  )
}
