import type { IconType } from 'react-icons'

type StatContainerProps = {
  Icon?: IconType
  value: string | number
  prefix?: string
  sufix?: string
}
export const StatContainer = ({
  Icon,
  value,
  prefix,
  sufix,
}: StatContainerProps) => {
  return (
    <div className='flex items-center gap-1 rounded bg-white px-1'>
      {Icon && <Icon size={8} />}
      {prefix && <span>{prefix}</span>}
      <span className='font-bold'>
        {value}
        {sufix && <span className='font-normal'>{sufix}</span>}
      </span>
    </div>
  )
}
