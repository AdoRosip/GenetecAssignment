import { EventInterface, EventStatus } from "../contracts";

const TITLE_EXAMPLE_IDEAS = [
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

const STATUSES = ['completed', 'in-progress', 'not-started']

const today = new Date();
const randomDays = Math.floor(Math.random() * 90) - 60; // -60 to +30 days
const date = new Date(today);
date.setDate(date.getDate() + randomDays);