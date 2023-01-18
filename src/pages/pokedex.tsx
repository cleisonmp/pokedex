import { type NextPage } from 'next'
import { Header } from '../components/common/header'

const Pokedex: NextPage = () => {
  return (
    <>
      <Header />
      <main className='flex grow flex-col items-center '>
        <p>My Pokédex</p>
        <ul>
          <li>Poke 1</li>
          <li>Poke 2</li>
        </ul>
      </main>
    </>
  )
}

export default Pokedex
