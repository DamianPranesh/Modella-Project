import { useState } from "react";

import model1 from "../images/Image-8.png";
import model2 from "../images/Image-9.png";
import model3 from "../images/Image-10.png";
import model4 from "../images/Image-11.png";
import model5 from "../images/Image-12.png";
import model6 from "../images/Image-13.png";
import model7 from "../images/Image-14.png";
import model8 from "../images/Image-15.png";
import business1 from "../images/Image-16.jpg";
import business2 from "../images/Image-17.jpg";
import influencer1 from "../images/Image-18.jpg";

export type ModelInfo = {
  id: string;
  name: string;
  age: number;
  type: string;
  image: string;
  height: string;
  eyeColor: string;
  bodyType: string;
  workField: string;
  gender: string;
  skinTone: string;
  experience: string;
};

export type BusinessInfo = {
  id: string;
  name: string;
  type: string;
  location: string;
  image: string;
  workField: string;
};

export const modelData: ModelInfo[] = [
  {
    id: "1",
    name: "CURTLY",
    age: 24,
    type: "EDITORIAL AND COMMERCIAL MODEL",
    image: model1,
    height: "171-180 cm",
    eyeColor: "Brown",
    bodyType: "Straight Size Models",
    workField: "Editorial Modeling",
    gender: "Male",
    skinTone: "Medium",
    experience: "Experienced (3-5 years)",
  },
  {
    id: "2",
    name: "MIA",
    age: 21,
    type: "RUNWAY MODEL",
    image: model2,
    height: "171-180 cm",
    eyeColor: "Blue",
    bodyType: "Straight Size Models",
    workField: "Runway Modeling",
    gender: "Female",
    skinTone: "Fair",
    experience: "Intermediate (1-3 years)",
  },
  {
    id: "3",
    name: "EMMA",
    age: 23,
    type: "BEAUTY MODEL",
    image: model3,
    height: "171-180 cm",
    eyeColor: "Blue",
    bodyType: "Straight Size Models",
    workField: "Runway Modeling",
    gender: "Female",
    skinTone: "Fair",
    experience: "Intermediate (1-3 years)",
  },
  {
    id: "4",
    name: "NOAH",
    age: 25,
    type: "COMMERCIAL MODEL",
    image: model4,
    height: "181-190 cm",
    eyeColor: "Blue",
    bodyType: "Straight Size Models",
    workField: "Runway Modeling",
    gender: "Male",
    skinTone: "Fair",
    experience: "Intermediate (1-3 years)",
  },
  {
    id: "5",
    name: "ZOE",
    age: 22,
    type: "COMMERCIAL MODEL",
    image: model5,
    height: "171-180 cm",
    eyeColor: "Blue",
    bodyType: "Straight Size Models",
    workField: "Runway Modeling",
    gender: "Female",
    skinTone: "Fair",
    experience: "Intermediate (1-3 years)",
  },
  {
    id: "6",
    name: "LILY",
    age: 19,
    type: "EDITORIAL MODEL",
    image: model8,
    height: "161-170 cm",
    eyeColor: "Blue",
    bodyType: "Straight Size Models",
    workField: "Runway Modeling",
    gender: "Female",
    skinTone: "Fair",
    experience: "Intermediate (1-3 years)",
  },
  {
    id: "7",
    name: "LIAM",
    age: 23,
    type: "LIFESTYLE MODEL",
    image: model6,
    height: "171-180 cm",
    eyeColor: "Blue",
    bodyType: "Straight Size Models",
    workField: "Fashion/Runway Modeling",
    gender: "Male",
    skinTone: "Fair",
    experience: "Intermediate (1-3 years)",
  },
  {
    id: "8",
    name: "GIA",
    age: 21,
    type: "RUNWAY MODEL",
    image: model7,
    height: "171-180 cm",
    eyeColor: "Blue",
    bodyType: "Straight Size Models",
    workField: "Runway Modeling",
    gender: "Female",
    skinTone: "Fair",
    experience: "Intermediate (1-3 years)",
  },
];

export const businessData: BusinessInfo[] = [
  {
    id: "b1",
    name: "VOGUE STUDIO",
    type: "PHOTOGRAPHY STUDIO",
    location: "London, United Kingdom",
    image: business1,
    workField: "Fashion/Runway Modeling",
  },
  {
    id: "b2",
    name: "ELITE AGENCY",
    type: "MODELING AGENCY",
    location: "New York City, USA",
    image: business2,
    workField: "Commercial Modeling",
  },
];

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

  const renderModelCard = (model: ModelInfo) => (
    <div key={model.id} className="relative group">
      <div className="overflow-hidden rounded-2xl">
        <img
          src={model.image || "/placeholder.svg"}
          alt={model.name}
          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex items-center justify-between">
          <p className="font-medium">NAME: {model.name}</p>
          <p>AGE: {model.age}</p>
        </div>
        <p className="text-sm text-gray-600">TYPE: {model.type}</p>
      </div>
    </div>
  );

  const renderBusinessCard = (business: BusinessInfo) => (
    <div key={business.id} className="relative group">
      <div className="overflow-hidden rounded-2xl">
        <img
          src={business.image || "/placeholder.svg"}
          alt={business.name}
          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1">
        <p className="font-medium">NAME: {business.name}</p>
        <p className="text-sm text-gray-600">TYPE: {business.type}</p>
        <p className="text-sm text-gray-600">LOCATION: {business.location}</p>
      </div>
    </div>
  );

  const renderOtherCard = (item: any) => (
    <div key={item.id} className="relative group">
      <div className="overflow-hidden rounded-2xl">
        <img
          src={item.image || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="mt-4 space-y-1">
        <p className="font-medium">NAME: {item.name}</p>
        <p className="text-sm text-gray-600">TYPE: {item.type}</p>
      </div>
    </div>
  );

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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-4 max-w-7xl mx-auto">
        {selectedCategory === "Models" && modelData.map(renderModelCard)}
        {selectedCategory === "Businesses" &&
          businessData.map(renderBusinessCard)}
        {selectedCategory === "Other" && otherData.map(renderOtherCard)}
      </div>
    </div>
  );
}
