import { Skeleton } from '../ui/skeleton'

export const TableSkeleton = ({
  cols = 3,
  rows = 5,
}: {
  cols?: number
  rows?: number
}) => {
  return (
    <div className="overflow-x-auto animate-pulse">
      <table className="table-auto w-full">
        <thead>
          <tr>
            {Array.from({ length: cols }).map((_, i) => (
              <th
                key={i}
                className="text-left text-neutral-400 text-[12px] font-semibold py-2"
              >
                <Skeleton className="h-4 w-16 rounded-md" />
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <tr key={rowIdx} className="border-b">
              {Array.from({ length: cols }).map((_, colIdx) => (
                <td key={colIdx} className="py-3">
                  <Skeleton className="h-4 w-[80%] rounded-md" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
