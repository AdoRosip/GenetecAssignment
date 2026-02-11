import type { EventInterface, EventStatus } from "../contracts";

const MOCK_TITLE_EXAMPLE_IDEAS = [
  'Team sync meeting',
  'Project kickoff',
  'Design review',
  'Sprint planning',
  'Release preparation',
  'Stakeholder update',
  'Bug triage',
  'Code review session',
  'Architecture discussion',
  'Retrospective meeting'
]

const STATUSES: EventStatus[] = ['completed', 'in-progress', 'not-started']

const toIsoDate = (date: Date) => date.toISOString().slice(0, 10);

// Date format parsing helper - if time -> handle range a bit cleanly
export const randomIsoDate = (minDaysFromToday = -20, maxDaysFromToday = 20) => {
  const today = new Date();
  const range = maxDaysFromToday - minDaysFromToday + 1;
  const offset = Math.floor(Math.random() * range) + minDaysFromToday;
  const d = new Date(today);
  d.setDate(d.getDate() + offset);
  return toIsoDate(d);
};

//Generate a single event
export const generateRandomEvent = (id: string): EventInterface => {
    const randomTitleIndex = Math.floor(Math.random() * MOCK_TITLE_EXAMPLE_IDEAS.length)
    const randomDate = randomIsoDate()
    const randomStatusIndex = Math.floor(Math.random() * STATUSES.length)
    // Could be worth the time to enhance the title/desc generation to avoid all events looking the same if I have time
    return {
        id: id,
        title: MOCK_TITLE_EXAMPLE_IDEAS[randomTitleIndex],
        date: randomDate,
        status: STATUSES[randomStatusIndex],
    }
}

// Mock data generator - if time refactor forr more dynamic style of generator 
export const generateMockEvents = (count = 150): EventInterface[] => {
    const events = Array.from({length:count}, (_, index) => generateRandomEvent(index.toString()))
    return events
}

//ffetch similation for the different states - to be checked if needed. 
export const fetchMockEvents = (): Promise<EventInterface[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(generateMockEvents(300));
    }, 1000);
  });
};