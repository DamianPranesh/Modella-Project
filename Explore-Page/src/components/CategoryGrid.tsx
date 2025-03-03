// import { useState } from "react";

// import model1 from "../images/Image-8.png";
// import model2 from "../images/Image-9.png";
// import model3 from "../images/Image-10.png";
// import model4 from "../images/Image-11.png";
// import model5 from "../images/Image-12.png";
// import model6 from "../images/Image-13.png";
// import model7 from "../images/Image-14.png";
// import model8 from "../images/Image-15.png";
// import business1 from "../images/Image-16.jpg";
// import business2 from "../images/Image-17.jpg";
// import influencer1 from "../images/Image-18.jpg";

// type ModelInfo = {
//   id: string;
//   name: string;
//   age: number;
//   type: string;
//   image: string;
// };

// type BusinessInfo = {
//   id: string;
//   name: string;
//   type: string;
//   location: string;
//   image: string;
// };

// const modelData: ModelInfo[] = [
//   {
//     id: "1",
//     name: "CURTLY",
//     age: 24,
//     type: "EDITORIAL AND COMMERCIAL MODEL",
//     image: model1,
//   },
//   {
//     id: "2",
//     name: "MIA",
//     age: 21,
//     type: "RUNWAY MODEL",
//     image: model2,
//   },
//   {
//     id: "3",
//     name: "EMMA",
//     age: 23,
//     type: "BEAUTY MODEL",
//     image: model3,
//   },
//   {
//     id: "4",
//     name: "NOAH",
//     age: 25,
//     type: "COMMERCIAL MODEL",
//     image: model4,
//   },
//   {
//     id: "5",
//     name: "ZOE",
//     age: 22,
//     type: "COMMERCIAL MODEL",
//     image: model5,
//   },
//   {
//     id: "6",
//     name: "LILY",
//     age: 19,
//     type: "EDITORIAL MODEL",
//     image: model8,
//   },
//   {
//     id: "7",
//     name: "LIAM",
//     age: 23,
//     type: "LIFESTYLE MODEL",
//     image: model6,
//   },
//   {
//     id: "8",
//     name: "GIA",
//     age: 21,
//     type: "RUNWAY MODEL",
//     image: model7,
//   },
// ];

// const businessData: BusinessInfo[] = [
//   {
//     id: "b1",
//     name: "VOGUE STUDIO",
//     type: "PHOTOGRAPHY STUDIO",
//     location: "NEW YORK",
//     image: business1,
//   },
//   {
//     id: "b2",
//     name: "ELITE AGENCY",
//     type: "MODELING AGENCY",
//     location: "LOS ANGELES",
//     image: business2,
//   },
// ];

// const otherData = [
//   {
//     id: "o1",
//     name: "DAVID DOBRIK",
//     type: "INFLUENCER",
//     image: influencer1,
//   },
// ];

// export function CategoryGrid() {
//   const [selectedCategory, setSelectedCategory] = useState<
//     "Models" | "Businesses" | "Other"
//   >("Models");

//   const renderModelCard = (model: ModelInfo) => (
//     <div key={model.id} className="relative group">
//       <div className="overflow-hidden rounded-2xl">
//         <img
//           src={model.image || "/placeholder.svg"}
//           alt={model.name}
//           className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>
//       <div className="mt-4 space-y-1">
//         <div className="flex items-center justify-between">
//           <p className="font-medium">NAME: {model.name}</p>
//           <p>AGE: {model.age}</p>
//         </div>
//         <p className="text-sm text-gray-600">TYPE: {model.type}</p>
//       </div>
//     </div>
//   );

//   const renderBusinessCard = (business: BusinessInfo) => (
//     <div key={business.id} className="relative group">
//       <div className="overflow-hidden rounded-2xl">
//         <img
//           src={business.image || "/placeholder.svg"}
//           alt={business.name}
//           className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>
//       <div className="mt-4 space-y-1">
//         <p className="font-medium">NAME: {business.name}</p>
//         <p className="text-sm text-gray-600">TYPE: {business.type}</p>
//         <p className="text-sm text-gray-600">LOCATION: {business.location}</p>
//       </div>
//     </div>
//   );

//   const renderOtherCard = (item: any) => (
//     <div key={item.id} className="relative group">
//       <div className="overflow-hidden rounded-2xl">
//         <img
//           src={item.image || "/placeholder.svg"}
//           alt={item.name}
//           className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
//         />
//       </div>
//       <div className="mt-4 space-y-1">
//         <p className="font-medium">NAME: {item.name}</p>
//         <p className="text-sm text-gray-600">TYPE: {item.type}</p>
//       </div>
//     </div>
//   );

//   return (
//     <div className="mt-12">
//       <div className="flex justify-center gap-12 mb-8">
//         {["Models", "Businesses", "Other"].map((category) => (
//           <button
//             key={category}
//             onClick={() => setSelectedCategory(category as any)}
//             className={`px-6 py-2 rounded-full transition-all cursor-pointer ${
//               selectedCategory === category
//                 ? "bg-[#DD8560] text-white shadow-lg"
//                 : "bg-white shadow-md hover:shadow-lg"
//             }`}
//           >
//             {category}
//           </button>
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
//         {selectedCategory === "Models" && modelData.map(renderModelCard)}
//         {selectedCategory === "Businesses" &&
//           businessData.map(renderBusinessCard)}
//         {selectedCategory === "Other" && otherData.map(renderOtherCard)}
//       </div>
//     </div>
//   );
// }

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
