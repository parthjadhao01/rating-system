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
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import { type Store } from "./types"
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from "@/components/ui/combobox"

interface AddStoreDrawerProps {
  onAdd: (store: Store) => void
}

type EligibleStoreOwner = { id: string, name: string }

export function AddStoreDrawer({ onAdd }: AddStoreDrawerProps) {
  const [open, setOpen] = React.useState(false)
  const [name, setName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [address, setAddress] = React.useState("")
  const [owner, setOwner] = React.useState("")
  const [error, setError] = React.useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [eligibleStoreOwner, setEligibleStoreOwner] = React.useState<EligibleStoreOwner[]>([])

  function resetForm() {
    setName("")
    setEmail("")
    setAddress("")
    setOwner("")
    setError(null)
    setIsSubmitting(false)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/store", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, address, owner }),
      })

      const json = await response.json()

      if (!response.ok) {
        setError(json.error ?? "Something went wrong")
        return
      }

      onAdd(json as Store)
      resetForm()
      setOpen(false)
    } catch {
      setError("Something went wrong")
    } finally {
      setIsSubmitting(false)
    }
  }

  async function fetchEligibleStoreOwner() {
    try {
      const response = await fetch("/api/user/storeowner-unassigned");
      const json = await response.json()
      if (!response.ok) {
        setError(json.error ?? "Something went wrong");
        return
      }
      setEligibleStoreOwner(json.unassignedStoreOwner)
    }catch(err){
      setError("Something went wrong !!")
    }
  }

  React.useEffect(() => {
    if(open==true){
      fetchEligibleStoreOwner()
    }
  }, [open])

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
              {error && <FieldError>{error}</FieldError>}
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
              <Field>
                <FieldLabel htmlFor="add-store-address">Assigne owner</FieldLabel>

                <Combobox
                  items={eligibleStoreOwner}
                  value={owner || null}
                  onValueChange={(value) => setOwner((value as string) ?? "")}
                  // Item values are plain id strings, not `{ value, label }`
                  // objects, so base-ui can't auto-derive a display label —
                  // it just shows the raw id. This looks the name back up.
                  itemToStringLabel={(id) =>
                    eligibleStoreOwner.find((o) => o.id === id)?.name ?? ""
                  }
                >
                  <ComboboxInput placeholder="select store owner" />
                  <ComboboxContent>
                    <ComboboxEmpty>
                      No store owner found
                    </ComboboxEmpty>
                    <ComboboxList>
                      {(item)=> (
                        <ComboboxItem key={item.id} value={item.id}>
                          {item.name}
                        </ComboboxItem>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
              </Field>
            </FieldGroup>
          </div>
          <DrawerFooter>
            <Button type="submit" form="add-store-form" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create store"}
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
