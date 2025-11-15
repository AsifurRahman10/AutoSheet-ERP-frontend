import { Button } from './ui/button'

export const CustomTable = ({
  tableHead,
  TableData,
  onViewMore,
}: {
  tableHead: string[]
  TableData: User[]
  onViewMore: (userId: string) => void
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead className=" sticky top-0">
          <tr>
            {tableHead.map((head: string, idx: number) => (
              <th
                key={idx}
                className="text-left text-neutral-600 font-extrabold text-[12px]"
              >
                {head}
              </th>
            ))}
          </tr>
          <tr className="h-2"></tr>
        </thead>
        <tbody>
          {TableData?.map((user: User, idx: number) => {
            return (
              <tr key={idx} className=" hover:bg-gray-100 transition border-b">
                <td className="text-neutral-600">
                  {String(idx + 1).padStart(2, '0')}
                </td>
                <td className="text-neutral-600">{user.name}</td>
                <td className="text-neutral-600">{user.gender}</td>
                <td className="text-neutral-600">{user.staffId}</td>
                <td className="text-neutral-600">{user.phoneNumber}</td>
                <td className="text-neutral-600">{user.role}</td>
                <td className="text-neutral-600">{user.designation}</td>
                <td className="pr-4 py-2">
                  <Button
                    onClick={() => onViewMore(user?._id ?? '')}
                    variant="link"
                    className="text-blue-500 p-0"
                  >
                    View more
                  </Button>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
