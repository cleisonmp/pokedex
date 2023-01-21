import type { ReactNode } from 'react'
import { Disclosure, Transition } from '@headlessui/react'
import { HiChevronUp } from 'react-icons/hi2'

type AccordionProps = {
  title: string
  children: ReactNode
}

export const Accordion = ({ title, children }: AccordionProps) => {
  return (
    <div className='w-full'>
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className='group flex w-full justify-between rounded-lg bg-gray-300 px-4 py-2 text-left font-bold text-gray-800 hover:bg-gray-500 hover:text-gray-50 focus:outline-none focus-visible:ring focus-visible:ring-gray-500/75'>
              <span>{title}</span>
              <HiChevronUp
                className={`h-5 w-5 text-gray-500 group-hover:text-gray-50 ${
                  open ? 'rotate-180' : ''
                }`}
              />
            </Disclosure.Button>
            <Transition
              enter='transition-all duration-200 ease-in-out'
              enterFrom='scale-50 opacity-75 origin-top'
              enterTo='scale-100 opacity-100'
              leave='transition-all duration-100 ease-in-out'
              leaveFrom='scale-100 opacity-100'
              leaveTo='scale-75 opacity-0'
            >
              <Disclosure.Panel className=''>{children}</Disclosure.Panel>
            </Transition>
          </>
        )}
      </Disclosure>
    </div>
  )
}
