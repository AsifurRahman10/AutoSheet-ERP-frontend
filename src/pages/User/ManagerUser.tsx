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
import { useQuery } from '@tanstack/react-query'
import api from '../../lib/axios'
import { useAuth } from '../../context/AuthContext'
import { CustomTable } from '../../components/CustomTable'
import { useEffect, useState } from 'react'
import { TableSkeleton } from '../../components/skeleton/TableSkeleton'

export const ManagerUser = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [selectedPage, setSelectedPage] = useState(1)
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState({ role: '' })
  const {
    data: allUserData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['users', user?.email, selectedPage, debouncedSearch, filter],
    queryFn: async () => {
      const response = await api.get(
        `/user/all-users?search=${debouncedSearch}&filter=${filter.role}&page=${selectedPage}&limit=8`
      )
      return response.data
    },
    enabled: !!user?.email,
    refetchOnWindowFocus: false,
  })
  const pagesArray = Array.from(
    { length: allUserData?.data?.totalPages ?? 0 },
    (_, i) => i + 1
  )
  const tableHead = [
    'S/N',
    'Name',
    'Gender',
    'Staff ID',
    'Phone Number',
    'Role',
    'Designation',
    'Action',
  ]
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)

    return () => clearTimeout(handler)
  }, [search])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }
  // if (isLoading && isFetching) return <div>Loading...</div>
  return (
    <div className="mx-4">
      {/* quick staff search  */}
      <div className="p-4 rounded-2xl bg-white flex items-center justify-between gap-4">
        <div className="flex-1">
          <p>Quick search a staff</p>

          <div className="relative w-3/4 mt-2">
            <Input
              value={search}
              onChange={handleSearch}
              placeholder="Enter search word"
              className="w-full h-10 text-base"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          </div>
        </div>
        <div className="flex-1">
          <p className="text-2xl font-bold">{allUserData?.data?.total ?? 0}</p>
          <p className="text-gray-600 mt-2">Total number of staff</p>
        </div>
        <div className="flex-1">
          <p className="mb-2">Filter Staff</p>
          <Select
            value={filter.role}
            onValueChange={(e) => setFilter({ role: e })}
          >
            <SelectTrigger className="w-1/2 bg-blue-50 border-none py-5">
              <SelectValue placeholder="Select a role" />
            </SelectTrigger>
            <SelectContent className="border-none">
              {['Admin', 'Manager', 'Staff'].map((label) => (
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
      {/* table */}
      <div className="p-4 rounded-2xl bg-white mt-4">
        <div className="flex justify-between items-center pt-4 mb-10">
          <p className="font-bold text-2xl">All Staff</p>
          <p className="text-gray-600">
            Showing Result of{' '}
            <span className="px-3 py-2 border-2 border-blue-700 mx-1 rounded-md">
              {selectedPage}
            </span>{' '}
            page
          </p>
        </div>
        {isLoading && isFetching ? (
          <TableSkeleton rows={10} />
        ) : (
          <CustomTable
            tableHead={tableHead}
            TableData={allUserData?.data.data}
          />
        )}
      </div>
      {/* pagination */}
      <div className="mt-5 space-x-4 ml-6">
        {pagesArray.map((pageNum) => (
          <button
            onClick={() => setSelectedPage(pageNum)}
            key={pageNum}
            className={`px-4 py-2 border rounded-md  ${
              selectedPage === pageNum
                ? 'bg-gradient-to-br from-[#13add6] to-[#384295] text-white font-normal py-2 px-4 rounded-md hover:opacity-90 transition-opacity'
                : 'border-gray-700'
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>
    </div>
  )
}
