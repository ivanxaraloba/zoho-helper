"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [xmlInput, setXmlInput] = useState<string>("");
  const [jsonOutput, setJsonOutput] = useState<any>(null); // Use 'any' or create a specific type for your JSON output
  const [error, setError] = useState<string | null>(null); // State for error message

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setJsonOutput(null);

    try {
      const response = await fetch("/api/xml-to-json", {
        method: "POST",
        headers: {
          "Content-Type": "application/xml",
        },
        body: xmlInput,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(JSON.parse(data));

      setJsonOutput(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">XML to JSON Converter</h1>

      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          value={xmlInput}
          onChange={(e) => setXmlInput(e.target.value)}
          placeholder="Enter XML here"
          rows={10}
          cols={50}
          className="border border-gray-300 rounded p-2 w-full"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white rounded px-4 py-2 mt-2"
        >
          Convert
        </button>
      </form>

      {error && <p style={{ color: "red" }}>Error: {error}</p>}
      {jsonOutput && (
        <div>
          <h2 className="text-xl font-semibold">JSON Output:</h2>
          <pre className="bg-gray-100 p-4 rounded border border-gray-300 text-black">
            {JSON.stringify(jsonOutput, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
