"use client";

import * as React from "react";
import * as AvatarPrimitive from "@radix-ui/react-avatar";

import { cn } from "./utils";

interface AvatarProps extends React.ComponentProps<typeof AvatarPrimitive.Root> {
  src?: string;
  alt?: string;
  size?: "small" | "medium" | "large";
}

function Avatar({
  className,
  src,
  alt = "",
  size = "medium",
  children,
  ...props
}: AvatarProps) {
  const sizeClass = {
    small: "size-8",
    medium: "size-10",
    large: "size-16",
  }[size];

  return (
    <AvatarPrimitive.Root
      data-slot="avatar"
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        sizeClass,
        className,
      )}
      {...props}
    >
      {src ? (
        <>
          <AvatarPrimitive.Image
            data-slot="avatar-image"
            className="aspect-square size-full object-cover"
            src={src}
            alt={alt}
          />
          <AvatarPrimitive.Fallback
            data-slot="avatar-fallback"
            className="bg-muted flex size-full items-center justify-center rounded-full"
          >
            {alt.slice(0, 1).toUpperCase()}
          </AvatarPrimitive.Fallback>
        </>
      ) : children}
    </AvatarPrimitive.Root>
  );
}

function AvatarImage({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      data-slot="avatar-image"
      className={cn("aspect-square size-full", className)}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      data-slot="avatar-fallback"
      className={cn(
        "bg-muted flex size-full items-center justify-center rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Avatar, AvatarImage, AvatarFallback };
