export default function EventRow({
  event,
  slots,
  onSlotChange,
  eventColor,
}: {
  event: { name: string; slots: number };
  slots: string[];
  onSlotChange: (idx: number, value: string) => void;
  eventColor: string;
}) {
  return (
    <tr>
      <td className={`border p-2 ${eventColor}`}>{event.name}</td>
      {slots.map((n, idx) => (
        <td key={idx} className="border p-2">
          <input
            value={n}
            onChange={(e) => onSlotChange(idx, e.target.value)}
            placeholder="Name"
            className="border rounded p-1 w-full"
          />
        </td>
      ))}
    </tr>
  );
}
