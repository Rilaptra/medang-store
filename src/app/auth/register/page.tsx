"use client";
import { useState } from "react";
import { useSession, signIn, SignInOptions } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";

export default function Register() {
  const { data: session } = useSession();
  const [error, setError] = useState(null);
  const methods = useForm();

  const onSubmit = async (data: SignInOptions | undefined) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.error) {
        setError(result.error);
        alert(result.error);
      } else {
        signIn("credentials", { ...data, callbackUrl: "/" });
        alert("success");
      }
    } catch (error: any) {
      setError(error);
    }
  };

  if (session) {
    return <p>You are already signed in.</p>;
  }

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="flex flex-col gap-4 p-6 rounded-lg shadow-md bg-white dark:bg-gray-800 w-full max-w-md mx-auto my-5"
      >
        <div className="flex flex-col">
          <label
            htmlFor="username"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Username
          </label>
          <input
            type="text"
            id="username"
            {...methods.register("username", {
              required: "Username is required",
            })}
            className="mt-1 p-2 border rounded-md w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {methods.formState.errors.username?.message && (
            <span className="text-red-500 text-xs">
              {typeof methods.formState.errors.username.message === "string"
                ? methods.formState.errors.username.message
                : "An error occured"}
            </span>
          )}{" "}
        </div>
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
            className="mt-1 p-2 border rounded-md w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
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
            className="mt-1 p-2 border rounded-md w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {methods.formState.errors.password && (
            <span className="text-red-500 text-xs">
              {typeof methods.formState.errors.password.message === "string"
                ? methods.formState.errors.password.message
                : "An error occured"}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            {...methods.register("name", { required: "Name is required" })}
            className="mt-1 p-2 border rounded-md w-full text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          {methods.formState.errors.name && (
            <span className="text-red-500 text-xs">
              {typeof methods.formState.errors.name.message === "string"
                ? methods.formState.errors.name.message
                : "An error occured"}
            </span>
          )}
        </div>
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Register
        </Button>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </form>
    </FormProvider>
  );
}
