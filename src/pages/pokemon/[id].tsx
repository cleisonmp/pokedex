import { useState } from 'react'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { useQuery } from '@tanstack/react-query'
import { Transition } from '@headlessui/react'
import { useAtom } from 'jotai'
import type { ToastOptions } from 'react-toastify'
import { toast } from 'react-toastify'

import { AiOutlineDoubleRight } from 'react-icons/ai'
import { BiTrendingDown } from 'react-icons/bi'
import { MdCatchingPokemon, MdShield } from 'react-icons/md'

import { Header } from '../../components/common/header'
import {
  getPokemon,
  getEvolutions,
  getAbilitiesDetails,
  getDamageRelations,
} from '../../lib/queries'
import { toTitleCase } from '../../lib/utils/toTitleCase'
import { usePokedexStore } from '../../lib/stores/pokedex'
import { defaultImageUrlState } from '../../lib/atoms/defaultImageUrl'

import { Accordion } from '../../components/common/accordion'
import { Modal } from '../../components/common/modal'
import { SmallCard } from '../../components/common/pokemonCards/small'
import { Pokeball } from '../../components/common/pokeball/pokeball'
import { StatContainer } from '../../components/common/pokemonStats/statContainer'
import { StatToggleButton } from '../../components/common/pokemonStats/statToggleButton'

//this page could be done using getStaticPaths
//for the purpose of this test I'll use tanstack to load data instead
const PokemonPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const [category, setCategory] = useState<string | undefined>()
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

  const [showPokeball, setShowPokeball] = useState(false)

  const [defaultImageUrl] = useAtom(defaultImageUrlState)
  const pokedex = usePokedexStore()

  const {
    data: pokemonData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ['pokemon', id],
    queryFn: () => getPokemon(`pokemon/${id}`),
  })

  const { data: evolutionsData } = useQuery({
    queryKey: ['pokemon', 'evolutions', id],
    queryFn: async () => {
      if (pokemonData) {
        const evolutionsData = await getEvolutions(pokemonData.species.url)
        setCategory(evolutionsData.category)

        return evolutionsData.evolutions
      }
      return null
    },
    enabled: !!pokemonData,
  })

  const { data: abilitiesData } = useQuery({
    queryKey: ['pokemon', 'abilities', id],
    queryFn: async () => {
      if (pokemonData) {
        return await getAbilitiesDetails(pokemonData.abilities)
      }
      return null
    },
    enabled: !!pokemonData,
  })

  const { data: damageRelationsData } = useQuery({
    queryKey: ['pokemon', 'damage', id],
    queryFn: async () => {
      if (pokemonData) {
        const mainType = pokemonData.types.find((type) => type.slot === 1)

        if (mainType) {
          return getDamageRelations(mainType.url)
        }
      }
      return null
    },
    enabled: !!pokemonData,
  })

  //main query
  if (isError || isLoading) {
    return (
      <>
        <Header />
        <p className='w-full text-center text-lg font-bold pt-10'>
          {isError ? 'Invalid Pokémon ID' : 'Loading pokémon data...'}
        </p>
      </>
    )
  }

  const { image, imageHq, name, stats, types, weight, height } = pokemonData

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

  const isCaught = !!pokedex.pokemons.find(
    (pokedexPokemon) => pokedexPokemon.id === pokemonData.id,
  )

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
        pokedex.add(pokemonData)
        toast.success('🎯 Nice catch!', toastProps)
      } else {
        toast.error(
          '🕸 Better bring a net next time. This one escaped.',
          toastProps,
        )
      }

      setShowPokeball(false)
    }, 1500)
  }

  return (
    <>
      <Modal
        title=''
        isOpen={showPokeball}
        setIsOpen={setShowPokeball}
        withBackground={false}
      >
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
      </Modal>

      <Header />
      <div className='flex flex-col gap-2 px-2'>
        <div className='flex gap-4 text-app-text'>
          <div className='flex w-64 h-min shrink-0 flex-col items-center justify-center rounded-lg border-8 border-gray-600 bg-gray-50 text-xl'>
            <div className='relative flex w-full justify-center'>
              <Image
                src={`${defaultImageUrl}${imageHq ?? image}`}
                width='150'
                height='150'
                alt=''
                className='scale-125'
                priority
              />
              <span className='absolute top-3 right-3 rounded-full bg-gray-700 px-2 text-sm font-bold text-white'>
                {pokemonData.id.toString().padStart(3, '0')}
              </span>
            </div>
            <div className='flex w-full flex-col gap-1 bg-gray-200 p-5 h-full'>
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
                    <StatContainer value={hp} prefix='HP' />
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
                    <StatContainer value={attack} prefix='Atk' />
                    <StatContainer value={defense} prefix='Def' />
                    <StatContainer value={speed} prefix='Spd' />
                  </>
                )}
                {specialActive && (
                  <>
                    <StatContainer
                      value={
                        stats.find(
                          (stat) => stat.stat.name === 'special-attack',
                        )?.base_stat ?? ''
                      }
                      prefix='SAtk'
                    />
                    <StatContainer
                      value={
                        stats.find(
                          (stat) => stat.stat.name === 'special-defense',
                        )?.base_stat ?? ''
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
          <div className='flex flex-col gap-2 w-full'>
            <span className='font-bold'>Show Stats:</span>
            <div className='grid grid-cols-1 gap-1 text-xs font-bold '>
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
                isActive={resistancesActive}
                toggleState={setResistancesActive}
                text='Resistances'
              />
              <StatToggleButton
                isActive={weaknessesActive}
                toggleState={setWeaknessesActive}
                text='Weaknesses'
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
            {isCaught ? (
              <div className='flex justify-center'>
                <Link href='/pokedex' title='View on pokédex'>
                  <Pokeball />
                </Link>
              </div>
            ) : (
              <button
                onClick={handleCatchingPokemon}
                disabled={showPokeball}
                className='group flex w-full select-none items-center justify-center gap-1 rounded-lg bg-slate-200 p-2 font-bold   enabled:hover:bg-slate-300 disabled:cursor-not-allowed disabled:opacity-50'
              >
                <MdCatchingPokemon
                  className='transition-all group-enabled:group-hover:scale-125 group-enabled:group-hover:fill-red-500'
                  size={20}
                />
                Try to catch
              </button>
            )}
          </div>
        </div>
        <div className='flex flex-col gap-2'>
          {abilitiesActive &&
            (abilitiesData ? (
              <div className='flex flex-col gap-2'>
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
          {evolutionsActive && (
            <div>
              <span className='font-bold text-gray-800'>Evolutions:</span>
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
                <p className='text-lg font-bold text-gray-800'>
                  Loading evolutions...
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default PokemonPage

export const getServerSideProps = (context: GetServerSidePropsContext) => {
  const id = String(context.params?.id) ?? ''

  return {
    props: { id },
  }
}
