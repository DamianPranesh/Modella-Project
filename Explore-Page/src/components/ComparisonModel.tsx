import React from "react";

type Model = {
  id: string;
  name: string;
  age: number;
  type: string;
  image: string;
  // Add more fields as needed
};

interface ComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  models: Model[];
}

const ComparisonModal: React.FC<ComparisonModalProps> = ({
  isOpen,
  onClose,
  models,
}) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Comparison Chart
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {models.map((model) => (
            <div
              key={model.id}
              className="border rounded-lg overflow-hidden shadow-md transition-transform transform hover:scale-105"
            >
              <img
                src={model.image}
                alt={model.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">{model.name}</h3>
                <p className="text-gray-600">Age: {model.age}</p>
                <p className="text-gray-600">Type: {model.type}</p>
                {/* Add more fields as needed */}
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ComparisonModal;
