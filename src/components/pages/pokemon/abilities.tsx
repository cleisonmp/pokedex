import { useQuery } from '@tanstack/react-query'

import type { Ability } from '../../../@types/pokemon'

import { getAbilitiesDetails } from '../../../lib/queries'
import { toTitleCase } from '../../../lib/utils/toTitleCase'

import { Title } from '../../common/text/title'
import { Accordion } from '../../common/accordion'

type AbilitiesProps = {
  id: string | number
  abilities: Ability[]
}
export const Abilities = ({ id, abilities }: AbilitiesProps) => {
  const { data: abilitiesData } = useQuery({
    queryKey: ['pokemon', 'abilities', id],
    queryFn: async () => {
      return await getAbilitiesDetails(abilities)
    },
  })

  return (
    <>
      {abilitiesData ? (
        <div className='flex flex-col gap-2 w-full'>
          <Title text='Abilities:' />
          {abilitiesData.map((ability) => (
            <Accordion key={ability.id} title={toTitleCase(ability.name)}>
              <div className='max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl px-2 pb-2 text-gray-800 md:px-5'>
                {ability.effect}
              </div>
            </Accordion>
          ))}
        </div>
      ) : (
        <Title text='Loading abilities...' />
      )}
    </>
  )
}
