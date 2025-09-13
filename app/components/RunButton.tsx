"use client";

export default function RunButton() {
  function handleRun() {
    alert("Algorithm will run here!");
    // TODO: call /api/run-algorithm
  }

  return (
    <button
      onClick={handleRun}
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Run Algorithm
    </button>
  );
}
