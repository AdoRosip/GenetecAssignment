import { useEffect, useRef, useState } from "react"
import type { EventInterface, EventStatus } from "../../contracts"
import "./EventForm.css"

interface EventFormPropsInterface {
    onSave: (event: EventInterface) => void
    onCancel: () => void
    initialData?: EventInterface
    nextId: string
}

export const EventForm = ({onSave, onCancel, initialData, nextId}: EventFormPropsInterface) => {
    const titleRef = useRef<HTMLInputElement>(null)
    const dateRef = useRef<HTMLInputElement>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null) 
    const [formData, setFormData] = useState<{
        title: string;
        date: string;
        status: EventStatus;
    }>
        ({
            title: initialData?.title || '',
            date: initialData?.date || '',
            status: initialData?.status || 'not-started'
        });
    const [errors, setErrors] = useState<{title?: string; date?: string}>({})
    const possibleStatus:EventStatus[] = ['completed', 'in-progress', 'not-started']

    function validateForm(): boolean {
        const newErrors: {title?: string; date?: string} = {}
        
        if (!formData.title.trim()) {
            newErrors.title = 'Title is required'
        }
        
        if (!formData.date) {
            newErrors.date = 'Date is required'
        }
        
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
       e.preventDefault()

       if (!validateForm()) {
           return
       }

       const eventToSave: EventInterface = {
        id: initialData?.id || nextId,
        ...formData
       }

       onSave(eventToSave)
       setSuccessMessage('Your event has been successfully added!')
    }

    useEffect(() => {       
        if(errors.title) {
            titleRef.current?.focus()
        }
        else if(errors.date) dateRef.current?.focus()
    },[errors])

    useEffect(() => {
        if(successMessage) setTimeout(() => setSuccessMessage(null), 5000)
    },[successMessage])

        return (
        <div className="eventForm-container">
            <form onSubmit={handleSubmit}>
                <label htmlFor='event-title' >Title</label>
                <input ref={titleRef} type="text" id='event-title' value={formData.title} onChange={(e) => {
                    setFormData(prev => ({ ...prev, title: e.target.value }))
                    if (errors.title) setErrors(prev => ({ ...prev, title: undefined }))
                }} />
                {errors.title && <span className="error">{errors.title}</span>}
                <label htmlFor='event-date'>Date</label>
                {/**If i have time maybe use some more fancy lib datepicker*/}
                <input ref={dateRef} type="date" id='event-date' value={formData.date} onChange={(e) => {
                    setFormData(prev => ({ ...prev, date: e.target.value }))
                    if (errors.date) setErrors(prev => ({ ...prev, date: undefined }))
                }} />
                {errors.date && <span className="error">{errors.date}</span>}
                <label htmlFor='event-status'>Status</label>
                <select id="event-status" value={formData.status} onChange={(e) => setFormData(prev => ({...prev, status: e.target.value as EventStatus}))}>
                    <option value="">Select status</option>
                    {possibleStatus.map((status) => (
                        <option key={status} value={status}>{status}</option>
                    ))}
                </select>
                <div className="form-buttons">
                    <button type="submit">Submit</button>
                    <button type="button" onClick={onCancel}>Cancel</button>
                </div>
            </form>
            {successMessage && <div role="status" aria-live="polite" aria-atomic="true"><h3>{successMessage}</h3></div>}
        </div>
    )

}