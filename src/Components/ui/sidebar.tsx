import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { PanelLeft } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"
import { Button } from "../button"
import { Input } from "../input"
import { Separator } from "../separator"
import { Sheet, SheetContent } from "../sheet"
import { Skeleton } from "../skeleton"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../tooltip"
import { cn } from "@/lib/utils"

// Constants
const SIDEBAR_WIDTH = "16rem"
const SIDEBAR_WIDTH_ICON = "3.5rem"
const SIDEBAR_WIDTH_MOBILE = "20rem"

// Types
type SidebarState = "expanded" | "collapsed"

interface SidebarContext {
    state: SidebarState
    open: boolean
    setOpen: (open: boolean) => void
    isMobile: boolean
    openMobile: boolean
    setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>
    toggleSidebar: () => void
}

// Context
const SidebarContext = React.createContext<SidebarContext | null>(null)

export function useSidebar() {
    const context = React.useContext(SidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}

// Component Props Types
interface SidebarProps extends React.ComponentProps<"div"> {
    side?: "left" | "right"
    variant?: "sidebar" | "floating" | "inset"
    collapsible?: "offcanvas" | "icon" | "none"
}

interface SidebarProviderProps extends React.ComponentProps<"div"> {
    defaultOpen?: boolean
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

interface SidebarTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface SidebarRailProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface SidebarInsetProps extends React.HTMLAttributes<HTMLElement> {}
interface SidebarInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
interface SidebarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SidebarSeparatorProps extends React.HTMLAttributes<HTMLHRElement> {}
interface SidebarContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SidebarGroupProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SidebarGroupLabelProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SidebarGroupActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
interface SidebarGroupContentProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SidebarMenuProps extends React.HTMLAttributes<HTMLUListElement> {}
interface SidebarMenuItemProps extends React.HTMLAttributes<HTMLLIElement> {}
interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    isActive?: boolean
    tooltip?: string | TooltipContentProps
    asChild?: boolean
}
interface SidebarMenuActionProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    showOnHover?: boolean
    asChild?: boolean
}
interface SidebarMenuBadgeProps extends React.HTMLAttributes<HTMLDivElement> {}
interface SidebarMenuSkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    showIcon?: boolean
}
interface SidebarMenuSubProps extends React.HTMLAttributes<HTMLUListElement> {}
interface SidebarMenuSubItemProps extends React.HTMLAttributes<HTMLLIElement> {}
interface SidebarMenuSubButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    size?: "sm" | "md"
    isActive?: boolean
    asChild?: boolean
}

// Components
export const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
    (
        {
            side = "left",
            variant = "sidebar",
            collapsible = "offcanvas",
            className,
            children,
            ...props
        },
        ref
    ) => {
        const { isMobile, state, openMobile, setOpenMobile } = useSidebar()

        if (collapsible === "none") {
            return (
                <div
                    className={cn(
                        "flex h-full w-[--sidebar-width] flex-col bg-sidebar text-sidebar-foreground",
                        className
                    )}
                    ref={ref}
                    {...props}
                >
                    {children}
                </div>
            )
        }

        if (isMobile) {
            return (
                <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
                    <SheetContent
                        data-sidebar="sidebar"
                        data-mobile="true"
                        className="w-[--sidebar-width] bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
                        style={
                            {
                                "--sidebar-width": SIDEBAR_WIDTH_MOBILE,
                            } as React.CSSProperties
                        }
                        side={side}
                    >
                        <div className="flex h-full w-full flex-col">{children}</div>
                    </SheetContent>
                </Sheet>
            )
        }

        return (
            <div
                ref={ref}
                className="group peer hidden md:block text-sidebar-foreground"
                data-state={state}
                data-collapsible={state === "collapsed" ? collapsible : ""}
                data-variant={variant}
                data-side={side}
            >
                <div
                    className={cn(
                        "duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear",
                        "group-data-[collapsible=offcanvas]:w-0",
                        "group-data-[side=right]:rotate-180",
                        variant === "floating" || variant === "inset"
                            ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]"
                            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon]"
                    )}
                />
                <div
                    className={cn(
                        "duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex",
                        side === "left"
                            ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
                            : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
                        variant === "floating" || variant === "inset"
                            ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]"
                            : "group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l",
                        className
                    )}
                    {...props}
                >
                    <div
                        data-sidebar="sidebar"
                        className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow"
                    >
                        {children}
                    </div>
                </div>
            </div>
        )
    }
)
Sidebar.displayName = "Sidebar"

// ... keep existing code (remaining component implementations)

export const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
    (
        {
            defaultOpen = true,
            open: openProp,
            onOpenChange: setOpenProp,
            className,
            style,
            children,
            ...props
        },
        ref
    ) => {
        const isMobile = React.useMemo(() => window.innerWidth < 768, [])
        const [openMobile, setOpenMobile] = React.useState(false)
        const [_open, _setOpen] = React.useState<boolean>(defaultOpen)
        const open = openProp ?? _open

        const setOpen = React.useCallback(
            (value: boolean | ((value: boolean) => boolean)) => {
                const openState = typeof value === "function" ? value(open) : value
                if (setOpenProp) {
                    setOpenProp(openState)
                } else {
                    _setOpen(openState)
                }
            },
            [setOpenProp, open]
        )

        const toggleSidebar = React.useCallback(() => {
            return isMobile
                ? setOpenMobile((open) => !open)
                : setOpen((open) => !open)
        }, [isMobile, setOpen, setOpenMobile])

        const state: SidebarState = open ? "expanded" : "collapsed"

        const contextValue = React.useMemo(
            () => ({
                state,
                open,
                setOpen,
                isMobile,
                openMobile,
                setOpenMobile,
                toggleSidebar,
            }),
            [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
        )

        return (
            <SidebarContext.Provider value={contextValue}>
                <TooltipProvider delayDuration={0}>
                    <div
                        style={
                            {
                                "--sidebar-width": SIDEBAR_WIDTH,
                                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                                ...style,
                            } as React.CSSProperties
                        }
                        className={cn(
                            "group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar",
                            className
                        )}
                        ref={ref}
                        {...props}
                    >
                        {children}
                    </div>
                </TooltipProvider>
            </SidebarContext.Provider>
        )
    }
)
SidebarProvider.displayName = "SidebarProvider"

export {
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupAction,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInput,
    SidebarInset,
    SidebarMenu,
    SidebarMenuAction,
    SidebarMenuBadge,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarMenuSkeleton,
    SidebarMenuSub,
    SidebarMenuSubButton,
    SidebarMenuSubItem,
    SidebarRail,
    SidebarSeparator,
    SidebarTrigger,
    useSidebar,
}