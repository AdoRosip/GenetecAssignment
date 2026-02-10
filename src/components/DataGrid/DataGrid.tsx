import { useState } from "react";
import type { Column, EventInterface } from "../../contracts";

interface DataGridProps {
  data: EventInterface[];
  columns: Column<EventInterface>[];
}
// Potentially make the component generic to accept other data types other than the event I am using? 
export const DataGrid = ({ data, columns }: DataGridProps) => {
  const visibleColumns = columns.filter((col) => col.visible !== false);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(data.length/itemsPerPage)
  const [sortingState, setSortingState] = useState({key: '', direction: 'asc'})
  const currentlyActiveColumn = visibleColumns.find((item) => item.key === sortingState.key)
  // using dynamic obj for now - might later refactor once I decide which cols are filterable
  const [filters, setFilters] = useState<Record<string, string>>({});
  const sortedData = [...data].sort((a,b) => {
    if(!currentlyActiveColumn) return 0

    const aValue = currentlyActiveColumn.accessor(a)
    const bValue = currentlyActiveColumn.accessor(b)

    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return 1;
    if (bValue == null) return -1;

    let result = 0
    if(typeof aValue == "string" && typeof bValue ==="string"){
        result = aValue.localeCompare(bValue)
    }
    else {
        result = aValue > bValue ? 1 : aValue < bValue ? -1 : 0
    }

    return sortingState.direction === 'asc' ? result : -result
})

  const currentPageData = sortedData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)


  const handleNextPage = () => {
    setCurrentPage(prev => prev + 1)
  }

  const handlePreviousPage = () => {
    setCurrentPage(prev => prev - 1)
  }

  const handleSort = (colKey: string) => {
    if(colKey === sortingState.key) {
        setSortingState(prev => ({...prev, direction: prev.direction === 'asc' ? 'desc' : 'asc'}))
    }
    else {
        setSortingState({ key: colKey, direction: 'asc' });
        setCurrentPage(1)
    }
  }

  function handleFilterChange(event:React.ChangeEvent<HTMLInputElement>, columnKey: string) {
    setFilters(prev => ({...prev, columnKey: event?.target.value}))
  }


  return (
    <div className="data-grid-container">
      <table className="data-grid-table">
        <thead>
          <tr>
            {visibleColumns.map((col) => (
              <th key={col.key} onClick={() => col.sortable !== false && handleSort(col.key)}>
                {col.label}
                {col.sortable !== false && (
                  <span>
                    {sortingState.key === col.key ? (sortingState.direction === 'asc' ? '↑' : '↓') : ''}
                  </span>
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tr>
            {visibleColumns.map((column) => (
                column.filterable && <input type="text" name="" id="" onChange={() => handleFilterChange(event, column.key)} />
            ))}
        </tr>
        <tbody>
          {currentPageData.map((item) => (
            <tr key={item.id}>
              {visibleColumns.map((col) => (
                <td key={col.key}>{String(col.accessor(item))}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="controls">
        <button disabled={currentPage===totalPages} onClick={handleNextPage}>Next</button>
        <p>{currentPage}</p>
        <button disabled={currentPage===1} onClick={handlePreviousPage}>Previous</button>
      </div>
    </div>
  );
};