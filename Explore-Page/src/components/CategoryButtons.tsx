export function CategoryButtons() {
  return (
    <div className="flex justify-center gap-18">
      {["Businesses", "Models", "Other"].map((category) => (
        <button
          key={category}
          className="px-6 py-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow cursor-pointer"
        >
          {category}
        </button>
      ))}
    </div>
  );
}
