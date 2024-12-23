"use client";
import { useState, useRef, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Phone, Link, User, Book, Users, Info } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { IUser } from "@/lib/db/models/user.model";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface EditProfileProps {
  user: IUser;
  setUser: React.Dispatch<SetStateAction<IUser | null>>;
}

interface FormValues extends Partial<IUser> {
  kelas: string;
  nomor_kelas: string;
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
const EditProfilePage: React.FC<EditProfileProps> = ({ user, setUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<FormValues>({
    kelas: "",
    nomor_kelas: "",
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };
  const handleSelectChange = (value: string) => {
    setEditFormData({
      ...editFormData,
      kelas: value,
      nomor_kelas: value.match(/(\d)/)?.[1] || "",
    });
  };
  const handleToggleEdit = () => {
    setIsEditing((prev) => !prev);
    if (!isEditing) {
      setEditFormData({
        ...user,
        kelas: user.kelas || "",
        nomor_kelas: user.nomor_kelas || "",
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/users/${user?.username}`, {
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
      const updatedUser = (await response.json()) as {
        data: IUser;
        message: string;
      };
      setUser(updatedUser.data);
      setIsEditing(false);
      toast.success(updatedUser.message);
    } catch (error: any) {
      toast.error(`Failed to update profile: ${error.message}`);
    } finally {
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
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
    }
  };

  const handleOpenFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="container mx-auto p-6 pt-0">
      <div className="flex flex-col gap-6">
        {isEditing && (
          <div className="flex flex-col gap-4 mb-6">
            <Separator className="mb-6 dark:bg-gray-700" />
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
              <Select onValueChange={handleSelectChange} disabled={!isEditing}>
                <SelectTrigger
                  className={cn(
                    "w-full dark:bg-gray-800 dark:text-white",
                    !isEditing && "cursor-not-allowed"
                  )}
                >
                  <SelectValue
                    placeholder={
                      `${editFormData.kelas}${editFormData.nomor_kelas}` ||
                      "Pilih Kelas"
                    }
                    defaultValue={
                      `${editFormData.kelas}${editFormData.nomor_kelas}` || ""
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_OPTIONS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
                <p className="text-gray-500 dark:text-gray-400">
                  No followers.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
      <Separator className="mb-6 dark:bg-gray-700" />
      <div className="flex justify-end gap-2 ">
        {isEditing ? (
          <>
            <Button variant="outline" className="" onClick={handleToggleEdit}>
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="bg-primary text-gray-800 hover:bg-primary/90 dark:bg-primary dark:hover:bg-primary/90"
            >
              Save
            </Button>
          </>
        ) : (
          <Button onClick={handleToggleEdit} variant="default">
            Edit Profile
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditProfilePage;
