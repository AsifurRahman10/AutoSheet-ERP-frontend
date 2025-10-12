import { Bell, ChevronDown } from 'lucide-react'
import { Avatar, AvatarImage } from './ui/avatar'
import { useState, useRef, useEffect } from 'react'

export const TopProfile = ({
  user,
  signOut,
}: {
  user: User
  signOut: () => void
}) => {
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="px-4 py-6 flex items-center justify-between">
      {/* heading part */}
      <div>
        <h2 className="text-2xl font-semibold">Welcome, {user.email}</h2>
        <p className="text-dark-gray">
          Today is{' '}
          {new Date().toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
          .
        </p>
      </div>

      {/* profile part */}
      <div className="flex items-center gap-4" ref={menuRef}>
        <Bell className="w-6 h-6 cursor-pointer" />
        <div className="relative">
          <button
            onClick={() => setOpen((prev) => !prev)}
            className="flex items-center gap-2 focus:outline-none"
          >
            <div className="flex items-center gap-2">
              <Avatar className="w-12 h-12">
                <AvatarImage src="https://github.com/shadcn.png" />
              </Avatar>
              <div className="text-left">
                <h6 className="font-medium">Asifur Rahman</h6>
                <p className="text-sm text-dark-gray">Admin</p>
              </div>
            </div>
            <ChevronDown
              className="w-8 h-8 transition-transform duration-200"
              style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => console.log('Profile')}
              >
                Profile
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => console.log('Settings')}
              >
                Settings
              </button>
              <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
                onClick={() => signOut()}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
