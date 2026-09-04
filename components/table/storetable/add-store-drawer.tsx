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

import { type Store } from "./types"

interface AddStoreDrawerProps {
  onAdd: (store: Store) => void
}

export function AddStoreDrawer({ onAdd }: AddStoreDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [address, setAddress] = React.useState("")

  function resetForm() {
    setName("")
    setEmail("")
    setAddress("")
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    onAdd({
      id: crypto.randomUUID(),
      name,
      email,
      address,
      rating: 0,
    })

    resetForm()
    setOpen(false)
  }

  return (
    <Drawer
      showSwipeHandle
      open={open}
      swipeDirection="right"
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen)
        if (!nextOpen) resetForm()
      }}
    >
      <DrawerTrigger render={<Button variant="outline" />}>
        <PlusIcon />
        Add Store
      </DrawerTrigger>
      <DrawerContent>
        <form
          id="add-store-form"
          onSubmit={handleSubmit}
          className="flex min-h-0 flex-1 flex-col"
        >
          <DrawerHeader>
            <DrawerTitle>Add store</DrawerTitle>
            <DrawerDescription>
              Create a new store. All fields are required.
            </DrawerDescription>
          </DrawerHeader>
          <div className="flex-1 overflow-y-auto p-4">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="add-store-name">Name</FieldLabel>
                <Input
                  id="add-store-name"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="add-store-email">Email</FieldLabel>
                <Input
                  id="add-store-email"
                  type="email"
                  placeholder="store@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="add-store-address">Address</FieldLabel>
                <Input
                  id="add-store-address"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                />
              </Field>
            </FieldGroup>
          </div>
          <DrawerFooter>
            <Button type="submit" form="add-store-form">
              Create store
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
