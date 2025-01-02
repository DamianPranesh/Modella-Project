import { Home, ListPlus, MessageSquare, User, Settings } from "lucide-react"
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

const menuItems = [
    { title: "Explore", icon: Home, url: "#" },
    { title: "Swipe Page", icon: ListPlus, url: "#" },
    { title: "Saved List", icon: ListPlus, url: "#" },
    { title: "Chats", icon: MessageSquare, url: "#" },
    { title: "Account", icon: User, url: "#" },
    { title: "Settings", icon: Settings, url: "#" },
]

export function AppSidebar() {
    return (
        <Sidebar>
            <SidebarContent>
                <div className="p-4">
                    <h1 className="text-2xl font-bold text-sidebar-foreground mb-8">Modella</h1>
                </div>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menuItems.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <a href={item.url} className="flex items-center gap-3">
                                            <item.icon className="h-5 w-5" />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}