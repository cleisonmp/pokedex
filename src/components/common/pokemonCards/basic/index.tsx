import { useAtom } from 'jotai'
import Image from 'next/image'
import type { MouseEventHandler } from 'react'
import { useState } from 'react'

import { FaPencilAlt } from 'react-icons/fa'
import { defaultImageUrlState } from '../../../../lib/atoms/defaultImageUrl'
import { toTitleCase } from '../../../../lib/utils/toTitleCase'
import { Modal } from '../../modal'

type BasicCardProps = {
  name: string
  image: string
  onClick: MouseEventHandler<HTMLButtonElement>
  onEdit?: (newName: string) => void
}

export const BasicCard = ({ name, image, onClick, onEdit }: BasicCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [newName, setNewName] = useState('')
  const [defaultImageUrl] = useAtom(defaultImageUrlState)
  const allowEdit = !!onEdit

  const handleSave = () => {
    onEdit?.(newName)
    setIsEditing(false)
  }

  return (
    <>
      <Modal
        setIsOpen={setIsEditing}
        isOpen={isEditing}
        title='Edit your pokémon name'
      >
        <div className='mt-2 flex flex-col gap-4'>
          <div>
            <p className='w-full p-2 text-xs text-gray-800'>
              Current:
              <span className='text-sm font-bold'>{toTitleCase(name)}</span>
            </p>
            <input
              type='text'
              className='w-full border p-2 text-gray-800'
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
          </div>
          <div className='flex w-full justify-center gap-2'>
            <button
              onClick={handleSave}
              className='hover:bg-grey inline-flex items-center rounded bg-teal-500 py-2 px-4 font-bold transition-colors hover:bg-teal-700'
            >
              <span>Save</span>
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className='hover:bg-grey inline-flex items-center rounded bg-red-500 py-2 px-4 font-bold transition-colors hover:bg-red-700'
            >
              <span>Cancel</span>
            </button>
          </div>
        </div>
      </Modal>
      <button
        onClick={onClick}
        className='flex h-40 w-40 flex-col items-center justify-center overflow-hidden rounded-lg border-8 border-gray-700 bg-gray-50 text-xl text-gray-500 lg:h-48 lg:w-48'
      >
        <Image
          src={`${defaultImageUrl}${image}`}
          width='90'
          height='90'
          alt=''
        />
        {isEditing}

        {allowEdit && (
          <div>
            <FaPencilAlt
              onClick={(event) => {
                event.stopPropagation()
                setIsEditing(true)
              }}
              size={12}
              className='transition-all hover:scale-125 hover:fill-emerald-500'
            />
          </div>
        )}
        <p className='w-full p-2 text-center font-start text-[8px]'>{name}</p>
      </button>
    </>
  )
}
