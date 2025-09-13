// app/page.tsx
import FileUpload from "./components/FileUpload";
import EventTable from "./components/EventTable";
import RunButton from "./components/RunButton";

export default function Home() {
  return (
    <main className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Science Olympiad Team Builder</h1>
      <FileUpload />
      <div className="mt-6">
        <EventTable />
      </div>
      <div className="mt-6">
        <RunButton />
      </div>
    </main>
  );
}
