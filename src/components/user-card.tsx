import React, { useState } from "react";
import { IUser } from "@/lib/db/models/user.model";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Phone, Users, MoreVertical, VerifiedIcon } from "lucide-react";
import { FaInstagram, FaUserShield, FaUser, FaUserSlash } from "react-icons/fa";
import { HiOutlineClipboardCopy } from "react-icons/hi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useTheme from "next-theme";
import { toast } from "sonner";
import Link from "next/link";
import { IoMdLink } from "react-icons/io";

interface UserCardProps {
  user: IUser;
  handleVerifyUpdate: (user: IUser) => void;
  handleDeleteUser: (user: IUser) => void;
  handleRoleUpdate: (
    user: IUser,
    newRole: "admin" | "member" | "seller"
  ) => void;
}

// Moved Styles Object outside of the component for better organization
export const roleBadgeColors = {
  admin: {
    borderColor: "border-red-500",
    textColor: "text-red-600",
    bgColor: "bg-red-100 dark:bg-red-600 hover:bg-red-200",
  },
  seller: {
    borderColor: "border-green-500",
    textColor: "text-green-600",
    bgColor: "bg-green-100 dark:bg-green-600 hover:bg-green-200",
  },
  member: {
    borderColor: "border-gray-500",
    textColor: "text-gray-600 dark:text-gray-300",
    bgColor: "bg-gray-100 dark:bg-gray-600 hover:bg-gray-200",
  },
} as const;

const UserCard: React.FC<UserCardProps> = ({
  user,
  handleVerifyUpdate,
  handleDeleteUser,
  handleRoleUpdate,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  // Extracted theme-dependent styles into a separate object
  const themeStyles = {
    cardBgColor: isDark
      ? "bg-gray-800 border-gray-700"
      : "bg-white border-gray-200",
    textColor: isDark ? "text-white" : "text-gray-800",
    iconTextColor: isDark
      ? "text-gray-400 hover:text-gray-300"
      : "text-gray-500 hover:text-gray-700",
    dropdownBgColor: isDark ? "bg-gray-700" : "bg-white",
    dropdownItemHoverColor: isDark ? "hover:bg-gray-600" : "hover:bg-gray-100",
    deleteButtonTextColor: isDark
      ? "text-red-400 focus:text-red-500 hover:bg-red-700"
      : "text-red-500 focus:text-red-700 hover:bg-red-100",
    badgeOutlineColor: isDark ? "border-gray-600 text-gray-400" : "",
    contentTextColor: isDark ? "text-gray-400" : "text-gray-700",
    contentIconTextColor: isDark ? "text-gray-400" : "text-gray-600",
  };

  const handleToggleVerify = () => handleVerifyUpdate(user);
  const handleSetRole = (newRole: "admin" | "member" | "seller") =>
    handleRoleUpdate(user, newRole);
  const handleDelete = () => handleDeleteUser(user);

  const userRoleBadge = () => {
    if (!user.role) return null;
    const roleColors = roleBadgeColors[user.role];
    return (
      <Badge
        variant="default"
        className={`${roleColors.borderColor} ${roleColors.textColor} ${
          roleColors.bgColor
        } ${isDark ? "dark:bg-opacity-20" : ""}`}
      >
        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
      </Badge>
    );
  };

  const handleCopyUsername = () => {
    toast.success("Username copied to clipboard");
    navigator.clipboard.writeText(user.username);
  };

  return (
    <Card
      className={`w-96 shadow-md rounded-lg border ${themeStyles.cardBgColor}`}
    >
      <CardHeader>
        <div className="flex items-center justify-between mb-2">
          <CardTitle
            className={`text-xl font-semibold flex items-center gap-2 ${themeStyles.textColor}`}
          >
            <div className="relative">
              <Avatar className="h-14 w-14">
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
              {user.verified && (
                <VerifiedIcon
                  size={24}
                  className="text-blue-500 absolute -bottom-1 -right-0.5 bg-white rounded-full"
                />
              )}
            </div>
            <div className="flex flex-col text-start mr-4">
              <p>{user.name}</p>
              <div>
                <Link
                  className="text-base font-light cursor-pointer hover:underline dark:text-gray-300 text-gray-600"
                  href={`/${user.username}`}
                >
                  @{user.username}
                </Link>
                <HiOutlineClipboardCopy
                  className="inline ml-1 cursor-pointer dark:text-gray-500 dark:hover:text-gray-300 text-gray-400 hover:text-gray-600"
                  onClick={handleCopyUsername}
                />
              </div>
            </div>
            {userRoleBadge()}
          </CardTitle>
          <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <MoreVertical
                className={`h-4 w-4 cursor-pointer ml-3 rounded-full ${themeStyles.iconTextColor}`}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className={`transition w-44 ${themeStyles.dropdownBgColor}`}
            >
              <DropdownMenuItem
                className={`cursor-pointer ${themeStyles.dropdownItemHoverColor}`}
                onClick={handleToggleVerify}
              >
                <VerifiedIcon className="mr-2 h-4 w-4" />
                {user.verified ? "Set as Unverified" : "Set as Verified"}
              </DropdownMenuItem>
              {user.role !== "admin" && (
                <DropdownMenuItem
                  className={`cursor-pointer ${themeStyles.dropdownItemHoverColor}`}
                  onClick={() => handleSetRole("admin")}
                >
                  <FaUserShield className="mr-2 h-4 w-4" /> Set as Admin
                </DropdownMenuItem>
              )}
              {user.role !== "seller" && (
                <DropdownMenuItem
                  className={`cursor-pointer ${themeStyles.dropdownItemHoverColor}`}
                  onClick={() => handleSetRole("seller")}
                >
                  <FaUser className="mr-2 h-4 w-4" /> Set as Seller
                </DropdownMenuItem>
              )}
              {user.role !== "member" && (
                <DropdownMenuItem
                  className={`cursor-pointer ${themeStyles.dropdownItemHoverColor}`}
                  onClick={() => handleSetRole("member")}
                >
                  <FaUser className="mr-2 h-4 w-4" /> Set as Member
                </DropdownMenuItem>
              )}
              <DropdownMenuItem
                onClick={handleDelete}
                className={`cursor-pointer ${themeStyles.deleteButtonTextColor}`}
              >
                <FaUserSlash className="mr-2 h-4 w-4" /> Delete Member
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-1">
          {user.kelas && user.nomor_kelas && (
            <Badge variant="outline" className={themeStyles.badgeOutlineColor}>
              {user.kelas}
              {user.nomor_kelas}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2">
          {user.bio && (
            <div className={`text-sm ${themeStyles.contentTextColor}`}>
              <p>{user.bio}</p>
            </div>
          )}

          {user.email && (
            <div
              className={`flex items-center  text-sm gap-2 ${themeStyles.contentIconTextColor}`}
            >
              <span>📧</span> {user.email}
            </div>
          )}

          {user.phone_number && (
            <div
              className={`flex items-center  text-sm gap-2 ${themeStyles.contentIconTextColor}`}
            >
              <Phone size={16} /> {user.phone_number}
            </div>
          )}
          {user.website_sosmed_link && (
            <div
              className={`flex items-center text-sm  gap-2 ${themeStyles.contentIconTextColor}`}
            >
              {user.website_sosmed_link.toLowerCase().includes("instagram") ? (
                <FaInstagram size={16} />
              ) : (
                <IoMdLink size={16} />
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
            className={`flex items-center gap-2 ${themeStyles.contentIconTextColor}`}
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
