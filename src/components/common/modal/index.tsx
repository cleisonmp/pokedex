import type { Dispatch, ReactNode, SetStateAction } from 'react'
import { Fragment } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { toTitleCase } from '../../../lib/utils/toTitleCase'

type ModalProps = {
  title: string
  isOpen: boolean
  withBackground?: boolean
  setIsOpen?: Dispatch<SetStateAction<boolean>>
  children: ReactNode
}
export const Modal = ({
  title,
  isOpen,
  withBackground = true,
  setIsOpen,
  children,
}: ModalProps) => {
  const closeModal = () => {
    setIsOpen?.(false)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-10' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black/75' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel
                className={`relative overflow-hidden rounded-2xl p-6 text-left align-middle shadow-xl transition-all ${
                  withBackground ? 'bg-white' : ''
                }`}
              >
                <Dialog.Title
                  as='h3'
                  className='text-lg font-medium leading-6 text-gray-900'
                >
                  {toTitleCase(title)}
                </Dialog.Title>
                {children}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
