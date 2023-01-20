import Image from 'next/image'
import { MdShield } from 'react-icons/md'
import { BiTrendingDown } from 'react-icons/bi'

import type { Pokemon, PokemonTypeLink } from '../../../../@types/pokemon'
import { toTitleCase } from '../../../../lib/utils/toTitleCase'
import { StatContainer } from '../../pokemonStats/statContainer'

type DetailedPokemon = {
  url: string
  image: string
  imageHq: string | null
  types: PokemonTypeLink[]
} & Pick<Pokemon, 'id' | 'name' | 'species' | 'stats' | 'weight' | 'height'>

type DetailCardProps = {
  pokemon: DetailedPokemon
}
export const DetailCard = ({ pokemon }: DetailCardProps) => {
  const {
    id,
    image,
    imageHq,
    name,
    species,
    stats,
    types,
    url,
    weight,
    height,
  } = pokemon
  const hasMoreThanOneType = types.length > 1

  //console.log(image)
  //console.log(imageHq)
  console.log(stats)
  const speed = stats.find((stat) => stat.stat.name === 'speed')?.base_stat ?? 0
  const defense =
    stats.find((stat) => stat.stat.name === 'defense')?.base_stat ?? 0
  const attack =
    stats.find((stat) => stat.stat.name === 'attack')?.base_stat ?? 0
  const hp = stats.find((stat) => stat.stat.name === 'hp')?.base_stat ?? 0
  const baseDifficultyLevel =
    (speed * 2 + defense * 1.5 + attack * 1.25 + hp * 0.75) / 500 - 0.1
  const difficultyLevelDisplayBar =
    baseDifficultyLevel > 1 ? 0 : 100 - baseDifficultyLevel * 100

  return (
    <div className='flex w-56 flex-col items-center justify-center rounded-lg border-8 border-gray-600 bg-gray-50 text-xl text-gray-800 lg:w-64'>
      <div className='relative flex w-full justify-center'>
        <Image
          src={imageHq ?? image}
          width='150'
          height='150'
          alt=''
          className='scale-125'
        />
        <span className='absolute top-3 right-3 rounded-full bg-gray-700 px-2 text-sm font-bold text-white'>
          {id.toString().padStart(3, '0')}
        </span>
      </div>
      <div className='flex w-full flex-col gap-1 bg-gray-200 p-5'>
        <div className='flex items-center justify-between gap-2'>
          <p className='w-full text-lg font-extrabold leading-none'>
            {toTitleCase(name.replaceAll('-', ' '))}
          </p>
          {!hasMoreThanOneType && (
            <div
              key={types[0]?.name}
              className='h-min w-min rounded-xl bg-gray-700 px-2 py-1 text-xs font-bold text-white'
            >
              {toTitleCase(types[0]?.name ?? '')}
            </div>
          )}
        </div>
        {hasMoreThanOneType && (
          <div className='flex items-center gap-2'>
            {types.map((type) => (
              <div
                key={type.name}
                className='h-min w-min rounded-xl bg-gray-700 px-2 py-1 text-xs font-bold text-white'
              >
                {toTitleCase(type.name)}
              </div>
            ))}
          </div>
        )}
        {/* species.genera.find.language.en */}
        <span className='text-xs text-gray-500'>Seed Pokémon</span>
        <div className='flex justify-between gap-1 text-xs'>
          <StatContainer
            value={
              stats.find((stat) => stat.stat.name === 'hp')?.base_stat ?? ''
            }
            prefix='HP'
          />
          <StatContainer
            value={(weight * 0.1).toFixed(1)}
            prefix='W'
            sufix='kg'
          />
          <StatContainer
            value={(height * 0.1).toFixed(1)}
            prefix='H'
            sufix='m'
          />
        </div>
        <div className='flex justify-between gap-1 text-xs'>
          <StatContainer
            value={
              stats.find((stat) => stat.stat.name === 'attack')?.base_stat ?? ''
            }
            prefix='Atk'
          />
          <StatContainer
            value={
              stats.find((stat) => stat.stat.name === 'defense')?.base_stat ??
              ''
            }
            prefix='Def'
          />
          <StatContainer
            value={
              stats.find((stat) => stat.stat.name === 'speed')?.base_stat ?? ''
            }
            prefix='Spd'
          />
        </div>
        <div className='flex gap-1 text-xs'>
          <StatContainer
            value={
              stats.find((stat) => stat.stat.name === 'special-attack')
                ?.base_stat ?? ''
            }
            prefix='SAtk'
          />
          <StatContainer
            value={
              stats.find((stat) => stat.stat.name === 'special-defense')
                ?.base_stat ?? ''
            }
            prefix='SDef'
          />
        </div>
        <div className='flex justify-between gap-1 text-xs'>
          {/* type.id.damage_relations.half_damage_from[] */}
          <StatContainer value={'Water'} Icon={MdShield} />
          <StatContainer value={'Water'} Icon={MdShield} />
          <StatContainer value={'Water'} Icon={MdShield} />
        </div>
        <div className='flex justify-between gap-1 text-xs'>
          {/* type.id.damage_relations.double_damage_from[] */}
          <StatContainer value={'Fire'} Icon={BiTrendingDown} />
          <StatContainer value={'Fire'} Icon={BiTrendingDown} />
          <StatContainer value={'Fire'} Icon={BiTrendingDown} />
        </div>
        <div>
          <span className='text-xs font-bold'>Catch difficulty</span>
          <div className='relative flex h-6 w-full overflow-hidden rounded-lg border border-gray-700 bg-gray-200'>
            <div className='absolute -left-1 h-full w-[110%] rounded-lg bg-gradient-to-r from-green-500 to-red-500'></div>
            <div
              className='absolute -right-1 h-full rounded-r-lg bg-gray-200'
              style={{ width: `${difficultyLevelDisplayBar}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}