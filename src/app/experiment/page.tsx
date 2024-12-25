// components/ExperimentArea.tsx
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

interface ResponseData {
  message: string;
}
const ExperimentArea: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleClick = async () => {
    setIsLoading(true);
    setError(null);
    setMessage(null);

    try {
      const response = await fetch("/api/josep/escuh", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = (await response.json()) as ResponseData;
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      const data = (await response.json()) as ResponseData;
      setMessage(data.message);
      console.log(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <Button variant="ghost" onClick={handleClick} disabled={isLoading}>
        {isLoading ? "Loading..." : "Trigger Server"}
      </Button>
      {message && <p>Server Response: {message}</p>}
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};

export default ExperimentArea;
