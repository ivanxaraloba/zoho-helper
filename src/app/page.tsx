"use client";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

interface ErrorResponse {
  error: string;
}

export default function Home() {
  const [xmlInput, setXmlInput] = useState<string>("");
  const [responseData, setResponseData] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      const { data } = await axios.post("/api/xml-to-json", xmlInput, {
        headers: { "Content-Type": "application/xml" },
      });
      setResponseData(data.data);
    } catch (err) {
      const errorResponse = err as { response?: { data: ErrorResponse } };
      setError(errorResponse.response?.data.error || "An error occurred");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">
        XML to JSON Converter
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto">
        <textarea
          value={xmlInput}
          onChange={(e) => setXmlInput(e.target.value)}
          placeholder="Paste your XML here..."
          className="w-full h-40 p-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="submit" className="w-full">
          Convert
        </Button>
      </form>

      {error && <p className="text-red-500 text-center mt-6">{error}</p>}
      {responseData && (
        <div className="mt-6 bg-gray-100 p-4 rounded-md">
          <h2 className="text-xl font-semibold">Converted JSON:</h2>
          <pre className="whitespace-pre-wrap break-words mt-2">
            {JSON.stringify(responseData, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
