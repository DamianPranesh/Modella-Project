import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";
import { ImageCarousel } from "./components/ImageCarousel";
import { CategoryButtons } from "./components/CategoryButtons";

function App() {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="flex-1 p-8 ml-[300px] md:ml-[250px] sm:ml-[200px]">
        <SearchBar />
        <div className="mt-8">
          <ImageCarousel />
        </div>
        <div className="mt-8">
          <CategoryButtons />
        </div>
      </main>
    </div>
  );
}

export default App;
