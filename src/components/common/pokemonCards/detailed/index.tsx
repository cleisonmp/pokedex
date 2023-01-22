import { useState } from 'react'
import Image from 'next/image'

import axios from 'axios'
import { Transition } from '@headlessui/react'
import { useAtom } from 'jotai'
import type { ToastOptions } from 'react-toastify'
import { toast } from 'react-toastify'
import { useQuery } from '@tanstack/react-query'

import { MdCatchingPokemon, MdShield } from 'react-icons/md'
import { BiTrendingDown } from 'react-icons/bi'

import type {
  AbilityDetail,
  DetailedPokemon,
  EvolutionChain,
  SpeciesDetail,
  TypeDetails,
} from '../../../../@types/pokemon'
import { pokemonListState } from '../../../../lib/atoms/pokemonList'
import { toTitleCase } from '../../../../lib/utils/toTitleCase'
import { usePokedexStore } from '../../../../lib/stores/pokedex'

import { StatContainer } from '../../pokemonStats/statContainer'
import { StatToggleButton } from '../../pokemonStats/statToggleButton'
import { Pokeball } from '../../pokeball/pokeball'
import { Accordion } from '../../accordion'
import { PokemonList } from '../../pokemonList'

type DetailCardProps = {
  pokemon: DetailedPokemon
  allowCatching?: boolean
}
export const DetailCard = ({
  pokemon,
  allowCatching = true,
}: DetailCardProps) => {
  const {
    id,
    image,
    imageHq,
    name,
    abilities,
    species,
    stats,
    types,
    weight,
    height,
  } = pokemon

  const [typeActive, setTypeActive] = useState(true)
  const [categoryActive, setCategoryActive] = useState(true)
  const [baseActive, setBaseActive] = useState(true)
  const [combatActive, setCombatActive] = useState(true)
  const [specialActive, setSpecialActive] = useState(true)
  const [weaknessesActive, setWeaknessesActive] = useState(true)
  const [resistancesActive, setResistancesActive] = useState(true)
  const [catchActive, setCatchActive] = useState(true)
  const [abilitiesActive, setAbilitiesActive] = useState(true)
  const [evolutionsActive, setEvolutionsActive] = useState(true)

  const [pokemonList] = useAtom(pokemonListState)
  const [showPokeball, setShowPokeball] = useState(false)

  const pokedex = usePokedexStore()

  const [category, setCategory] = useState<string | undefined>()

  const { data: evolutionsData } = useQuery({
    queryKey: ['pokemon', 'evolutions', id],
    queryFn: async () => {
      return await axios
        .get<SpeciesDetail>(species.url)
        .then(async (response) => {
          setCategory(
            response.data.genera.find((gen) => gen.language.name === 'en')
              ?.genus,
          )

          return await axios
            .get<EvolutionChain>(response.data.evolution_chain.url)
            .then((chainResponse) => {
              const basePokemon = pokemonList.find(
                (poke) => poke.name === chainResponse.data.chain.species.name,
              )

              const firstEvolution = pokemonList.find(
                (poke) =>
                  poke.name ===
                  chainResponse.data.chain.evolves_to[0]?.species.name,
              )

              const secondEvolution = pokemonList.find(
                (poke) =>
                  poke.name ===
                  chainResponse.data.chain.evolves_to[0]?.evolves_to[0]?.species
                    .name,
              )

              const evolutionsResponse: DetailedPokemon[] = []
              basePokemon && evolutionsResponse.push(basePokemon)
              firstEvolution && evolutionsResponse.push(firstEvolution)
              secondEvolution && evolutionsResponse.push(secondEvolution)

              return evolutionsResponse
            })
        })
    },
  })

  const { data: abilitiesData } = useQuery({
    queryKey: ['pokemon', 'abilities', id],
    queryFn: async () => {
      const abilitiesPromisses = abilities.map(async (ability) => {
        return await axios
          .get<AbilityDetail>(ability.ability.url)
          .then((response) => {
            return { ...response.data, slot: ability.slot }
          })
      })
      const abilitiesData = await Promise.all(abilitiesPromisses)

      return abilitiesData
        .map(({ id, name, effect_entries, slot }) => {
          const effect =
            effect_entries.find((entry) => entry.language.name === 'en')
              ?.effect ?? ''
          return { id, name, effect, slot }
        })
        .sort((a, b) => a.slot - b.slot)
    },
  })

  const { data: damageRelationsData } = useQuery({
    queryKey: ['pokemon', 'damage', id],
    queryFn: async () => {
      const mainType = types.find((type) => type.slot === 1)

      if (mainType) {
        const typeData = await axios
          .get<TypeDetails>(mainType.url)
          .then((response) => {
            return response.data
          })
        const resistances: string[] = []
        const weaknesses: string[] = []
        resistances.push(
          ...typeData.damage_relations.half_damage_from.map(
            (half) => half.name,
          ),
        )
        weaknesses.push(
          ...typeData.damage_relations.double_damage_from.map(
            (half) => half.name,
          ),
        )

        return {
          resistances: resistances.sort(),
          weaknesses: weaknesses.sort(),
        }
      }
      return null
    },
  })

  const isCatched = !!pokedex.pokemons.find(
    (pokedexPokemon) => pokedexPokemon.id === id,
  )
  const hasMoreThanOneType = types.length > 1

  const speed = stats.find((stat) => stat.stat.name === 'speed')?.base_stat ?? 0
  const defense =
    stats.find((stat) => stat.stat.name === 'defense')?.base_stat ?? 0
  const attack =
    stats.find((stat) => stat.stat.name === 'attack')?.base_stat ?? 0
  const hp = stats.find((stat) => stat.stat.name === 'hp')?.base_stat ?? 0

  const calculatedDifficultyLevel =
    (speed * 2 + defense * 1.5 + attack * 1.25 + hp * 0.75) / 500 - 0.1
  const normalizedDifficultyLevel =
    calculatedDifficultyLevel > 0.95 ? 0.95 : calculatedDifficultyLevel
  const difficultyLevelDisplayBar = 100 - normalizedDifficultyLevel * 100

  const handleCatchingPokemon = () => {
    setShowPokeball(true)

    setTimeout(() => {
      const randomNumber = Math.random()
      const catchedPokemon = randomNumber >= normalizedDifficultyLevel

      const toastProps: ToastOptions = {
        position: 'bottom-center',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      }

      toast.dismiss() //clear prev toasts to avoid stacking
      if (catchedPokemon) {
        pokedex.add(pokemon)
        toast.success('🎯 Nice catch!', toastProps)
      } else {
        toast.error(
          '🕸 Better bring a net next time. This one escaped.',
          toastProps,
        )
      }

      setShowPokeball(false)
    }, 1000)
  }

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex gap-4 text-gray-800'>
        <div className='flex w-56 flex-col items-center justify-center rounded-lg border-8 border-gray-600 bg-gray-50 text-xl lg:w-64'>
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
              {typeActive && !hasMoreThanOneType && (
                <div
                  key={types[0]?.name}
                  className='h-min w-min rounded-xl bg-gray-700 px-2 py-1 text-xs font-bold text-white'
                >
                  {toTitleCase(types[0]?.name ?? '')}
                </div>
              )}
            </div>
            {typeActive && hasMoreThanOneType && (
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
            {categoryActive &&
              (category ? (
                <span className='text-xs text-gray-500'>{category}</span>
              ) : (
                <span className='text-xs text-gray-500'>
                  Loading category...
                </span>
              ))}
            <div className='grid grid-cols-3 justify-between gap-1 text-xs'>
              {baseActive && (
                <>
                  <StatContainer
                    value={
                      stats.find((stat) => stat.stat.name === 'hp')
                        ?.base_stat ?? ''
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
                </>
              )}
              {combatActive && (
                <>
                  <StatContainer
                    value={
                      stats.find((stat) => stat.stat.name === 'attack')
                        ?.base_stat ?? ''
                    }
                    prefix='Atk'
                  />
                  <StatContainer
                    value={
                      stats.find((stat) => stat.stat.name === 'defense')
                        ?.base_stat ?? ''
                    }
                    prefix='Def'
                  />
                  <StatContainer
                    value={
                      stats.find((stat) => stat.stat.name === 'speed')
                        ?.base_stat ?? ''
                    }
                    prefix='Spd'
                  />
                </>
              )}
              {specialActive && (
                <>
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
                </>
              )}
            </div>

            {resistancesActive && (
              <div className='grid grid-cols-fit56 gap-1 text-xs'>
                {damageRelationsData ? (
                  damageRelationsData.resistances.map((resistance) => (
                    <StatContainer
                      key={resistance}
                      value={toTitleCase(resistance)}
                      Icon={MdShield}
                    />
                  ))
                ) : (
                  <p className='text-gray-800'>Loading resistances...</p>
                )}
              </div>
            )}
            {weaknessesActive && (
              <div className='grid grid-cols-fit56 gap-1 text-xs'>
                {damageRelationsData ? (
                  damageRelationsData.weaknesses.map((weakness) => (
                    <StatContainer
                      key={weakness}
                      value={toTitleCase(weakness)}
                      Icon={BiTrendingDown}
                    />
                  ))
                ) : (
                  <p className='text-gray-800'>Loading weaknesses...</p>
                )}
              </div>
            )}
            {catchActive && (
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
            )}
          </div>
        </div>
        <div className='flex min-w-max flex-col gap-2'>
          <span className='font-bold'>Show Stats:</span>
          <div className='grid grid-cols-2 gap-2 text-xs font-bold '>
            <StatToggleButton
              isActive={typeActive}
              toggleState={setTypeActive}
              text='Type'
            />
            <StatToggleButton
              isActive={categoryActive}
              toggleState={setCategoryActive}
              text='Category'
            />
            <StatToggleButton
              isActive={baseActive}
              toggleState={setBaseActive}
              text='Base'
            />
            <StatToggleButton
              isActive={combatActive}
              toggleState={setCombatActive}
              text='Combat'
            />
            <StatToggleButton
              isActive={specialActive}
              toggleState={setSpecialActive}
              text='Special'
            />
            <StatToggleButton
              isActive={weaknessesActive}
              toggleState={setWeaknessesActive}
              text='Weaknesses'
            />
            <StatToggleButton
              isActive={resistancesActive}
              toggleState={setResistancesActive}
              text='Resistances'
            />
            <StatToggleButton
              isActive={catchActive}
              toggleState={setCatchActive}
              text='Catch difficulty'
            />
            <StatToggleButton
              isActive={abilitiesActive}
              toggleState={setAbilitiesActive}
              text='Abilities'
            />
            <StatToggleButton
              isActive={evolutionsActive}
              toggleState={setEvolutionsActive}
              text='Evolutions'
            />
          </div>
          {allowCatching && (
            <button
              onClick={handleCatchingPokemon}
              disabled={showPokeball || isCatched}
              className='group flex w-full select-none items-center justify-center gap-1 rounded-lg bg-slate-200 p-2 font-bold   enabled:hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50'
            >
              <MdCatchingPokemon
                className='transition-all group-enabled:group-hover:scale-125 group-enabled:group-hover:fill-red-500'
                size={20}
              />
              Try to catch
            </button>
          )}

          <Transition
            show={showPokeball}
            enter='transform transition duration-300 ease-in-out'
            leave='transform transition duration-300 ease-in-out'
            enterFrom='opacity-0 scale-50'
            enterTo='opacity-100 scale-100'
            leaveFrom='opacity-100 scale-100 '
            leaveTo='opacity-0 scale-50'
          >
            <div className='flex w-full origin-center animate-spin items-center justify-center py-5'>
              <Pokeball />
            </div>
          </Transition>
        </div>
      </div>
      <div className='flex flex-col gap-2'>
        {abilitiesActive &&
          (abilitiesData ? (
            <div className=''>
              <span className='font-bold text-gray-800'>Abilities:</span>
              {abilitiesData.map((ability) => (
                <Accordion key={ability.id} title={toTitleCase(ability.name)}>
                  <div className='max-w-sm px-2 pb-2 text-gray-800'>
                    {ability.effect}
                  </div>
                </Accordion>
              ))}
            </div>
          ) : (
            <p className='text-lg font-bold text-gray-800'>
              Loading abilities...
            </p>
          ))}
        {evolutionsActive &&
          (evolutionsData ? (
            <PokemonList pokemons={evolutionsData} />
          ) : (
            <p className='text-lg font-bold text-gray-800'>
              Loading evolutions...
            </p>
          ))}
      </div>
    </div>
  )
}
