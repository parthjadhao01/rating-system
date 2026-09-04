"use client"

import * as React from "react"
import { SquareAsterisk } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { changePasswordSchema } from "@/lib/validations/user"

const PASSWORD_MAX_LENGTH = 16

interface ChangePasswordDrawerProps {
  // TODO: drop once the current user comes from a real session instead of
  // being passed down from the page (see app/user/page.tsx).
  userId?: string
}

export function ChangePasswordDrawer({ userId }: ChangePasswordDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [currentPassword, setCurrentPassword] = React.useState("")
  const [newPassword, setNewPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  function resetForm() {
    setCurrentPassword("")
    setNewPassword("")
    setConfirmPassword("")
    setError(null)
    setIsSubmitting(false)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)

    const result = changePasswordSchema.safeParse({
      currentPassword,
      newPassword,
      confirmPassword,
    })
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid password")
      return
    }

    // The form only validates here — the actual change happens after the
    // user confirms in the alert dialog below.
    setConfirmOpen(true)
  }

  async function handleConfirm() {
    if (!userId) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch("/api/user/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, currentPassword, newPassword, confirmPassword }),
      })

      const json = await response.json()

      if (!response.ok) {
        setError(json.error ?? "Something went wrong")
        setConfirmOpen(false)
        return
      }

      setConfirmOpen(false)
      resetForm()
      setOpen(false)
    } catch {
      setError("Something went wrong")
      setConfirmOpen(false)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Drawer
        open={open}
        swipeDirection="right"
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (!nextOpen) resetForm()
        }}
      >
        <DrawerTrigger
          render={<Button variant="ghost" size="sm" disabled={!userId} />}
        >
          <SquareAsterisk />
          Change Password
        </DrawerTrigger>
        <DrawerContent>
          <form
            id="change-password-form"
            onSubmit={handleSubmit}
            className="flex min-h-0 flex-1 flex-col"
          >
            <DrawerHeader>
              <DrawerTitle>Change password</DrawerTitle>
              <DrawerDescription>
                Enter your current password and choose a new one.
              </DrawerDescription>
            </DrawerHeader>
            <div className="flex-1 overflow-y-auto p-4">
              <FieldGroup>
                {error && <FieldError>{error}</FieldError>}
                <Field>
                  <FieldLabel htmlFor="current-password">Current password</FieldLabel>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(event) => setCurrentPassword(event.target.value)}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="new-password">New password</FieldLabel>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    maxLength={PASSWORD_MAX_LENGTH}
                    required
                  />
                  <FieldDescription>
                    8-16 characters, with at least one uppercase letter and one special
                    character
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
                  <Input
                    id="confirm-new-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    maxLength={PASSWORD_MAX_LENGTH}
                    required
                  />
                </Field>
              </FieldGroup>
            </div>
            <DrawerFooter>
              <Button type="submit" form="change-password-form" disabled={!userId}>
                Change password
              </Button>
              <DrawerClose render={<Button variant="outline" />}>
                Cancel
              </DrawerClose>
            </DrawerFooter>
          </form>
        </DrawerContent>
      </Drawer>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Change your password?</AlertDialogTitle>
            <AlertDialogDescription>
              You&apos;ll need to sign in again with your new password next time.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm} disabled={isSubmitting}>
              {isSubmitting ? "Changing..." : "Confirm"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
