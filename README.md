# Event Manager

Event management application featuring a data grid, timeline carousel, and an event form for creating and editing events.

## Architecture decisions

### State Management - useReducer
I was initially planning to use a basic useState pattern with setters and multiple useState calls scattered everywhere. But I quickly realized that it was not the best solution, and even though this is a demo app with limited functionality the approach was not suitable even for the size of this project.
In the end I went with a useReducer pattern.
Adding new features (add/edit events, form open/close, loading states) got messy fast. Too many related state updates happening together. So I consolidated into a single reducer with union types.

Using useReducer helped keep all state transitions much more predictable and even though it is more boilerplate up front, using the actions (check DashboardAction) saved a lot of time afterward.

Benefits:
- All state logic lives in one place
- Easier to debug, just look at the reducer to see what actions exist
- Form open/close combined with event data fetch reduces timing issues

### Mock Data Strategy
I created a small mock data generator in the utils folder to keep the demo realistic without wiring a backend or loading a static JSON file. It builds a pool of events by combining a hardcoded list of AI-generated titles, randomized dates within a range, and a rotating status list. This made it easy to test pagination, sorting, filtering, and the timeline carousel without hand‑writing dozens of records.

### Component Design

**DataGrid** - The DataGrid started as a simple table and my initial idea was to manually create columns and populate data, but filtering and sorting would have been much more difficult with individual handlers. That is also why I went for the more complex solution with useReducer.
- Sorting: Click column headers. Can't "unsort" initially, so I added a reset button that resets the sorting state.
- Filtering: Initially I did filtering by text for only title and ID, but eventually added filtering for the status state as well and I decided to go with a select dropdown since it is only 3 options and a much better UX than typing. I also decied to not filter by date as this is handled in the timeline component essentially.
- For pagination I went for 10 items per page and disabled buttons when at boundaries.
- One more note: I initially thought about making the component generic so it could handle any data set, but given the scope of the task I decided to make it event-specific. In a real-world project the component should be generic.

**Timeline** - Initially I had a plain timeline, but UX-wise it made no sense so I refactored to a carousel as a late addition:
- Original idea: Just show events grouped by date in a scrollable vertical list.
- Mid-build I realized that this is not a good way to handle it and I decided to change the structure fully. Display 5 consecutive dates side-by-side with navigation.
- Implementation: Slice the sorted dates array, track carousel index, style as grid columns.
- Keyboard nav: Arrow keys move focus through events. Live region announces selected event for screen readers. In here I made a decision to do Left/Up goes up and Down/Right goes down the list of events instead of Left/Right moving across the days axes. The reason is that the component is semantically a list and not a grid and jumping colums in this case in my opinion breaks predictability.

**EventForm** - I did consider a modal that opens on button click, but due to time limits I prioritized edge case fixes and other enhancements. It would be a good future improvement:
- Validation: Only title and date required. Errors show on submit.
- Focus management: Auto-focus first error field on submit.
- Success handling: Message appears and disappears automatically (not annoying UX).
- ID generation: This took a few different approaches. I started with `crypto.randomUUID()`. Later switched to `events.length` for simplicity and consistency so new IDs are not wildly different from the initial data set.



## How to Run

```bash
# Install dependencies
npm install

# Start dev server (hot reload on file changes)
npm run dev

# Build for production
npm run build
```

Then visit http://localhost:5173 (or whatever Vite tells you. I was having issues with Vite running on my local with the default script. Running `npx vite --host 127.0.0.1 --port 5173` helped to solve the issue.).

## File Structure

- **contracts/** - TypeScript interfaces for type safety across components
- **reducers/** - DashboardReducer with all state logic
- **components/** - Reusable DataGrid, Timeline, EventForm with their own CSS
- **hooks/** - useTheme for managing light/dark mode
- **utils/** - mockData generator, helpers
- **index.css** - Global styles, CSS variable definitions, dark theme colors
