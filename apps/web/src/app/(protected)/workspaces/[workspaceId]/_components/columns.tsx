"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  Shield,
  ShieldAlert,
  User,
} from "lucide-react";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { getBucketUrl } from "@/utils/api";

// Backend'den gelen veri tipi (Prisma çıktısına uygun)
export type WorkspaceMember = {
  id: string; // Member ID (ilişki tablosundaki ID)
  role: "OWNER" | "ADMIN" | "MEMBER";
  joinedAt: Date | string;
  user: {
    id: string;
    username: string;
    email: string;
    avatarUrl?: string | null;
    firstName?: string | null;
    lastName?: string | null;
  };
};

// Rol değiştirmek veya silmek için dışarıdan fonksiyon alacağız (Callback)
interface ColumnProps {
  onRoleChange: (memberId: string, newRole: "ADMIN" | "MEMBER") => void;
  onRemoveMember: (memberId: string) => void;
  currentUserRole: "OWNER" | "ADMIN" | "MEMBER"; // Giriş yapan kişinin rolü
}

export const getColumns = ({
  onRoleChange,
  onRemoveMember,
  currentUserRole,
}: ColumnProps): ColumnDef<WorkspaceMember>[] => [
  {
    accessorKey: "user.username", // Sıralama ve filtreleme için anahtar
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          User
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const user = row.original.user;
      const avatarSrc = user.avatarUrl
        ? user.avatarUrl.startsWith("http") ||
          user.avatarUrl.startsWith("https")
          ? user.avatarUrl
          : `${getBucketUrl()}/${user.avatarUrl}`
        : undefined;

      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-9 w-9 border border-border">
            <AvatarImage src={avatarSrc} />
            <AvatarFallback>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium text-sm">
              {user.firstName
                ? `${user.firstName} ${user.lastName}`
                : user.username}
            </span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.getValue("role") as string;

      let badgeColor =
        "bg-secondary text-secondary-foreground hover:bg-secondary/80";
      let Icon = User;

      if (role === "OWNER") {
        badgeColor =
          "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20";
        Icon = ShieldAlert;
      } else if (role === "ADMIN") {
        badgeColor =
          "bg-orange-500/10 text-orange-500 border-orange-500/20 hover:bg-orange-500/20";
        Icon = Shield;
      }

      return (
        <Badge variant="outline" className={`gap-1.5 ${badgeColor}`}>
          <Icon className="w-3 h-3" />
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "joinedAt",
    header: "Joined",
    cell: ({ row }) => {
      return (
        <div className="text-muted-foreground text-sm">
          {format(new Date(row.getValue("joinedAt")), "MMM d, yyyy")}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const member = row.original;
      const isTargetOwner = member.role === "OWNER";

      // Sadece OWNER ve ADMIN işlem yapabilir
      // Ama kimse OWNER'ı düzenleyemez
      const canEdit =
        currentUserRole === "OWNER" ||
        (currentUserRole === "ADMIN" && member.role === "MEMBER");

      if (!canEdit || isTargetOwner) {
        return <div className="w-8 h-8" />; // Boşluk bırak (hizalama bozulmasın)
      }

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />

            {/* Rol Değiştirme Alt Menüsü */}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Change Role</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={member.role}
                  onValueChange={(val) =>
                    onRoleChange(member.id, val as "ADMIN" | "MEMBER")
                  }
                >
                  <DropdownMenuRadioItem value="ADMIN">
                    Admin
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="MEMBER">
                    Member
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>

            <DropdownMenuSeparator />

            {/* Üyeyi At */}
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 focus:bg-red-50"
              onClick={() => onRemoveMember(member.id)}
            >
              Remove from Workspace
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
