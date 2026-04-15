# HCDR Quiz App

Standalone Next.js app for the "Understand Your Catheter Needs" assessment.

## Run locally

1. Install Node.js 18.18+ or 20+.
2. Install dependencies:
   - `npm install`
3. Copy env vars:
   - `cp .env.example .env.local`
4. Add the required images to `public/images/` (see `public/images/README.md`).
5. Start development server:
   - `npm run dev`

## Pages

- `/` landing page
- `/quiz` 8-step assessment
- `/results` profile result (A, B, C)
- `/contact` consent form and referral submission
- `/thank-you` confirmation page

## API

- `POST /api/submit`: validates inputs and appends submission rows to Google Sheets.
- `POST /api/track`: writes quiz funnel events (results viewed, connect clicked, guide clicked, start over, contact submitted).

## Google Sheets tabs

Create these tabs in your spreadsheet:

- `Sheet1` for leads (columns A:R):
  - Timestamp | First Name | Last Name | Email | Phone | Current Provider | Q1 Experience | Q2 Frequency | Q3 Frustration | Q4 Choice Awareness | Q5 Lifestyle | Q6 Priority | Q7 Supply Method | Q8 Satisfaction | Result Profile | Guide Consent | Referral Consent
- `Events` for funnel analytics (columns A:D):
  - Timestamp | Session ID | Event Type | Profile
- `quiz_responses` for quiz-only captures (users who reach results without submitting contact details):
  - created_at | session_id | result_profile | q1 | q2 | q3 | q4 | q5 | q6 | q7 | q8
