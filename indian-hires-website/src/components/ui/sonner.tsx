"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckCircle2, Info, AlertTriangle, XOctagon, Loader2 } from "lucide-react"

/*
 * The site has one theme (ivory), so the toaster is fixed to sonner's light
 * theme rather than following the OS. Its surface colours are the `popover`
 * role and the gold hairline: globals.css re-wraps the variables below as
 * hsl(), because ours are bare triplets.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      icons={{
        success: <CheckCircle2 aria-hidden="true" className="size-4" />,
        info: <Info aria-hidden="true" className="size-4" />,
        warning: <AlertTriangle aria-hidden="true" className="size-4" />,
        error: <XOctagon aria-hidden="true" className="size-4" />,
        loading: <Loader2 aria-hidden="true" className="size-4 motion-safe:animate-spin" />,
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "font-body shadow-lift",
          title: "type-small font-medium",
          description: "type-small",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
