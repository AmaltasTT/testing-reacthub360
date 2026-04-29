"use client";

import React, { useState } from "react";
import { GlassCard } from "./GlassCard";
import {
  UserPlus,
  Mail,
  MoreVertical,
  Trash2,
  AlertCircle,
  Loader2,
  Edit,
  User,
  Phone,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUser } from "@/hooks/use-user";
import {
  useOrganizationUsers,
  type OrganizationUser,
} from "@/hooks/use-organization-users";
import {
  useInvitations,
  useSendInvitation,
  useCancelInvitation,
} from "@/hooks/use-invitations";
import {
  useUpdateOrganizationUser,
  useDeleteOrganizationUser,
} from "@/hooks/use-manage-users";

export function TeamTab() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<"Admin" | "Manager" | "Member">(
    "Member",
  );
  const [invitationStatus, setInvitationStatus] = useState<string>("pending");

  // Edit user state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<OrganizationUser | null>(null);
  const [editFormData, setEditFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    role: "Member" as "Admin" | "Manager" | "Member",
    phone_number: "",
  });

  // Fetch current user
  const { data: currentUser, isLoading: userLoading } = useUser();

  // Fetch organization users
  const {
    data: orgUsers,
    isLoading: usersLoading,
    error: usersError,
  } = useOrganizationUsers();

  // Fetch invitations
  const { data: invitations, isLoading: invitationsLoading } =
    useInvitations(invitationStatus);

  // Mutations
  const sendInvitationMutation = useSendInvitation();
  const cancelInvitationMutation = useCancelInvitation();
  const updateUserMutation = useUpdateOrganizationUser();
  const deleteUserMutation = useDeleteOrganizationUser();

  // Check if current user is admin
  const isAdmin = currentUser?.role === "Admin";

  const handleInvite = async () => {
    if (!inviteEmail.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await sendInvitationMutation.mutateAsync({
        email: inviteEmail,
        role: inviteRole,
      });

      setShowInviteModal(false);
      setInviteEmail("");
      setInviteRole("Member");
      toast.success(
        "Invitation sent successfully! The user will receive an email with instructions.",
      );
    } catch (error: any) {
      toast.error(error.message || "Failed to send invitation");
    }
  };

  const handleCancelInvitation = async (
    invitationId: number,
    email: string,
  ) => {
    if (
      !confirm(`Are you sure you want to cancel the invitation for ${email}?`)
    ) {
      return;
    }

    try {
      await cancelInvitationMutation.mutateAsync(invitationId);
      toast.success("Invitation cancelled successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to cancel invitation");
    }
  };

  const handleEditUser = (user: OrganizationUser) => {
    setEditingUser(user);
    setEditFormData({
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
      phone_number: user.phone_number || "",
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    // Check if current user is trying to change their own role
    if (
      editingUser.id === currentUser?.id &&
      editFormData.role !== currentUser.role
    ) {
      toast.error("You cannot change your own role");
      return;
    }

    try {
      await updateUserMutation.mutateAsync({
        userId: editingUser.id,
        ...editFormData,
      });

      setShowEditModal(false);
      setEditingUser(null);
      toast.success("User updated successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to update user");
    }
  };

  const handleDeleteUser = async (user: OrganizationUser) => {
    // Prevent deleting own account
    if (user.id === currentUser?.id) {
      toast.error("You cannot delete your own account");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${user.first_name} ${user.last_name}? This action cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await deleteUserMutation.mutateAsync(user.id);
      toast.success("User deleted successfully");
    } catch (error: any) {
      toast.error(error.message || "Failed to delete user");
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  // Loading state
  if (userLoading || usersLoading || invitationsLoading) {
    return (
      <div className="px-8 pb-12 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  // Error state
  if (usersError) {
    return (
      <div className="px-8 pb-12">
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-[#e11d48]" />
          <AlertDescription className="text-red-800">
            Failed to load team members. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Access control - show warning if not admin
  const showAdminWarning = !isAdmin;

  return (
    <div className="px-8 pb-12">
      {/* Admin Warning */}
      {showAdminWarning && (
        <Alert className="mb-6 border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertDescription className="text-amber-800">
            Only Admins can invite new team members and manage invitations.
            Contact your organization Admin for access.
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="relative mb-8 py-6 px-6 -mx-6 rounded-2xl bg-gradient-to-r from-violet-50/50 via-purple-100/30 to-transparent">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-slate-900 mb-1.5 text-2xl font-semibold">
              Team Members
            </h2>
            <p className="text-sm text-slate-500">
              {orgUsers?.filter((u) => u.is_active).length || 0} active members
            </p>
          </div>
          {isAdmin && (
            <Button
              onClick={() => setShowInviteModal(true)}
              className="text-white bg-gradient-to-r from-violet-500 to-purple-400 hover:from-violet-600 hover:to-purple-500 shadow-md shadow-violet-300/30"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Invite member
            </Button>
          )}
        </div>
      </div>

      {/* Team Table */}
      <GlassCard className="overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200/40">
                <th className="text-left px-6 py-5 text-slate-700 text-sm">
                  Member
                </th>
                <th className="text-left px-6 py-5 text-slate-700 text-sm">
                  Email
                </th>
                <th className="text-left px-6 py-5 text-slate-700 text-sm">
                  Role
                </th>
                <th className="text-left px-6 py-5 text-slate-700 text-sm">
                  Status
                </th>
                {isAdmin && (
                  <th className="text-right px-6 py-5 text-slate-700 text-sm">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {orgUsers && orgUsers.length > 0 ? (
                orgUsers.map((user) => {
                  const isCurrentUser = user.id === currentUser?.id;
                  return (
                    <tr
                      key={user.id}
                      className="border-b border-slate-200/20 hover:bg-violet-50/30 transition-colors"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-400 to-purple-400 flex items-center justify-center text-white text-sm shadow-md shadow-violet-300/40">
                            {getInitials(user.first_name, user.last_name)}
                          </div>
                          <div>
                            <div className="text-slate-900 flex items-center gap-2">
                              {user.first_name} {user.last_name}
                              {isCurrentUser && (
                                <span className="text-xs text-violet-600">
                                  (You)
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-600">{user.email}</td>
                      <td className="px-6 py-5 text-slate-900">{user.role}</td>
                      <td className="px-6 py-5">
                        <Badge
                          className={`
                            ${user.is_active
                              ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                              : "bg-slate-100 text-slate-700 border-slate-200"
                            }
                            px-3 py-1
                          `}
                        >
                          {user.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      {isAdmin && (
                        <td className="px-6 py-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEditUser(user)}
                              className="text-violet-600 hover:text-violet-700 hover:bg-violet-50"
                              disabled={updateUserMutation.isPending}
                            >
                              <Edit className="w-4 h-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              className="text-[#e11d48] hover:text-red-700 hover:bg-red-50"
                              disabled={
                                deleteUserMutation.isPending || isCurrentUser
                              }
                              title={
                                isCurrentUser
                                  ? "You cannot delete your own account"
                                  : "Delete user"
                              }
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={isAdmin ? 5 : 4}
                    className="px-6 py-8 text-center text-slate-500"
                  >
                    No team members found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>

      {/* Invitations Section */}
      {isAdmin && (
        <div className="mb-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-3">
              {invitationStatus === "all" && "All Invitations"}
              {invitationStatus === "pending" && "Pending Invitations"}
              {invitationStatus === "accepted" && "Accepted Invitations"}
              {invitationStatus === "expired" && "Expired Invitations"}
              {invitationStatus === "cancelled" && "Cancelled Invitations"}
            </h3>

            {/* Filter Tabs */}
            <div className="flex items-center gap-2 flex-wrap">
              <button
                onClick={() => setInvitationStatus("all")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${invitationStatus === "all"
                  ? "bg-violet-600 text-white shadow-md shadow-violet-300/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-violet-300 hover:bg-violet-50"
                  }`}
              >
                All
              </button>
              <button
                onClick={() => setInvitationStatus("pending")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${invitationStatus === "pending"
                  ? "bg-amber-600 text-white shadow-md shadow-amber-300/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-amber-300 hover:bg-amber-50"
                  }`}
              >
                Pending
              </button>
              <button
                onClick={() => setInvitationStatus("accepted")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${invitationStatus === "accepted"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-300/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50"
                  }`}
              >
                Accepted
              </button>
              <button
                onClick={() => setInvitationStatus("expired")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${invitationStatus === "expired"
                  ? "text-[#e11d48] text-white shadow-md shadow-red-300/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-red-300 hover:bg-red-50"
                  }`}
              >
                Expired
              </button>
              <button
                onClick={() => setInvitationStatus("cancelled")}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${invitationStatus === "cancelled"
                  ? "bg-slate-600 text-white shadow-md shadow-slate-300/30"
                  : "bg-white text-slate-700 border border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          <GlassCard className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200/40">
                    <th className="text-left px-6 py-4 text-slate-700 text-sm">
                      Email
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 text-sm">
                      Role
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 text-sm">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 text-sm">
                      Sent
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 text-sm">
                      Expires
                    </th>
                    <th className="text-right px-6 py-4 text-slate-700 text-sm">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {invitations && invitations.length > 0 ? (
                    invitations.map((invitation) => (
                      <tr
                        key={invitation.id}
                        className="border-b border-slate-200/20 hover:bg-violet-50/30 transition-colors"
                      >
                        <td className="px-6 py-4 text-slate-900">
                          {invitation.email}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {invitation.role}
                        </td>
                        <td className="px-6 py-4">
                          <Badge
                            className={`
                              ${invitation.status === "pending"
                                ? "bg-amber-100 text-amber-700 border-amber-200"
                                : invitation.status === "accepted"
                                  ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                                  : invitation.status === "expired"
                                    ? "bg-red-100 text-red-700 border-red-200"
                                    : "bg-slate-100 text-slate-700 border-slate-200"
                              }
                              px-2 py-1 text-xs
                            `}
                          >
                            {invitation.status.charAt(0).toUpperCase() +
                              invitation.status.slice(1)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">
                          {new Date(invitation.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-slate-600 text-sm">
                          {invitation.expiration
                            ? new Date(
                              invitation.expiration,
                            ).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="px-6 py-4 text-right">
                          {invitation.status === "pending" && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleCancelInvitation(
                                  invitation.id,
                                  invitation.email,
                                )
                              }
                              className="text-[#e11d48] hover:text-red-700 hover:bg-red-50"
                              disabled={cancelInvitationMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Cancel
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-8 text-center text-slate-500"
                      >
                        No invitations found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </div>
      )}

      {/* Edit User Modal */}
      {isAdmin && (
        <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Team Member</DialogTitle>
            </DialogHeader>

            {updateUserMutation.isError && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-[#e11d48]" />
                <AlertDescription className="text-red-800">
                  {updateUserMutation.error?.message || "Failed to update user"}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="edit-first-name">First Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="edit-first-name"
                      type="text"
                      placeholder="First name"
                      value={editFormData.first_name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          first_name: e.target.value,
                        })
                      }
                      className="pl-10"
                      disabled={updateUserMutation.isPending}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="edit-last-name">Last Name</Label>
                  <div className="relative mt-1.5">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                      id="edit-last-name"
                      type="text"
                      placeholder="Last name"
                      value={editFormData.last_name}
                      onChange={(e) =>
                        setEditFormData({
                          ...editFormData,
                          last_name: e.target.value,
                        })
                      }
                      className="pl-10"
                      disabled={updateUserMutation.isPending}
                    />
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="edit-email">Email Address</Label>
                <div className="relative mt-1.5">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="edit-email"
                    type="email"
                    placeholder="email@example.com"
                    value={editFormData.email}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        email: e.target.value,
                      })
                    }
                    className="pl-10"
                    disabled={updateUserMutation.isPending}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-phone">Phone Number</Label>
                <div className="relative mt-1.5">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="edit-phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={editFormData.phone_number}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        phone_number: e.target.value,
                      })
                    }
                    className="pl-10"
                    disabled={updateUserMutation.isPending}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="edit-role">Role</Label>
                <Select
                  value={editFormData.role}
                  onValueChange={(value: "Admin" | "Manager" | "Member") =>
                    setEditFormData({ ...editFormData, role: value })
                  }
                  disabled={
                    updateUserMutation.isPending ||
                    editingUser?.id === currentUser?.id
                  }
                >
                  <SelectTrigger className="mt-1.5">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin - Full access</SelectItem>
                    <SelectItem value="Manager">
                      Manager - Manage campaigns and team
                    </SelectItem>
                    <SelectItem value="Member">
                      Member - View campaigns and analytics
                    </SelectItem>
                  </SelectContent>
                </Select>
                {editingUser?.id === currentUser?.id && (
                  <p className="text-xs text-amber-600 mt-1">
                    You cannot change your own role
                  </p>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  setShowEditModal(false);
                  setEditingUser(null);
                }}
                disabled={updateUserMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                onClick={handleUpdateUser}
                className="bg-violet-600 hover:bg-violet-700"
                disabled={updateUserMutation.isPending}
              >
                {updateUserMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Update User
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Invite Modal */}
      <Dialog open={showInviteModal} onOpenChange={setShowInviteModal}>
        <DialogContent className="sm:max-w-lg border-0 gap-0 p-0 overflow-hidden">
          {/* Header with gradient background */}
          <div className="relative bg-gradient-to-br from-violet-500 via-purple-500 to-violet-600 px-6 pt-8 pb-6">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-lg">
                    <UserPlus className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <DialogTitle className="text-2xl font-bold text-white">
                      Invite Team Member
                    </DialogTitle>
                    <p className="text-violet-100 text-sm mt-0.5">
                      Expand your team collaboration
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 pt-6 pb-4 bg-white">
            {sendInvitationMutation.isError && (
              <Alert className="border-red-200 bg-red-50 mb-4">
                <AlertCircle className="h-4 w-4 text-[#e11d48]" />
                <AlertDescription className="text-red-800">
                  {sendInvitationMutation.error?.message ||
                    "Failed to send invitation"}
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-5">
              {/* Email Input */}
              <div>
                <Label
                  htmlFor="invite-email"
                  className="text-sm font-semibold text-slate-700 mb-2 block"
                >
                  Email Address
                </Label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-purple-500 flex items-center justify-center shadow-sm shadow-violet-300/40">
                    <Mail className="w-4 h-4 text-white" />
                  </div>
                  <Input
                    id="invite-email"
                    type="email"
                    placeholder="colleague@company.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                    className="pl-[52px] h-12 border-slate-200 focus:border-violet-500 focus:ring-violet-500/20"
                    disabled={sendInvitationMutation.isPending}
                  />
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  They'll receive an invitation link via email
                </p>
              </div>

              {/* Role Selection */}
              <div>
                <Label className="text-sm font-semibold text-slate-700 mb-2 block">
                  Assign Role
                </Label>
                <div className="grid gap-3">
                  {/* Manager Role */}
                  <button
                    type="button"
                    onClick={() => setInviteRole("Manager")}
                    disabled={sendInvitationMutation.isPending}
                    className={`
                      relative p-4 rounded-xl border-2 text-left transition-all
                      ${inviteRole === "Manager"
                        ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-200/50"
                        : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/30"
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                        ${inviteRole === "Manager" ? "border-violet-500" : "border-slate-300"}
                      `}
                      >
                        {inviteRole === "Manager" && (
                          <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">
                            Manager
                          </span>
                          <Badge className="bg-blue-100 text-blue-700 border-0 text-xs">
                            Extended Access
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          Manage campaigns, team members, and access most
                          features
                        </p>
                      </div>
                    </div>
                  </button>

                  {/* Member Role */}
                  <button
                    type="button"
                    onClick={() => setInviteRole("Member")}
                    disabled={sendInvitationMutation.isPending}
                    className={`
                      relative p-4 rounded-xl border-2 text-left transition-all
                      ${inviteRole === "Member"
                        ? "border-violet-500 bg-violet-50 shadow-md shadow-violet-200/50"
                        : "border-slate-200 bg-white hover:border-violet-300 hover:bg-violet-50/30"
                      }
                      disabled:opacity-50 disabled:cursor-not-allowed
                    `}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`
                        w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5
                        ${inviteRole === "Member" ? "border-violet-500" : "border-slate-300"}
                      `}
                      >
                        {inviteRole === "Member" && (
                          <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-slate-900">
                            Member
                          </span>
                          <Badge className="bg-slate-100 text-slate-700 border-0 text-xs">
                            Standard Access
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          View campaigns, analytics, and collaborate on projects
                        </p>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="px-6 py-4 bg-slate-50 border-t border-slate-100">
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteEmail("");
                  setInviteRole("Member");
                }}
                disabled={sendInvitationMutation.isPending}
                className="flex-1 sm:flex-none border-slate-300 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button
                onClick={handleInvite}
                className="flex-1 sm:flex-none bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-600 hover:to-purple-600 text-white shadow-lg shadow-violet-500/30"
                disabled={sendInvitationMutation.isPending}
              >
                {sendInvitationMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Sending Invitation...
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 mr-2" />
                    Send Invitation
                  </>
                )}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
