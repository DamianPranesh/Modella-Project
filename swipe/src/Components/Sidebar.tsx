import { Flame, Users, Bookmark, MessageCircle, User, Settings } from 'lucide-react';

const Sidebar = () => {
    const menuItems = [
        { icon: <Flame size={24} />, label: 'Explore' },
        { icon: <Users size={24} />, label: 'Swipe Page' },
        { icon: <Bookmark size={24} />, label: 'Saved List' },
        { icon: <MessageCircle size={24} />, label: 'Chats' },
        { icon: <User size={24} />, label: 'Account' },
    ];

    return (
        <div className="fixed left-0 top-0 h-screen w-[280px] bg-[#E98B73] text-white p-8">
            {/* Logo */}
            <h1 className="text-3xl font-serif mb-16">Modella</h1>

            {/* Navigation Menu */}
            <nav className="space-y-6">
                {menuItems.map((item, index) => (
                    <button
                        key={index}
                        className="flex items-center w-full p-3 hover:bg-white/10 rounded-lg transition-colors group"
                    >
                        <span className="mr-4">{item.icon}</span>
                        <span className="text-lg font-medium">{item.label}</span>
                    </button>
                ))}

                {/* Settings at the bottom */}
                <button className="flex items-center w-full p-3 hover:bg-white/10 rounded-lg transition-colors mt-auto absolute bottom-8">
                    <span className="mr-4"><Settings size={24} /></span>
                    <span className="text-lg font-medium">Settings</span>
                </button>
            </nav>
        </div>
    );
};

export default Sidebar;