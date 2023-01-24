import { useState } from 'react'
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextPage,
} from 'next'
import Link from 'next/link'

import { useQuery } from '@tanstack/react-query'
import { Transition } from '@headlessui/react'
import { useAtom } from 'jotai'
import type { ToastOptions } from 'react-toastify'
import { toast } from 'react-toastify'

import { MdCatchingPokemon } from 'react-icons/md'

import { Header } from '../../components/common/header'
import { getPokemon } from '../../lib/queries'
import { usePokedexStore } from '../../lib/stores/pokedex'
import { defaultImageUrlState } from '../../lib/atoms/defaultImageUrl'

import { Modal } from '../../components/common/modal'
import { Pokeball } from '../../components/common/pokeball/pokeball'
import { Evolutions } from '../../components/pages/pokemon/evolutions'
import { Abilities } from '../../components/pages/pokemon/abilities'
import { StatsControllerPanel } from '../../components/pages/pokemon/statsControllerPanel'
import { useStatsPanelStore } from '../../lib/stores/statsPanel'
import { DetailedCard } from '../../components/pages/pokemon/detailedCard'

//this page could be done using getStaticPaths
//for the purpose of this test I'll use tanstack to load data instead
const PokemonPage: NextPage<
  InferGetServerSidePropsType<typeof getServerSideProps>
> = ({ id }) => {
  const [category, setCategory] = useState<string | undefined>()
  const { abilitiesActive, evolutionsActive } = useStatsPanelStore()

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

  const { image, imageHq, stats, weight, height } = pokemonData

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
      const caughtPokemon = randomNumber >= normalizedDifficultyLevel

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
      if (caughtPokemon) {
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
      <div className='flex flex-col gap-2 px-2 md:px-10 lg:px-16 items-center pb-5 pt-2 md:pt-4'>
        <div className='flex gap-4 text-app-text md:gap-10 lg:gap-20'>
          <DetailedCard
            imageUrl={`${defaultImageUrl}${imageHq ?? image}`}
            id={pokemonData.id}
            name={pokemonData.name}
            types={pokemonData.types}
            category={category}
            hp={hp}
            weight={weight}
            height={height}
            attack={attack}
            defense={defense}
            speed={speed}
            specialAttack={
              stats.find((stat) => stat.stat.name === 'special-attack')
                ?.base_stat ?? 0
            }
            specialDefense={
              stats.find((stat) => stat.stat.name === 'special-defense')
                ?.base_stat ?? 0
            }
            difficultyLevelDisplayBar={difficultyLevelDisplayBar}
          />
          <div className='flex flex-col gap-2 w-full'>
            <span className='font-bold'>Show Stats:</span>
            <StatsControllerPanel />
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
        <div className='flex flex-col gap-2 md:gap-6 self-center sm:w-[85%] md:w-[65%] items-center w-full'>
          {abilitiesActive && (
            <Abilities id={pokemonData.id} abilities={pokemonData.abilities} />
          )}

          {evolutionsActive && (
            <div>
              <Evolutions
                url={pokemonData.species.url}
                id={pokemonData.id}
                setCategory={setCategory}
              />
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
