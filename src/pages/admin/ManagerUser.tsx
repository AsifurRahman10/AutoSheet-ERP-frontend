import { Search } from 'lucide-react'
import { Input } from '../../components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select'
import { MainButton } from '../../components/MainButton'
import { useNavigate } from 'react-router-dom'

export const ManagerUser = () => {
  const navigate = useNavigate()
  return (
    <div className="mx-4">
      {/* quick staff search  */}
      <div className="p-4 rounded-2xl bg-white flex items-center justify-between gap-4">
        <div className="flex-1">
          <p>Quick search a staff</p>

          <div className="relative w-3/4 mt-2">
            <Input
              placeholder="Enter search word"
              className="w-full h-10 text-base"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold">250</p>
          <p className="text-gray-600 mt-2">Total number of staff</p>
        </div>
        <div className="flex-1">
          <p className="mb-2">Filter Staff</p>
          <Select>
            <SelectTrigger className="w-1/2 bg-blue-50 border-none py-5">
              <SelectValue placeholder="Select a fruit" />
            </SelectTrigger>
            <SelectContent className="border-none">
              {['Admin', 'Manager', 'Employee'].map((label) => (
                <SelectItem key={label} value={label.toLowerCase()}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <MainButton
          action={() => navigate('/add-user')}
          className={'w-[180px]'}
          text={'Add New Stuff'}
        />
      </div>

      {/* main content */}
      {/* <Outlet /> */}
    </div>
  )
}
