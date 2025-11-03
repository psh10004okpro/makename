import * as React from 'react'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => onOpenChange(false)}
      />
      {/* Content */}
      <div className="relative z-50 max-w-4xl w-full mx-4">{children}</div>
    </div>
  )
}

export function DialogContent({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`bg-white rounded-lg shadow-xl p-6 max-h-[90vh] overflow-y-auto ${className}`}>
      {children}
    </div>
  )
}

export function DialogHeader({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <div className={`mb-4 ${className}`}>{children}</div>
}

export function DialogTitle({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <h2 className={`text-2xl font-bold ${className}`}>{children}</h2>
}

export function DialogDescription({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) {
  return <p className={`text-gray-600 ${className}`}>{children}</p>
}
