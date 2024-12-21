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
import useTheme from "next-theme";

interface UserCardProps {
  user: IUser;
  handleVerifyUpdate: (user: IUser) => void;
  handleDeleteUser: (user: IUser) => void;
  handleRoleUpdate: (
    user: IUser,
    newRole: "admin" | "member" | "seller"
  ) => void;
}

const UserCard: React.FC<UserCardProps> = ({
  user,
  handleVerifyUpdate,
  handleDeleteUser,
  handleRoleUpdate,
}) => {
  const [open, setOpen] = useState(false);
  const { theme } = useTheme();

  const isDark = theme === "dark";

  return (
    <Card
      className={`w-full max-w-md shadow-md rounded-lg border ${
        isDark ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle
            className={`text-xl font-semibold flex items-center gap-2 ${
              isDark ? "text-white" : "text-gray-800"
            }`}
          >
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
                    : "text-gray-600 dark:text-gray-300"
                } ${
                  user.role === "admin"
                    ? "bg-red-100"
                    : user.role === "seller"
                    ? "bg-green-100"
                    : "bg-gray-100"
                } ${isDark ? "dark:bg-opacity-20" : ""}`}
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
              <MoreVertical
                className={`h-4 w-4 cursor-pointer ${
                  isDark
                    ? "text-gray-400 hover:text-gray-300"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`transition w-44 ${
                isDark ? "bg-gray-700" : "bg-white"
              }`}
            >
              {!user.verified ? (
                <DropdownMenuItem
                  className={`cursor-pointer ${
                    isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleVerifyUpdate(user)}
                >
                  <VerifiedIcon className="mr-2 h-4 w-4" /> Set as Verified
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem
                  className={`cursor-pointer ${
                    isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleVerifyUpdate(user)}
                >
                  <VerifiedIcon className="mr-2 h-4 w-4" /> Set as Unverified
                </DropdownMenuItem>
              )}
              {user.role !== "admin" && (
                <DropdownMenuItem
                  className={`cursor-pointer ${
                    isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleRoleUpdate(user, "admin")}
                >
                  <FaUserShield className="mr-2 h-4 w-4" /> Set as Admin
                </DropdownMenuItem>
              )}
              {user.role !== "seller" && (
                <DropdownMenuItem
                  className={`cursor-pointer ${
                    isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleRoleUpdate(user, "seller")}
                >
                  <FaUser className="mr-2 h-4 w-4" /> Set as Seller
                </DropdownMenuItem>
              )}
              {user.role !== "member" && (
                <DropdownMenuItem
                  className={`cursor-pointer ${
                    isDark ? "hover:bg-gray-600" : "hover:bg-gray-100"
                  }`}
                  onClick={() => handleRoleUpdate(user, "member")}
                >
                  <FaUser className="mr-2 h-4 w-4" /> Set as Member
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={() => handleDeleteUser(user)}
                className={`cursor-pointer ${
                  isDark
                    ? "text-red-400 focus:text-red-500 hover:bg-red-700"
                    : "text-red-500 focus:text-red-700 hover:bg-red-100"
                }`}
              >
                <FaUserSlash className="mr-2 h-4 w-4" /> Delete Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex  gap-1">
          {user.kelas && user.nomor_kelas && (
            <Badge
              variant="outline"
              className={isDark ? "border-gray-600 text-gray-400" : ""}
            >
              {user.kelas}
              {user.nomor_kelas}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {user.bio && (
            <div
              className={`text-sm  ${
                isDark ? "text-gray-400" : "text-gray-700"
              }`}
            >
              <p>{user.bio}</p>
            </div>
          )}

          {user.email && (
            <div
              className={`flex items-center  text-sm gap-2 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <span>📧</span> {user.email}
            </div>
          )}

          {user.phone_number && (
            <div
              className={`flex items-center  text-sm gap-2 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              <Phone size={16} /> {user.phone_number}
            </div>
          )}
          {user.website_sosmed_link && (
            <div
              className={`flex items-center text-sm  gap-2 ${
                isDark ? "text-gray-400" : "text-gray-600"
              }`}
            >
              {user.website_sosmed_link.toLowerCase().includes("instagram") ? (
                <FaInstagram size={16} />
              ) : (
                <Link size={16} />
              )}
              <a
                href={user.website_sosmed_link}
                target="_blank"
                rel="noopener noreferrer"
                className={`hover:underline ${
                  isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-800"
                }`}
              >
                {user.website_sosmed_link.toLowerCase().includes("instagram")
                  ? `@${user.website_sosmed_link.split("/")[3]}`
                  : user.website_sosmed_link}
              </a>
            </div>
          )}
          <div
            className={`flex items-center gap-2 ${
              isDark ? "text-gray-400" : "text-gray-600"
            }`}
          >
            <Users size={16} />{" "}
            <span className="font-bold">{user.followers?.length ?? 0}</span>{" "}
            Followers
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default UserCard;
