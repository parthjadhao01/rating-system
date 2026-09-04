"use client"

import { StarIcon } from "lucide-react"

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
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import { Role, type User } from "./types"

interface UserInfoDrawerProps {
  user: User
}

export function UserInfoDrawer({ user }: UserInfoDrawerProps) {
  return (
    <Drawer swipeDirection="right">
      <DrawerTrigger className="text-left hover:underline">
        {user.name}
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{user.name}</DrawerTitle>
          <DrawerDescription>User details</DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 space-y-4 overflow-y-auto p-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Email</div>
            <div>{user.email}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Address</div>
            <div>{user.address}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Role</div>
            <Badge variant="outline" className="text-muted-foreground px-1.5">
              {Role[user.role]}
            </Badge>
          </div>
          {user.role === Role.STORE_OWNER && (
            <div className="space-y-1">
              <div className="text-muted-foreground">Rating</div>
              <Badge
                variant="outline"
                className="text-muted-foreground gap-1 px-1.5"
              >
                <StarIcon className="size-3 fill-current" />
                {user.rating !== undefined ? user.rating.toFixed(1) : "No ratings yet"}
              </Badge>
            </div>
          )}
        </div>
        <DrawerFooter>
          <DrawerClose render={<Button variant="outline" />}>
            Close
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
