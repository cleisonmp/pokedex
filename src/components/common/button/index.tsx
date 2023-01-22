import type { MouseEventHandler } from 'react'
import { cx } from 'classix'

type ButtonProps = {
  text: string
  size?: 'small' | 'medium'
  style?: 'confirm' | 'cancel'
  type?: 'button' | 'reset' | 'submit'
  clickHandler?: MouseEventHandler<HTMLButtonElement>
}

export const Button = ({
  text,
  size = 'small',
  style = 'confirm',
  type = 'button',
  clickHandler,
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={clickHandler}
      className={cx(
        'font-bold rounded-md text-white transition-all hover:bg-app-tertiary focus:outline-none focus-visible:ring-1 hover:text-app-text focus-visible:ring-app-tertiary hover:scale-105',
        style === 'cancel' && 'bg-app-primary ',
        style === 'confirm' && 'bg-app-secondary',
        size === 'small' && 'px-2 py-1 ',
        size === 'medium' && 'px-4 py-2',
      )}
    >
      {text}
    </button>
  )
}
