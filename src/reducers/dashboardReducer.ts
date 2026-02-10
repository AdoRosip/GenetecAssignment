import type { DashboardAction, DashboradStateShapeInterface } from "../contracts";

export const initialDashboardReducerState: DashboradStateShapeInterface = {
    events: [],
    status: 'loading',
    error:null,
    formOpen: false,
    formMode: 'add', 
    editingEventId: null
}

// Reducer to handle different actions for the state modif. 
export function reducer (state: DashboradStateShapeInterface, action: DashboardAction):DashboradStateShapeInterface {
    switch(action.type) {
        case 'LOAD_START': return {
            ...state,
            error: null,
            status: 'loading'
        }
        case 'LOAD_SUCCESS': return {
            ...state,
            status: 'ready',
            events: action.payload
        }
        case 'LOAD_ERROR': return {
            ...state,
            error: action.payload,
            status: "error"
        }
        case 'OPEN_FORM': return {
            ...state,
            formOpen: true,
            formMode: action.payload.mode,
            editingEventId: action.payload.eventId ?? null
        }
        case 'ADD_EVENT': return {
            ...state,
            events: [...state.events, action.payload],
            formOpen:false
        }
        case 'CLOSE_FORM': return {
            ...state,
            formOpen: false,
            formMode: 'add',
            editingEventId: null
        }
        case 'EDIT_EVENT': return {
            ...state,
            formOpen: false,
            events: state.events.map(event => event.id === action.payload.id ? action.payload : event)
        }
        default: return state
    }
}