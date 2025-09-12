import * as React from "react"

function Card({ style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card"
      style={{
        backgroundColor: "white",     // bg-card
        color: "black",               // text-card-foreground
        display: "flex",              // flex
        flexDirection: "column",      // flex-col
        borderRadius: "0.75rem",      // rounded-xl
        border: "1px solid #e5e7eb",  // border
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)", // shadow-sm
        height: "5rem",               // h-20
        width: "17.5rem",             // w-70 (~280px)
        ...style,
      }}
      {...props}
    />
  )
}

function CardHeader({ style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-header"
      style={{
        display: "grid",
        gridAutoRows: "min-content",
        gridTemplateRows: "auto auto",
        alignItems: "flex-start",
        paddingLeft: "0.75rem",   // px-3
        paddingRight: "0.75rem",
        ...style,
      }}
      {...props}
    />
  )
}

function CardTitle({ style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-title"
      style={{
        lineHeight: "1.25rem", // leading-none
        fontWeight: 600,       // font-semibold
        ...style,
      }}
      {...props}
    />
  )
}

function CardDescription({ style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-description"
      style={{
        color: "#6b7280",   // text-muted-foreground
        fontSize: "0.875rem", // text-sm
        ...style,
      }}
      {...props}
    />
  )
}

function CardAction({ style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-action"
      style={{
        gridColumnStart: 2,
        gridRowStart: 1,
        gridRowEnd: 3,
        alignSelf: "flex-start",
        justifySelf: "end",
        ...style,
      }}
      {...props}
    />
  )
}

function CardContent({ style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-content"
      style={{
        paddingLeft: "1.5rem",  // px-6
        paddingRight: "1.5rem",
        ...style,
      }}
      {...props}
    />
  )
}

function CardFooter({ style, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="card-footer"
      style={{
        display: "flex",        // flex
        alignItems: "center",   // items-center
        paddingLeft: "1.5rem",  // px-6
        paddingRight: "1.5rem",
        paddingTop: "1.5rem",   // pt-6 if border-t
        ...style,
      }}
      {...props}
    />
  )
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
