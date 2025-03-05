import { useState, useEffect } from "react";
import { fetchData } from "../api/api";
import influencer1 from "../images/Image-18.jpg";

type ModelInfo = {
  id: string;
  name: string;
  age: number;
  type: string;
  image: string;
};

type BusinessInfo = {
  id: string;
  name: string;
  type: string;
  location: string;
  image: string;
};

const otherData = [
  {
    id: "o1",
    name: "DAVID DOBRIK",
    type: "INFLUENCER",
    image: influencer1,
  },
];

export function CategoryGrid() {
  const [selectedCategory, setSelectedCategory] = useState<
    "Models" | "Businesses" | "Other"
  >("Models");
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [businesses, setBusinesses] = useState<BusinessInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModelsAndBusinesses = async () => {
      setLoading(true);
      try {
        // Fetch model IDs
        const modelIds: string[] = await fetchData(
          "ModellaPreference/brand-Model-preference-matched-ids",
          { method: "POST", body: JSON.stringify({}) }
        );

        // Fetch business IDs
        const businessIds: string[] = await fetchData(
          "ModellaPreference/Model-brand-preference-matched-ids",
          { method: "POST", body: JSON.stringify({}) }
        );

        // Fetch model details
        const modelDetails = await Promise.all(
          modelIds.map(async (id) => {
            const user = await fetchData(`users/${id}`);
            const imageRes = await fetchData(
              `files/urls-for-user-id-and-foldername-with-limits?user_id=${id}&folder=profile-pic&limit=1`
            );
            const tags = await fetchData(`ModellaTag/tags/models/${id}`);

            return {
              id,
              name: user.name,
              age: tags?.age || "Unknown",
              type: tags?.work_Field || "Unknown",
              image: imageRes[0]?.s3_url || "/placeholder.svg",
            };
          })
        );

        // Fetch business details
        const businessDetails = await Promise.all(
          businessIds.map(async (id) => {
            const user = await fetchData(`users/${id}`);
            const imageRes = await fetchData(
              `files/urls-for-user-id-and-foldername-with-limits?user_id=${id}&folder=profile-pic&limit=1`
            );
            const tags = await fetchData(`ModellaTag/tags/brands/${id}`);

            return {
              id,
              name: user.name,
              type: tags?.work_Field || "Unknown",
              location: tags?.location || "Unknown",
              image: imageRes[0]?.s3_url || "/placeholder.svg",
            };
          })
        );

        setModels(modelDetails);
        setBusinesses(businessDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModelsAndBusinesses();
  }, []);

  return (
    <div className="mt-12">
      <div className="flex justify-center gap-12 mb-8">
        {["Models", "Businesses", "Other"].map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category as any)}
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
        <p className="text-center">Loading...</p>
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
                    TYPE:{" "}
                    {Array.isArray(model.type)
                      ? model.type.join(", ")
                      : model.type}
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
                    {Array.isArray(business.type)
                      ? business.type.join(", ")
                      : business.type}
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
