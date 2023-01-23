type TitleProps = {
  text: string
}

export const Title = ({ text }: TitleProps) => {
  return <span className='font-bold text-app-text md:text-lg'>{text}</span>
}
