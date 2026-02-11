import { useEffect, useReducer } from 'react';
import type { Column, EventInterface } from './contracts';
import { reducer, initialDashboardReducerState } from './reducers/dashboardReducer';
import { fetchMockEvents } from './utils/mockData';
import { DataGrid } from './components/DataGrid/DataGrid';
import { Timeline } from './components/Timeline/Timeline';
import { EventForm } from './components/EventForm/EventForm';
import './Dashboard.css';

const Dashboard = () => {
  const [dashboardState, dispatch] = useReducer(reducer, initialDashboardReducerState);

  const columns: Column<EventInterface>[] = [
    {
      key: 'id',
      label: 'ID',
      accessor: (e) => e.id,
      sortable: true,
      filterable: true,
      visible: true
    },
    {
      key: 'title',
      label: 'Title',
      accessor: (e) => e.title,
      sortable: true,
      filterable: true,
      visible: true
    },
    {
      key: 'date',
      label: 'Date',
      accessor: (e) => e.date,
      sortable: true,
      filterable: false,
      visible: true
    },
    {
      key: 'status',
      label: 'Status',
      accessor: (e) => e.status,
      sortable: true,
      filterable: true,
      visible: true
    }
  ];

  useEffect(() => {
    dispatch({ type: 'LOAD_START' });
    
    fetchMockEvents().then((events) => {
      dispatch({ type: 'LOAD_SUCCESS', payload: events });
    }).catch((error) => {
      dispatch({ type: 'LOAD_ERROR', payload: error });
    });
  }, []);

  const handleAddEvent = () => {
    dispatch({ type: 'OPEN_FORM', payload: { mode: 'add' } });
  };

  const handleEditEvent = (event: EventInterface) => {
    dispatch({ type: 'OPEN_FORM', payload: { mode: 'edit', eventId: event.id } });
  };

  const handleFormSave = (event: EventInterface) => {
    if (dashboardState.formMode === 'add') {
      dispatch({ type: 'ADD_EVENT', payload: event });
    } else {
      dispatch({ type: 'EDIT_EVENT', payload: event });
    }
  };

  const handleFormCancel = () => {
    dispatch({ type: 'CLOSE_FORM' });
  };

  const getInitialDataForForm = () => {
    if (dashboardState.formMode === 'edit' && dashboardState.editingEventId) {
      return dashboardState.events.find(e => e.id === dashboardState.editingEventId);
    }
    return undefined;
  };

  return (
    <div className="dashboard-container">
      <h1>Event Manager</h1>
      
      {dashboardState.formOpen && (
        <section className="form-section">
          <h2>{dashboardState.formMode === 'add' ? 'Add New Event' : 'Edit Event'}</h2>
          <EventForm
            onSave={handleFormSave}
            onCancel={handleFormCancel}
            initialData={getInitialDataForForm()}
          />
        </section>
      )}

      {!dashboardState.formOpen && (
        <button onClick={handleAddEvent} className="btn-add-event">
          Add New Event
        </button>
      )}

      <div className="dashboard-content">
        <section className="datagrid-section">
          <h2>Events Grid</h2>
          {dashboardState.status === 'loading' && <p>Loading events...</p>}
          {dashboardState.status === 'error' && <p className="error">Error loading events: {dashboardState.error}</p>}
          {dashboardState.status === 'ready' && (
            <DataGrid
              data={dashboardState.events}
              columns={columns}
              onEditEvent={handleEditEvent}
            />
          )}
        </section>

        <section className="timeline-section">
          <h2>Events Timeline</h2>
          {dashboardState.status === 'ready' && (
            <Timeline
              events={dashboardState.events}
              onEditEvent={handleEditEvent}
            />
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;