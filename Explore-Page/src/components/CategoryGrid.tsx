import { useState } from "react";
import { useModelsAndBusinesses } from "../api/useModelsAndBusinesses";
import influencer1 from "../images/Image-18.jpg";

const otherData = [
  {
    id: "o1",
    name: "DAVID DOBRIK",
    type: "INFLUENCER",
    image: influencer1,
  },
];

export function CategoryGrid() {
  const { models, businesses, loading } = useModelsAndBusinesses();
  const [selectedCategory, setSelectedCategory] = useState<
    "Models" | "Businesses" | "Other"
  >("Models");

  const categories: Array<"Models" | "Businesses" | "Other"> = [
    "Models",
    "Businesses",
    "Other",
  ];

  return (
    <div className="mt-12">
      <div className="flex justify-center gap-12 mb-8">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-6 py-2 rounded-full transition-all cursor-pointer ${
              selectedCategory === category
                ? "bg-[#DD8560] text-white shadow-lg"
                : "bg-white shadow-md hover:shadow-lg"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        	<p className="mt-4 text-gray-600">Loading...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
          {selectedCategory === "Models" &&
            models.map((model) => (
              <div key={model.id} className="relative group">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">NAME: {model.name}</p>
                    <p>AGE: {model.age}</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    TYPE: {model.bodyType}
                  </p>
                </div>
              </div>
            ))}

          {selectedCategory === "Businesses" &&
            businesses.map((business) => (
              <div key={business.id} className="relative group">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={business.image}
                    alt={business.name}
                    className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="font-medium">NAME: {business.name}</p>
                  <p className="text-sm text-gray-600">
                    TYPE:{" "}
                    {Array.isArray(business.workField)
                      ? business.workField.join(", ")
                      : business.workField}
                  </p>
                  <p className="text-sm text-gray-600">
                    LOCATION: {business.location}
                  </p>
                </div>
              </div>
            ))}

          {selectedCategory === "Other" &&
            otherData.map((item) => (
              <div key={item.id} className="relative group">
                <div className="overflow-hidden rounded-2xl">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="font-medium">NAME: {item.name}</p>
                  <p className="text-sm text-gray-600">TYPE: {item.type}</p>
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
