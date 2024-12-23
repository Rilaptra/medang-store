"use client";
import { useState } from "react";
import { useSession, signIn, SignInOptions } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  FormProvider,
  RegisterOptions,
  useForm,
  useFormContext,
  UseFormRegister,
} from "react-hook-form";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import {
  FaEnvelope,
  FaGlobe,
  FaGraduationCap,
  FaLock,
  FaPhone,
  FaUser,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { BsFillChatSquareTextFill } from "react-icons/bs";

// --- Types ---
interface FormValues extends SignInOptions {
  name?: string;
  bio?: string;
  kelas?: string;
  phone_number?: string;
  website_sosmed_link?: string;
}
interface NewFieldProps {
  name: keyof FormValues;
  type?: string;
  options?: RegisterOptions<FormValues>;
  title?: string;
  icon?: IconType;
}
interface SelectFieldProps {
  name: keyof FormValues;
  icon?: IconType;
}

// --- Constants ---
const CLASS_OPTIONS = ["X", "XI", "XII"].flatMap((item) => {
  const items = [];
  for (let i = 1; i <= 9; i++) {
    if (item === "X") {
      items.push({ value: `${item}-E${i}`, label: `${item}-E${i}` });
    } else if (item === "XII" && i > 8) {
      continue;
    } else {
      items.push({ value: `${item}-F${i}`, label: `${item}-F${i}` });
    }
  }
  return items;
});

// --- Components ---
const NewField: React.FC<NewFieldProps> = ({
  name,
  type = "text",
  options,
  icon,
  title,
}) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<FormValues>();
  const id = String(name);

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="flex justify-start">
        {icon && <span className="mr-2">{icon({})}</span>}
        {title || String(name).charAt(0).toUpperCase() + String(name).slice(1)}
      </Label>
      <Input
        type={type}
        id={id}
        {...register(String(name), options)}
        className={cn(
          "border dark:border-slate-700 focus-visible:ring-2 focus-visible:ring-blue-500 focus:outline-none",
          errors[name] ? "ring-red-500" : ""
        )}
      />
      {errors[name] && errors[name]?.message && (
        <span className="text-red-500 text-xs">
          {typeof errors[name].message === "string"
            ? errors[name].message
            : "An error occured"}
        </span>
      )}
    </div>
  );
};

const SelectField: React.FC<SelectFieldProps> = ({ name, icon }) => {
  const {
    formState: { errors },
    setValue,
  } = useFormContext<FormValues>();
  const id = String(name);

  return (
    <div className="grid gap-2">
      <Label htmlFor={id} className="flex justify-start">
        {icon && <span className="mr-2">{icon({})}</span>}
        {String(name).charAt(0).toUpperCase() + String(name).slice(1)}
      </Label>
      <Select onValueChange={(value) => setValue(String(name), value)}>
        <SelectTrigger
          className={cn("w-full", errors[name] ? "ring-red-500" : "")}
        >
          <SelectValue placeholder={`Select ${String(name)}`} />
        </SelectTrigger>
        <SelectContent>
          {CLASS_OPTIONS.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {errors[name] && errors[name]?.message && (
        <span className="text-red-500 text-xs">
          {typeof errors[name].message === "string"
            ? errors[name].message
            : "An error occured"}
        </span>
      )}
    </div>
  );
};

// --- Main Component ---
export default function Register() {
  const { data: session } = useSession();
  const [error, setError] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOptionalOpen, setIsOptionalOpen] = useState(false);
  const methods = useForm<FormValues>();
  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (result.error) {
        setError(result.error);
        toast.error(result.error);
      } else {
        const {
          name,
          bio,
          kelas,
          phone_number,
          website_sosmed_link,
          ...authData
        } = data;
        signIn("credentials", {
          ...authData,
          callbackUrl: "/",
        });
        toast.success("Signed up successfully");
      }
    } catch (error: any) {
      setError(error);
      console.error("Registration Error:", error);
      toast.error("Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  if (session) {
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
            <CardTitle className="text-center">Register</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <NewField
                name="username"
                type="text"
                options={{
                  required: "Username is required",
                  maxLength: 20,
                  pattern: {
                    value: /^[a-z]{2,}$/,
                    message:
                      "Username must be lowercase and at least 2 characters",
                  },
                }}
                icon={() => <FaUser />}
              />
              <NewField
                name="email"
                type="email"
                icon={() => <FaEnvelope />}
                options={{
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                }}
              />
              <NewField
                name="password"
                type="password"
                icon={() => <FaLock />}
                options={{
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                }}
              />

              <Card>
                <CardHeader>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => setIsOptionalOpen(!isOptionalOpen)}
                  >
                    <Label>Optional Information</Label>
                    <ChevronDown
                      className={cn("h-4 w-4 transition-transform", {
                        "rotate-180": isOptionalOpen,
                      })}
                    />
                  </div>
                </CardHeader>
                {isOptionalOpen && (
                  <CardContent>
                    <div className="grid gap-2 mt-2">
                      <NewField name="name" icon={() => <FaUser />} />
                      <NewField
                        name="bio"
                        icon={() => <BsFillChatSquareTextFill />}
                      />
                      <SelectField
                        name="kelas"
                        icon={() => <FaGraduationCap />}
                      />
                      <NewField
                        name="phone_number"
                        title="Phone Number"
                        icon={() => <FaPhone />}
                      />
                      <NewField
                        name="website_sosmed_link"
                        title="Website / Social Media"
                        icon={() => <FaGlobe />}
                      />
                    </div>
                  </CardContent>
                )}
              </Card>
              <Button type="submit" variant="default" disabled={isLoading}>
                {isLoading ? (
                  <div className="flex items-center">
                    <Loader2 className="animate-spin" />
                    <span className="ml-2">Signing up...</span>
                  </div>
                ) : (
                  "Register"
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
