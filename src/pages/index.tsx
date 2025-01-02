import { SidebarProvider } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/AppSidebar"
import CardDeck from "@/components/CardDeck"

const Index = () => {
    return (
        <SidebarProvider>
            <div className="min-h-screen flex w-full bg-[#FDE1D3]">
                <AppSidebar />
                <main className="flex-1 p-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="search"
                                    placeholder="Search..."
                                    className="w-full rounded-full px-6 py-3 pr-12 bg-white/80 backdrop-blur-sm border-none focus:ring-2 focus:ring-rose-300"
                                />
                                <button className="absolute right-4 top-1/2 -translate-y-1/2">
                                    <span className="sr-only">Search</span>
                                    +
                                </button>
                            </div>
                        </div>
                        <CardDeck />
                    </div>
                </main>
            </div>
        </SidebarProvider>
    );
};

export default Index;