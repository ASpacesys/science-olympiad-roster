import EventRow from "./EventRow";

const events = [
  { name: "Chemistry Lab", slots: 2 },
  { name: "Codebusters", slots: 3 },
  { name: "Experimental Design", slots: 3 },
  { name: "Circuit Lab", slots: 2 },
];

export default function EventTable() {
  return (
    <table className="w-full border-collapse border mt-4">
      <thead>
        <tr>
          <th className="border p-2 text-left">Event</th>
          <th className="border p-2">Competitors</th>
        </tr>
      </thead>
      <tbody>
        {events.map((event) => (
          <EventRow key={event.name} event={event} />
        ))}
      </tbody>
    </table>
  );
}
