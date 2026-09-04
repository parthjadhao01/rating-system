"use client"

import * as React from "react"
import { PlusIcon } from "lucide-react"

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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Role, type User } from "./types"

const roleItems = [
  { label: "Normal User", value: Role.NORMAL_USER },
  { label: "Admin", value: Role.ADMIN },
  { label: "Store Owner", value: Role.STORE_OWNER },
]

interface AddUserDrawerProps {
  onAdd: (user: User) => void
}

export function AddUserDrawer({ onAdd }: AddUserDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [role, setRole] = React.useState<Role>(Role.NORMAL_USER)

  function resetForm() {
    setName("")
    setEmail("")
    setPassword("")
    setAddress("")
    setRole(Role.NORMAL_USER)
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onAdd({
      id: crypto.randomUUID(),
      name,
      email,
      address,
      role,
    })

    resetForm()
    setOpen(false)
  }

  return (
    <Drawer
      open={open}
      swipeDirection="right"
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetForm()
      }}
    >
      <DrawerTrigger render={<Button variant="outline" />}>
        <PlusIcon />
        Add User
      </DrawerTrigger>
      <DrawerContent>
        <form
          id="add-user-form"
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <DrawerHeader>
            <DrawerTitle>Add user</DrawerTitle>
            <DrawerDescription>
              Create a new user account. All fields are required.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="add-user-name">Name</FieldLabel>
                <Input
                  id="add-user-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="add-user-email">Email</FieldLabel>
                <Input
                  id="add-user-email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="add-user-password">Password</FieldLabel>
                <Input
                  id="add-user-password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="add-user-address">Address</FieldLabel>
                <Input
                  id="add-user-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="add-user-role">Role</FieldLabel>
                <Select
                  items={roleItems}
                  value={role}
                  onValueChange={(value) => setRole(value as Role)}
                >
                  <SelectTrigger id="add-user-role" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {roleItems.map((item) => (
                        <SelectItem key={item.label} value={item.value}>
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            </FieldGroup>
          </div>
          <DrawerFooter>
            <Button type="submit" form="add-user-form">
              Create user
            </Button>
            <DrawerClose render={<Button variant="outline" />}>
              Cancel
            </DrawerClose>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  )
}
