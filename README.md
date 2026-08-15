# Science Olympiad Roster Builder

Automatically generate an optimized 15-student Science Olympiad competition roster from a spreadsheet of student data — no more manually cross-referencing preferences, placements, and scheduling conflicts by hand.

---

## What it does

Building a Science Olympiad roster involves balancing a lot of constraints simultaneously: student event preferences, past competition performance, grade-level eligibility rules, event scheduling conflicts, and making sure every student gets a fair, valid event load. This tool automates the entire process:

1. **Scores students for each event** based on their stated preferences, past competition placements, and years of experience.
2. **Selects the top-scoring students** for each event while enforcing a **maximum of 7 seniors** on the roster.
3. **Groups events into scheduling blocks** so no student is assigned two events that run at the same time.
4. **Assigns students to events in score order**, respecting per-event slot limits and block conflicts.
5. **Fills in under-assigned students** — anyone with fewer than the minimum required events (3–4 per student) is randomly placed into an available, non-conflicting event.
6. **Supports prefilled events** — if certain students are already locked into specific events ahead of time, those assignments count toward their total and are respected during scoring and placement.
7. **Outputs the final roster**, the list of selected students, and each student's total event count.

---

## Roster rules enforced

- **15 students** total on the final roster
- **Maximum 7 seniors** (12th graders)
- **3–4 events per student**
- **Event slot limits** — each event only holds so many competitors
- **Block/scheduling conflicts** — students can't be double-booked into two events happening at the same time
- **Prefilled events** are honored and counted toward each student's total before the algorithm assigns the rest

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

You can also **manually enter students by hand** in the interface as a way to "seed" the roster — useful for locking in specific students or event assignments before running the automated selection/assignment process.

---

## Usage

1. Prepare your spreadsheet with the columns above (one row per student).
2. Open the tool and click **Choose File** to upload your spreadsheet.
3. *(Optional)* Manually add or seed specific students/events directly in the interface.
4. Run the roster generator.
5. Review the output:
   - The final **15-student roster** with event assignments
   - The list of **selected students**
   - Each student's **total event count**

---

## Why use this

Manually building a roster that respects preferences, past performance, seniority caps, and scheduling constraints is tedious and error-prone — especially as team size and event count grow. This tool turns that process into a repeatable, data-driven algorithm, so coaches and team captains can generate a fair, conflict-free roster in a fraction of the time.

---

## License

This project is licensed under the terms of the MIT license.
