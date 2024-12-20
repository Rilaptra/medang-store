"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Phone,
  Link,
  User,
  Book,
  Users,
  Info,
  Image,
  CheckCircle,
  XCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import useTheme from "next-theme";
import { IUser } from "@/lib/db/models/user.model";
import { Badge } from "@/components/ui/badge";

const ProfilePage: React.FC = () => {
  const { data: session } = useSession();
  const [user, setUser] = useState<IUser | null>(null); // nakk share terminal
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<IUser>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { theme } = useTheme();

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      if (!session?.user?.email) {
        setLoading(false);
        return;
      }
      try {
        const response = await fetch(`/api/user`);
        if (!response.ok) {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
        const data = await response.json();
        setUser(data.data);
        setEditFormData({ ...data.data });
      } catch (error: any) {
        toast.error(`Error fetching user data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [session?.user?.email]);

  const handleEditChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setEditFormData({ ...user });
    }
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/user`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editFormData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to update user: ${response.status}`
        );
      }
      const updatedUser = await response.json();
      setUser(updatedUser.data);
      setIsEditing(false);
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const file = e.target.files?.[0];
    if (!file) {
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Failed to upload image: ${response.status}`
        );
      }

      const { secure_url } = await response.json();
      setEditFormData({ ...editFormData, profile_picture: secure_url });
      toast.success("Profile picture uploaded!");
    } catch (error: any) {
      toast.error(`Failed to upload image: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
        <p className="ml-2">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>User not found. Please login first.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 dark:bg-gray-900">
      <div className="mb-8 flex flex-col items-center">
        <div className="relative group cursor-pointer">
          <Avatar className="w-32 h-32 border-2 border-primary">
            {user?.profile_picture ? (
              <AvatarImage src={user?.profile_picture} alt="User Profile" />
            ) : (
              <AvatarFallback>
                {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            )}
          </Avatar>
          {isEditing && (
            <div className="absolute inset-0 flex items-center justify-center group-hover:bg-black group-hover:bg-opacity-50 transition-colors duration-300">
              <Button
                variant="outline"
                size="icon"
                onClick={handleOpenFileDialog}
              >
                <Image className="h-4 w-4 text-gray-800 group-hover:text-white transition-colors duration-300" />
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  className="hidden"
                  accept="image/*"
                />
              </Button>
            </div>
          )}
        </div>
        <h2 className="text-2xl font-semibold mt-2 dark:text-white">
          {user.name || user.username}
        </h2>
        {user.role && (
          <Badge
            variant="default"
            className={`${
              user.role === "admin"
                ? "border-red-500"
                : user.role === "seller"
                ? "border-green-500"
                : "border-gray-500"
            } ${
              user.role === "admin"
                ? "text-red-600"
                : user.role === "seller"
                ? "text-green-600"
                : "text-gray-600"
            } ${
              user.role === "admin"
                ? "bg-red-100"
                : user.role === "seller"
                ? "bg-green-100"
                : "bg-gray-100"
            }`}
          >
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </Badge>
        )}
        {user.verified ? (
          <div className="flex items-center mt-1">
            <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
            <p className="text-sm text-gray-500 dark:text-gray-400">Verified</p>
          </div>
        ) : (
          <div className="flex items-center mt-1">
            <XCircle className="h-4 w-4 text-red-500 mr-1" />
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Not Verified
            </p>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-4">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-800" />
            <Label
              htmlFor="username"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </Label>
          </div>

          <Input
            type="text"
            id="username"
            name="username"
            value={editFormData?.username || ""}
            onChange={handleEditChange}
            disabled={!isEditing}
            className="dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-800" />
            <Label
              htmlFor="name"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Full Name
            </Label>
          </div>

          <Input
            type="text"
            id="name"
            name="name"
            value={editFormData?.name || ""}
            onChange={handleEditChange}
            disabled={!isEditing}
            className="dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-gray-800" />
            <Label
              htmlFor="bio"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Bio
            </Label>
          </div>

          <Textarea
            id="bio"
            name="bio"
            rows={3}
            value={editFormData?.bio || ""}
            onChange={handleEditChange}
            disabled={!isEditing}
            className="dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-gray-800" />
            <Label
              htmlFor="kelas"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Kelas
            </Label>
          </div>

          <Input
            type="text"
            id="kelas"
            name="kelas"
            value={editFormData?.kelas || ""}
            onChange={handleEditChange}
            disabled={!isEditing}
            className="dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Book className="h-4 w-4 text-gray-800" />
            <Label
              htmlFor="nomor_kelas"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Nomor Kelas
            </Label>
          </div>

          <Input
            type="text"
            id="nomor_kelas"
            name="nomor_kelas"
            value={editFormData?.nomor_kelas || ""}
            onChange={handleEditChange}
            disabled={!isEditing}
            className="dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-800" />
            <Label
              htmlFor="phone_number"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Phone Number
            </Label>
          </div>

          <Input
            type="tel"
            id="phone_number"
            name="phone_number"
            value={editFormData?.phone_number || ""}
            onChange={handleEditChange}
            disabled={!isEditing}
            className="dark:bg-gray-800 dark:text-white"
          />
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Link className="h-4 w-4 text-gray-800" />
            <Label
              htmlFor="website_sosmed_link"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Social Media Link
            </Label>
          </div>

          <Input
            type="url"
            id="website_sosmed_link"
            name="website_sosmed_link"
            value={editFormData?.website_sosmed_link || ""}
            onChange={handleEditChange}
            disabled={!isEditing}
            className="dark:bg-gray-800 dark:text- white"
          />
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-gray-800" />
            <Label
              htmlFor="followers"
              className="font-medium text-gray-700 dark:text-gray-300"
            >
              Followers
            </Label>
          </div>
          {user.followers?.length > 0 ? (
            <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
              {user.followers.map((follower) => (
                <li key={follower.toString()}>{follower.toString()}</li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No followers.</p>
          )}
        </div>
      </div>

      <Separator className="my-6 dark:bg-gray-700" />
      <div className="flex justify-end gap-2 ">
        {isEditing ? (
          <>
            <Button variant="outline" className="" onClick={handleToggleEdit}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading}
              className="bg-primary text-gray-800 hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
            >
              {loading ? (
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
              ) : null}
              Save
            </Button>
          </>
        ) : (
          <Button
            onClick={handleToggleEdit}
            className="bg-primary text-gray-800 hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
          >
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
