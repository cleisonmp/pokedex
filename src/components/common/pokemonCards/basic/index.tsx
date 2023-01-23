import { useAtom } from 'jotai'
import Image from 'next/image'

import { defaultImageUrlState } from '../../../../lib/atoms/defaultImageUrl'

type BasicCardProps = {
  name: string
  image: string
  onEdit?: (newName: string) => void
}

export const BasicCard = ({ name, image }: BasicCardProps) => {
  const [defaultImageUrl] = useAtom(defaultImageUrlState)

  return (
    <>
      <div className='flex h-40 w-40 flex-col items-center justify-center overflow-hidden rounded-lg border-8 border-gray-700 bg-gray-50 text-xl text-gray-500 lg:h-48 lg:w-48 shadow-2xl hover:scale-105 transition-all'>
        <Image
          src={`${defaultImageUrl}${image}`}
          width='90'
          height='90'
          alt=''
        />
        <p className='w-full p-2 text-center font-start text-[8px]'>{name}</p>
      </div>
    </>
  )
}
