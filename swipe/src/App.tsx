import Sidebar from './Components/Sidebar';
import SwipeCards from './Components/SwipeCards';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <Sidebar />
            {/* Main Content */}
            <div className="ml-[280px]">
                <SwipeCards />
            </div>
        </div>
    );
}

export default App;