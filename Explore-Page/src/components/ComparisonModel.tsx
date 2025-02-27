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
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full">
        <h2 className="text-xl font-bold mb-4">Comparison Chart</h2>
        <table className="min-w-full border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 p-2">Name</th>
              <th className="border border-gray-300 p-2">Age</th>
              <th className="border border-gray-300 p-2">Type</th>
              <th className="border border-gray-300 p-2">Image</th>
              {/* Add more headers as needed */}
            </tr>
          </thead>
          <tbody>
            {models.map((model) => (
              <tr key={model.id}>
                <td className="border border-gray-300 p-2">{model.name}</td>
                <td className="border border-gray-300 p-2">{model.age}</td>
                <td className="border border-gray-300 p-2">{model.type}</td>
                <td className="border border-gray-300 p-2">
                  <img
                    src={model.image}
                    alt={model.name}
                    className="w-16 h-16 object-cover"
                  />
                </td>
                {/* Add more cells as needed */}
              </tr>
            ))}
          </tbody>
        </table>
        <button
          onClick={onClose}
          className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default ComparisonModal;
