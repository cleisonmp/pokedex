import type { Dispatch, SetStateAction } from 'react'
import Link from 'next/link'
import { useQuery } from '@tanstack/react-query'

import { AiOutlineDoubleRight } from 'react-icons/ai'

import { SmallCard } from '../../common/pokemonCards/small'
import { Title } from '../../common/text/title'
import { getEvolutions } from '../../../lib/queries'

type EvolutionsProps = {
  id: string | number
  url: string
  setCategory: Dispatch<SetStateAction<string | undefined>>
}
export const Evolutions = ({ id, url, setCategory }: EvolutionsProps) => {
  const { data: evolutionsData } = useQuery({
    queryKey: ['pokemon', 'evolutions', id],
    queryFn: async () => {
      const evolutionsData = await getEvolutions(url)
      setCategory(evolutionsData.category)

      return evolutionsData.evolutions
    },
  })

  return (
    <>
      <Title text='Evolutions:' />
      {evolutionsData ? (
        <div className='flex gap-1'>
          {evolutionsData.map(({ name, image }, index) => (
            <div key={name} className='flex items-center '>
              {index > 0 && <AiOutlineDoubleRight size={20} />}
              <Link key={name} href={`/pokemon/${name}`}>
                <SmallCard name={name} image={image} />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <Title text='Loading evolutions...' />
      )}
    </>
  )
}
