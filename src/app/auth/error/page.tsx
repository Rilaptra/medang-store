"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, ClipboardCopy } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function ErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [decodedError, setDecodedError] = useState<string | null>(null);

  useEffect(() => {
    if (error) {
      try {
        setDecodedError(decodeURIComponent(error));
      } catch (e) {
        setDecodedError(error);
      }
    }
  }, [error]);

  if (!error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>No Error Provided</AlertTitle>
          <AlertDescription>No error was provided in the URL.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center h-screen">
      <Card className="w-[600px shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            Error Details
          </CardTitle>
          <CardDescription>
            Detailed information about the error.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2 relative">
            <h4 className="text-lg font-semibold">Error Message:</h4>
            <pre className="block overflow-x-auto whitespace-pre-wrap text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded">
              <code>{decodedError}</code>
            </pre>
            <button
              className="absolute top-1 right-1 p-1 active:text-gray-900 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              onClick={() => {
                if (decodedError) {
                  navigator.clipboard.writeText(decodedError);
                }
              }}
            >
              <ClipboardCopy className="h-4 w-4" />
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
