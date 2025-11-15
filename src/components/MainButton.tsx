import { Button } from './ui/button'

export const MainButton = ({
  text,
  className,
  action,
}: {
  text: string
  className: string
  action: () => void
}) => {
  return (
    <Button
      onClick={action}
      className={`bg-gradient-to-br from-[#13add6] to-[#384295] text-white font-normal py-2 px-4 rounded-md hover:opacity-90 transition-opacity ${className}`}
    >
      {text}
    </Button>
  )
}
