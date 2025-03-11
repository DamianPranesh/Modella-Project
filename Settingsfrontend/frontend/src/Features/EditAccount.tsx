import { useState } from "react";

const EditAccount = () => {
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [modelType, setModelType] = useState("fashion");
  const [portfolio, setPortfolio] = useState("");
  const [image, setImage] = useState<File | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, address, modelType, portfolio, image });
    alert("Profile updated!");
  };

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-md shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-[#D4825E]">Edit Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-700 font-medium">Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-gray-700 font-medium">Address</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>

        {/* Model Type Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium">Model Type</label>
          <select
            className="w-full p-2 border rounded-md"
            value={modelType}
            onChange={(e) => setModelType(e.target.value)}
          >
            <option value="fashion">Fashion</option>
            <option value="commercial">Commercial</option>
            <option value="fitness">Fitness</option>
            <option value="plus-size">Plus-Size</option>
          </select>
        </div>

        {/* Portfolio */}
        <div>
          <label className="block text-gray-700 font-medium">Portfolio Link</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={portfolio}
            onChange={(e) => setPortfolio(e.target.value)}
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-medium">Upload Profile Image</label>
          <input
            type="file"
            accept="image/*"
            className="w-full p-2 border rounded-md"
            onChange={handleImageChange}
          />
          {image && <p className="text-sm text-gray-600 mt-1">Selected: {image.name}</p>}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-[#D4825E] text-white p-2 rounded-md font-medium hover:bg-[#b56a4a]"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default EditAccount;
