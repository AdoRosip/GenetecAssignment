import { useState } from "react";
import type { Column, EventInterface } from "../../contracts";
import "./DataGrid.css";

interface DataGridProps {
  data: EventInterface[];
  columns: Column<EventInterface>[];
  loading?: boolean,
  error?: string | null,
  onEditEvent?: (event: EventInterface) => void
}
// Potentially make the component generic to accept other data types other than the event I am using? 
export const DataGrid = ({ data, columns, loading, error, onEditEvent }: DataGridProps) => {
  const visibleColumns = columns.filter((col) => col.visible !== false);
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const [sortingState, setSortingState] = useState({key: '', direction: 'asc'})
  const currentlyActiveColumn = visibleColumns.find((item) => item.key === sortingState.key)
  // using dynamic obj for now - might later refactor once I decide which cols are filterable
  const [filters, setFilters] = useState<Record<string, string>>({});
  
  const filteredData = data.filter(item => {
    return visibleColumns.every(col => {
        if (col.filterable === false) return true;
        
        const filterValue = filters[col.key];
        if (!filterValue) return true;
        
        const value = String(col.accessor(item)).toLowerCase();
        return value.includes(filterValue.toLowerCase());
    });
    });
  const totalPages = Math.ceil(filteredData.length/itemsPerPage)

  const sortedData = [...filteredData].sort((a,b) => {
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

const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, columnKey: string): void => {
  setFilters(prev => ({...prev, [columnKey]: event?.target.value}))
}

const handleResetSort = () => {
  setSortingState({key: '', direction: 'asc'})
}
  // maybe if time handle this with some MUI spinners? 
  const renderLoading = () => {
    return (
        <div className="loading-container">
            <h1>Loading your data...</h1>
        </div>
    )
  } 

  const renderError = () => {
    return (
        <div className="error-container">
            <h1>There has been an issue with you data.</h1>
            <h3>Error: {error}</h3>
        </div>
    )
  }

  const renderEmptyRow = (columnCount: number) => {
    return (
      <tr>
        <td colSpan={columnCount}>
          <div className="empty-container">
            <h2>No events found</h2>
            <p>Try adjusting your filters</p>
          </div>
        </td>
      </tr>
    );
  };

return (
<div className="data-grid-container">
    {loading ? renderLoading() : error ? renderError() :
        <>
          <div className="datagrid-wrapper">
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
            <th id='button-th'>
              <button 
                onClick={handleResetSort} 
                disabled={!sortingState.key}
                className="reset-sort-btn"
              >
                Reset Sort
              </button>
            </th>
          </tr>
          <tr>
            {visibleColumns.map((col) => (
              <th key={`filter-${col.key}`}>
                {col.filterable !== false && (
                  col.key === 'status' ? (
                    <select 
                      value={filters[col.key] || ''} 
                      onChange={(event) => handleFilterChange(event, col.key)}
                      className="filter-select"
                    >
                      <option value="">All</option>
                      <option value="completed">Completed</option>
                      <option value="in-progress">In Progress</option>
                      <option value="not-started">Not Started</option>
                    </select>
                  ) : (
                    <input 
                      type="text" 
                      placeholder={`Filter ${col.label}...`}
                      value={filters[col.key] || ''}
                      onChange={(event) => handleFilterChange(event, col.key)} 
                      className="filter-input"
                    />
                  )
                )}
              </th>
            ))}
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length === 0 ? renderEmptyRow(visibleColumns.length + 1) : currentPageData.map((item) => (
            <tr key={item.id}>
              {visibleColumns.map((col) => (
                <td key={col.key}>{String(col.accessor(item))}</td>
              ))}
              <td>
                {onEditEvent && (
                  <button onClick={() => onEditEvent(item)}>Edit</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
            </table>
          </div>
      <div className="controls">
        <button disabled={currentPage===1} onClick={handlePreviousPage}>Previous</button>
        <p>{currentPage} / {totalPages}</p>
        <button disabled={currentPage===totalPages} onClick={handleNextPage}>Next</button>
      </div>
        </>
      }
    </div>
  );
};