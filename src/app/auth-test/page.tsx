"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function AuthTestPage() {
  const [result, setResult] = useState("Not tested yet");
  const [loading, setLoading] = useState(false);

  async function testAuthentication() {
    setLoading(true);
    setResult("Testing authentication...");

    try {

      const { data, error } = await authClient.token();

      if (error || !data?.token) {
        setResult(
          `Failed to obtain JWT: ${error?.message ?? "No token returned"}`,
        );
        return;
      }

     const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured");
}

const response = await fetch(`${apiUrl}/api/auth-test`, {
        headers: {
          Authorization: `Bearer ${data.token}`,
        },
      });

      const body = await response.json();

     
      setResult(
        JSON.stringify(
          {
            status: response.status,
            response: body,
          },
          null,
          2,
        ),
      );
    } catch (error) {
      setResult(error instanceof Error ? error.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8">
      <h1 className="mb-4 text-2xl font-bold">JWT Authentication Test</h1>

      <button
        onClick={testAuthentication}
        disabled={loading}
        className="rounded bg-green-700 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Testing..." : "Test Authentication"}
      </button>

      <pre className="mt-6 whitespace-pre-wrap break-words rounded bg-gray-100 p-4 text-black">
        {result}
      </pre>
    </main>
  );
}
