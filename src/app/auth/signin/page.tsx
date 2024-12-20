"use client";
import { useState, useEffect } from "react";
import { useSession, signIn, SignInOptions } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Login() {
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const methods = useForm();
  const router = useRouter();

  const onSubmit = async (data: SignInOptions | undefined) => {
    try {
      signIn(
        "credentials",
        {
          ...data,
        },
        {
          callbackUrl: "/",
        }
      );
      toast.success("Signed in successfully");
    } catch (error: any) {
      setError(error);
    }
  };

  if (session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            You are already signed in.
          </h2>
          <Button onClick={() => router.push("/")} className="w-full">
            Go Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="bg-white dark:bg-gray-800 p-8 rounded shadow-md w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 text-center">
            Sign In
          </h2>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="flex flex-col gap-4"
          >
            <div className="flex flex-col">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                {...methods.register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className="mt-1 p-3 border rounded-md w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {methods.formState.errors.email && (
                <span className="text-red-500 text-xs">
                  {typeof methods.formState.errors.email.message === "string"
                    ? methods.formState.errors.email.message
                    : "An error occured"}
                </span>
              )}
            </div>
            <div className="flex flex-col">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                {...methods.register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                className="mt-1 p-3 border rounded-md w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
              {methods.formState.errors.password && (
                <span className="text-red-500 text-xs">
                  {typeof methods.formState.errors.password.message === "string"
                    ? methods.formState.errors.password.message
                    : "An error occured"}
                </span>
              )}
            </div>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </Button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    </FormProvider>
  );
}
