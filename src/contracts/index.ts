export type EventStatus = 'completed' | 'in-progress' | 'not-started'

export interface EventInterface {
    id: string,
    title: string,
    date: string // ISO yyyy-mm-dd,
    status: EventStatus
}

export interface Column<T> {
    key: string,
    label: string,
    accessor: (item: T) => unknown,
    sortable?: boolean,
    filterable?: boolean,
    visible?: boolean,
}

export interface DashboradStateShapeInterface {
    events: EventInterface[],
    status: 'loading' | 'ready' | 'error',
    error: null | string,
    formOpen: boolean,
    formMode: 'add' | 'edit',
    editingEventId: null | string
}

export type DashboardAction = 
  | { type: 'LOAD_START' }
  | { type: 'LOAD_SUCCESS'; payload: EventInterface[] }
  | { type: 'LOAD_ERROR'; payload: string }
  | { type: 'OPEN_FORM'; payload: { mode: 'add' | 'edit'; eventId?: string } }
  | { type: 'CLOSE_FORM' }
  | { type: 'ADD_EVENT'; payload: EventInterface }
  | { type: 'EDIT_EVENT'; payload: EventInterface };