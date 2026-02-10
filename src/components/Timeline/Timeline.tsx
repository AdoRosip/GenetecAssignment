import type { EventInterface } from "../../contracts"

interface TimelinePropsInterface {
    events: EventInterface[]
    isLoading: boolean
    error: string
}

export const Timeline = ({events, isLoading, error}: TimelinePropsInterface) => {
    const groupedEvents = groupEvents()
    const sortedGroupedByDate = sortDays()

    function groupEvents() {
        const eventObject: Record<string, EventInterface[]> = {}
        for(const event of events) {
            if(eventObject[event.date]) {
                eventObject[event.date] = [...eventObject[event.date], event]
            }
            else {
                eventObject[event.date] = [event]
            }
        }
        return eventObject
    }

    function sortDays() {
        const sortedEntries = Object.entries(groupedEvents)
            .map(([dateKey, dayEvents]) => {
                const sortedDayEvents = [...dayEvents].sort((a, b) => a.title.localeCompare(b.title))
                return [dateKey, sortedDayEvents] as const
            })
            .sort(([dateA], [dateB]) => dateA.localeCompare(dateB));

        const sortedGroupedByDate = Object.fromEntries(sortedEntries);
        return sortedGroupedByDate
    }

      // maybe if time handle this with some spinners MUI? 
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

    const renderEmpty = () => {
        return (
            <div className="empty-container">
            <h2>No events found</h2>
            <p>Try adjusting your filters</p>
            </div>
        );
    };
    
    
    const sortedDates = Object.keys(sortedGroupedByDate)

    return (
        <div className="timeline-container">
            {isLoading ? renderLoading() : error ? renderError() : sortedDates.length === 0 ? renderEmpty() : (
                <div className="timeline-groups">
                    {sortedDates.map((dateKey) => (
                        <section key={dateKey} className="timeline-group">
                            <h3 className="timeline-date">{dateKey}</h3>
                            <ul className="timeline-events">
                                {sortedGroupedByDate[dateKey].map((event) => (
                                    <li key={event.id} className="timeline-event">
                                        <div className="timeline-event-title">{event.title}</div>
                                        <div className="timeline-event-meta">{event.status}</div>
                                    </li>
                                ))}
                            </ul>
                        </section>
                    ))}
                </div>
            )}
        </div>
    )
}