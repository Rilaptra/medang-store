"use client";
import { useState } from "react";
import { useSession, signIn, SignInOptions } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { FormProvider, useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export default function Login() {
  const { data: session, status } = useSession();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const methods = useForm<SignInOptions>();
  const router = useRouter();

  const onSubmit = async (data: SignInOptions | undefined) => {
    try {
      setIsLoading(true);
      await signIn("credentials", {
        ...data,
        callbackUrl: "/",
      });
      toast.success("Signed in successfully");
    } catch (error: any) {
      setError(error);
      toast.error("Sign in failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-black">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Loading...</CardTitle>
          </CardHeader>
        </Card>
      </div>
    );
  }

  if (status === "authenticated") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-black">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">
              You are already signed in.
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <Button onClick={() => router.push("/")} className="w-full">
              Go Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100 dark:bg-black">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="grid gap-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <FaEnvelope />
                  Username
                </Label>
                <Input
                  type="username"
                  id="username"
                  {...methods.register("username", {
                    required: "Username is required",
                    pattern: {
                      value: /^[a-z]+$/,
                      message: "Invalid username address",
                    },
                  })}
                  className={cn(
                    "border dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none",
                    methods.formState.errors.username ? "ring-red-500" : ""
                  )}
                />
                {methods.formState.errors.username && (
                  <span className="text-red-500 text-xs">
                    {typeof methods.formState.errors.username.message ===
                    "string"
                      ? methods.formState.errors.username.message
                      : "An error occured"}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <FaLock />
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  {...methods.register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  className={cn(
                    "border dark:border-slate-700 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none",
                    methods.formState.errors.password ? "ring-red-500" : ""
                  )}
                />
                {methods.formState.errors.password && (
                  <span className="text-red-500 text-xs">
                    {typeof methods.formState.errors.password.message ===
                    "string"
                      ? methods.formState.errors.password.message
                      : "An error occured"}
                  </span>
                )}
              </div>
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin" />
                    <span className="ml-2">Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </form>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
