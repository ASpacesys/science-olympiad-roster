# SciOly Rostermaking Tool

**Automatically generate an optimized 15-student Science Olympiad competition roster from a spreadsheet of student data.**

🔗 **Live demo:** [science-olympiad-rostermaking-tool.vercel.app](https://science-olympiad-rostermaking-tool.vercel.app/)

Building a Science Olympiad team roster by hand means juggling dozens of constraints at once — student event preferences, past competition performance, grade-level eligibility limits, event scheduling conflicts, and making sure every student ends up with a fair, valid event load. This tool automates that entire process: upload a spreadsheet of student data and get back a competition-ready roster in seconds.

---

## How it works

1. **Scores students for each event** based on their stated preferences, past competition placements, and years of experience.
2. **Selects the top-scoring students** for each event while enforcing a **maximum of 7 seniors** on the 15-student roster.
3. **Groups events into scheduling blocks** so no student is double-booked into two events running at the same time.
4. **Assigns students to events in score order**, respecting per-event slot limits and block conflicts.
5. **Fills in under-assigned students** — anyone below the minimum event requirement (3–4 events per student) is randomly placed into an available, non-conflicting event.
6. **Honors prefilled events** — students already locked into specific events beforehand have those assignments counted toward their total before the rest of the roster is generated.
7. **Outputs the final roster**, the list of selected students, and each student's total event count.

---

## Roster rules enforced

- **15 students** total on the final roster
- **Maximum 7 seniors** (12th graders)
- **3–4 events per student**
- **Event slot limits** per event
- **Block/scheduling conflicts** — no student is assigned two events happening at the same time
- **Prefilled events** are respected and counted before automated assignment runs

---

## Input format

Upload a spreadsheet (`.csv` / `.xlsx`) with the following columns:

| Column | Description |
|---|---|
| `Name` | Student's full name |
| `Grade` | Grade level (e.g. `9`–`12`) |
| `Events` | Comma-separated list of events the student has selected or participated in |
| `Placements` | Competition placement per event, formatted as `Event:Place`, comma-separated |
| `Years` | Number of years the student has competed |

**Example row:**

| Name | Grade | Events | Placements | Years |
|---|---|---|---|---|
| Jane Doe | 12 | Chemistry Lab, Forensics, Experimental Design | Chemistry Lab:1, Forensics:10, Experimental Design:24 | 3 |

You can also **manually add students** directly in the app as a way to "seed" the roster — useful for locking in specific students or assignments before the automated selection and assignment process runs.

---

## Usage

### Online (no setup required)
Just go to **[science-olympiad-rostermaking-tool.vercel.app](https://science-olympiad-rostermaking-tool.vercel.app/)**, upload your spreadsheet, and generate your roster directly in the browser.

### Running locally

```bash
git clone https://github.com/ASpacesys/science-olympiad-roster.git
cd science-olympiad-roster
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Why use this

Manually building a roster that respects preferences, past performance, seniority caps, and scheduling constraints is tedious and error-prone, especially as team size and event count grow. This tool turns that process into a repeatable, transparent, data-driven algorithm — so coaches and team captains can generate a fair, conflict-free roster in a fraction of the time it would take by hand.

---

## Contributing

Issues and pull requests are welcome. If you have suggestions for improving the scoring formula, tie-breaking logic, or UI, feel free to open an issue.

---

## License

This project is licensed under the terms of the MIT license.
