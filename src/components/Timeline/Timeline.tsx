import { useEffect, useRef, useState } from "react"
import type { EventInterface } from "../../contracts"
import "./Timeline.css"

interface TimelinePropsInterface {
    events: EventInterface[]
    isLoading?: boolean
    error?: string
    onEditEvent?: (event: EventInterface) => void
}

export const Timeline = ({events, isLoading, error, onEditEvent}: TimelinePropsInterface) => {
    const [carouselIndex, setCarouselIndex] = useState(0)
    const DATES_TO_SHOW = 5
    const groupedEvents = groupEvents()
    const sortedGroupedByDate = sortDays()
    const flatListOfEvents = Object.values(sortedGroupedByDate).flat();
    const sortedDates = Object.keys(sortedGroupedByDate)

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


    
    // Get slice of dates for carousel
    const displayedDates = sortedDates.slice(carouselIndex, carouselIndex + DATES_TO_SHOW)
    const canGoNext = carouselIndex + DATES_TO_SHOW < sortedDates.length
    const canGoPrev = carouselIndex > 0

    const [focusedIndex, setFocusedIndex] = useState(0)
    const [liveMessage, setLiveMessage] = useState("")
    const itemRefs = useRef<Array<HTMLLIElement | null>>([])
    const eventIndexById = new Map(flatListOfEvents.map((event, index) => [event.id, index]))

    const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr + 'T00:00:00')
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', weekday: 'short' })
    }

    useEffect(() => {
        setFocusedIndex(0)
    },[events.length])

    useEffect(() => {
        const target = itemRefs.current[focusedIndex]
        if (target) {
            target.focus()
        }
    }, [focusedIndex])

    useEffect(() => {
        const focusedEvent = flatListOfEvents[focusedIndex]
        if (focusedEvent) {
            const formattedDate = formatDate(focusedEvent.date)
            setLiveMessage(`Day ${formattedDate}. ${focusedEvent.title}, ${focusedEvent.status}`)
        }
    }, [focusedIndex, flatListOfEvents])

    const handleItemKeyDown = (event: React.KeyboardEvent) => {
        if (flatListOfEvents.length === 0) return

        if (event.key === "ArrowDown" || event.key === "ArrowRight") {
            event.preventDefault()
            setFocusedIndex((prev) => Math.min(prev + 1, flatListOfEvents.length - 1))
        }

        if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
            event.preventDefault()
            setFocusedIndex((prev) => Math.max(prev - 1, 0))
        }
    }

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


    return (
        <div className="timeline-wrapper">
            <div className="sr-only" aria-live="polite">{liveMessage}</div>
            {isLoading ? renderLoading() : error ? renderError() : sortedDates.length === 0 ? renderEmpty() : (
                <>
                <div className="timeline-navigation">
                    <button 
                        onClick={() => setCarouselIndex(Math.max(0, carouselIndex - 1))}
                        disabled={!canGoPrev}
                        className="timeline-nav-btn"
                    >
                        ← Prev
                    </button>
                    <span className="timeline-date-range">
                        {displayedDates.length > 0 
                            ? `${formatDate(displayedDates[0])} - ${formatDate(displayedDates[displayedDates.length - 1])}`
                            : 'No dates'}
                    </span>
                    <button 
                        onClick={() => setCarouselIndex(carouselIndex + 1)}
                        disabled={!canGoNext}
                        className="timeline-nav-btn"
                    >
                        Next →
                    </button>
                </div>

                <div className="timeline-carousel">
                    {displayedDates.map((dateKey) => (
                        <div key={dateKey} className="timeline-column">
                            <h3 className="timeline-column-date">{formatDate(dateKey)}</h3>
                            <ul className="timeline-column-events" role="list">
                                {sortedGroupedByDate[dateKey].map((event) => {
                                    const globalIndex = eventIndexById.get(event.id) ?? 0
                                    return (
                                        <li
                                            key={event.id}
                                            ref={(element) => {
                                                itemRefs.current[globalIndex] = element
                                            }}
                                            aria-label={`${event.title} ${event.status} ${event.date}`}
                                            tabIndex={focusedIndex === globalIndex ? 0 : -1}
                                            className="timeline-event"
                                            onFocus={() => setFocusedIndex(globalIndex)}
                                            role="listitem"
                                            onKeyDown={handleItemKeyDown}
                                        >
                                            <div className="timeline-event-content">
                                                <div className="timeline-event-title">{event.title}</div>
                                                <div className="timeline-event-meta">{event.status}</div>
                                            </div>
                                            {onEditEvent && (
                                                <button onClick={() => onEditEvent(event)} className="timeline-event-edit">Edit</button>
                                            )}
                                        </li>
                                    )
                                })}
                            </ul>
                        </div>
                    ))}
                </div>
                </>
            )}
        </div>
    )
}