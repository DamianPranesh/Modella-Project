// import { X } from "lucide-react";
// import { type ModelInfo, type BusinessInfo } from "./CategoryGrid";

// // SearchResultsDisplay (handles the full-screen results overlay)
// export function SearchResultsDisplay({
//   showResults,
//   setShowResults,
//   filterType,
//   getFilteredResults,
// }: {
//   showResults: boolean;
//   setShowResults: (show: boolean) => void;
//   filterType: "model" | "business" | null;
//   getFilteredResults: () => (ModelInfo | BusinessInfo)[];
// }) {
//   if (!showResults) return null;
//   return (
//     <div className="fixed inset-0 bg-white z-50 overflow-y-auto">
//       <div className="max-w-7xl mx-auto px-4 py-8">
//         <div className="flex justify-between items-center mb-8">
//           <h3 className="font-semibold text-2xl text-[#DD8560]">
//             {filterType === "model" ? "Model Results" : "Business Results"}
//           </h3>
//           <button
//             onClick={() => setShowResults(false)}
//             className="text-gray-500 hover:text-gray-700 cursor-pointer"
//           >
//             <X className="w-6 h-6" />
//           </button>
//         </div>

//         {filterType === "model" ? (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {getFilteredResults().length > 0 ? (
//               getFilteredResults().map((item) => (
//                 <div key={item.id} className="relative group">
//                   <div className="overflow-hidden rounded-2xl">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
//                     />
//                   </div>
//                   <div className="mt-4 space-y-1">
//                     <p className="font-medium">NAME: {item.name}</p>
//                     <p className="text-sm text-gray-600">TYPE: {item.type}</p>
//                     {"location" in item && (
//                       <p className="text-sm text-gray-600">
//                         LOCATION: {item.location}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full text-center py-8 text-gray-500">
//                 <p className="text-lg">
//                   No models found matching your criteria
//                 </p>
//                 <p className="mt-2">Try adjusting your filters</p>
//               </div>
//             )}
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {getFilteredResults().length > 0 ? (
//               getFilteredResults().map((item) => (
//                 <div key={item.id} className="relative group cursor-pointer">
//                   <div className="overflow-hidden rounded-2xl">
//                     <img
//                       src={item.image}
//                       alt={item.name}
//                       className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
//                     />
//                   </div>
//                   <div className="mt-4 space-y-1">
//                     <p className="font-medium">NAME: {item.name}</p>
//                     <p className="text-sm text-gray-600">TYPE: {item.type}</p>
//                     {"location" in item && (
//                       <p className="text-sm text-gray-600">
//                         LOCATION: {item.location}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="col-span-full text-center py-8 text-gray-500">
//                 <p className="text-lg">
//                   No businesses found matching your criteria
//                 </p>
//                 <p className="mt-2">Try adjusting your filters</p>
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }
