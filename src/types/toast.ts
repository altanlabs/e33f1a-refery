import * as React from "react"

export interface ToastProps {
  id: string
  variant?: "default" | "destructive"
  title?: React.ReactNode
  description?: React.ReactNode
  action?: React.ReactNode
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

export type CustomToastActionElement = React.ReactElement