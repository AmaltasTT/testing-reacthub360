"use client";

import { motion } from "motion/react";
import { useUser } from "@/hooks/use-user";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function UserAvatar() {
  const { data: user, isLoading, error } = useUser();
  console.log("user data: ", user);

  // Get user initials for avatar
  const getUserInitials = (name?: string) => {
    if (!name) return "?";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="w-11 h-11 rounded-full bg-gradient-to-br from-pink-400 to-violet-500 flex items-center justify-center text-white shadow-md cursor-pointer"
          >
            {isLoading
              ? "..."
              : error
              ? "!"
              : getUserInitials(user?.first_name)}
          </motion.div>
        </TooltipTrigger>
        <TooltipContent>
          <div className="text-sm">
            <p className="font-semibold">{user?.first_name || "User"}</p>
            {user?.email && (
              <p className="text-xs text-muted-foreground">{user.email}</p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
