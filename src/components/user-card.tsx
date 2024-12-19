import React, { useState } from "react";
import { IUser } from "@/lib/db/models/user.model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, Phone, Users, MoreVertical, VerifiedIcon } from "lucide-react";
import { FaInstagram, FaUserShield, FaUser, FaUserSlash } from "react-icons/fa";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserCardProps {
  user: IUser;
}
const toast = {
  success: (text: any) => console.log(text),
  error: (text: any) => console.log(text),
};
const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const [open, setOpen] = useState(false);

  const handleVerifyUpdate = async () => {
    try {
      const response = await fetch("/api/admin/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, verified: !user.verified }),
      });

      if (response.ok) {
        toast.success(
          `User has been ${
            !user.verified ? "verified" : "unverified"
          } successfully`
        );
        setOpen(false);
        // Consider updating the user state here if needed
        user.verified = !user.verified;
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to update user role: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error: any) {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  const handleRoleUpdate = async (newRole: "admin" | "seller" | "member") => {
    try {
      const response = await fetch("/api/admin/user", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id, role: newRole }),
      });

      if (response.ok) {
        toast.success(`User role updated to ${newRole}`);
        setOpen(false);
        // Consider updating the user state here if needed
        user.role = newRole;
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to update user role: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error: any) {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  const handleDeleteUser = async () => {
    try {
      const response = await fetch("/api/admin/user", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: user._id }),
      });

      if (response.ok) {
        toast.success("User deleted successfully");
        setOpen(false);
        // Consider redirecting or updating the UI here
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to delete user: ${errorData.message || "Unknown error"}`
        );
      }
    } catch (error: any) {
      toast.error(`Failed to delete user: ${error.message}`);
    }
  };

  return (
    <Card className="w-full max-w-md shadow-md bg-white rounded-lg border">
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={
                  user.profile_picture ||
                  "https://i.ibb.co/2dh4YL3/nulprofile.jpg"
                }
                alt={`${user.username} profile picture`}
              />
              <AvatarFallback>
                {user.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            {user.name || user.username}
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

            {user.verified && (
              <VerifiedIcon size={16} className="text-blue-500" />
            )}
          </CardTitle>
          <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild>
              <MoreVertical className="h-4 w-4 cursor-pointer text-gray-500 hover:text-gray-700" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44">
              {!user.verified ? (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleVerifyUpdate()}
                >
                  <VerifiedIcon className="mr-2 h-4 w-4" /> Set as Verified
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleVerifyUpdate()}
                >
                  <VerifiedIcon className="mr-2 h-4 w-4" /> Set as Unverified
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => toast.success("anjayy")}
                className="cursor-pointer text-red-500 focus:text-red-700 hover:bg-red-100"
              >
                <FaUserSlash className="mr-2 h-4 w-4" /> toast anjay
              </DropdownMenuItem>
              {user.role !== "admin" && (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRoleUpdate("admin")}
                >
                  <FaUserShield className="mr-2 h-4 w-4" /> Set as Admin
                </DropdownMenuItem>
              )}
              {user.role !== "seller" && (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRoleUpdate("seller")}
                >
                  <FaUser className="mr-2 h-4 w-4" /> Set as Seller
                </DropdownMenuItem>
              )}
              {user.role !== "member" && (
                <DropdownMenuItem
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleRoleUpdate("member")}
                >
                  <FaUser className="mr-2 h-4 w-4" /> Set as Member
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDeleteUser}
                className="cursor-pointer text-red-500 focus:text-red-700 hover:bg-red-100"
              >
                <FaUserSlash className="mr-2 h-4 w-4" /> Delete Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex  gap-1">
          {user.kelas && user.nomor_kelas && (
            <Badge variant="outline">
              {user.kelas} - {user.nomor_kelas}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {user.bio && (
            <div className="text-sm text-gray-700">
              <p>{user.bio}</p>
            </div>
          )}

          {user.email && (
            <div className="flex items-center text-gray-600  text-sm gap-2">
              <span>📧</span> {user.email}
            </div>
          )}

          {user.phone_number && (
            <div className="flex items-center text-gray-600  text-sm gap-2">
              <Phone size={16} /> {user.phone_number}
            </div>
          )}
          {user.website_sosmed_link && (
            <div className="flex items-center text-gray-600 text-sm  gap-2">
              {user.website_sosmed_link.toLowerCase().includes("instagram") ? (
                <FaInstagram size={16} />
              ) : (
                <Link size={16} />
              )}
              <a
                href={user.website_sosmed_link}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {user.website_sosmed_link.toLowerCase().includes("instagram")
                  ? `@${user.website_sosmed_link.split("/")[3]}`
                  : user.website_sosmed_link}
              </a>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Users size={16} className="text-gray-600" />{" "}
            <span className="font-bold">{user.followers?.length ?? 0}</span>{" "}
            Followers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
