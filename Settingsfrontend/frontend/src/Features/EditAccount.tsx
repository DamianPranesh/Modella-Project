import { useState } from "react";

const EditAccount = () => {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    modelType: "",
    portfolio: "",
    image: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold">Edit Account</h2>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} className="border p-2 w-full mt-2" />
      <input type="text" name="address" placeholder="Address" onChange={handleChange} className="border p-2 w-full mt-2" />
      <input type="text" name="modelType" placeholder="Model Type" onChange={handleChange} className="border p-2 w-full mt-2" />
      <input type="text" name="portfolio" placeholder="Portfolio Link" onChange={handleChange} className="border p-2 w-full mt-2" />
      <input type="file" name="image" onChange={handleFileChange} className="border p-2 w-full mt-2" />
      <button className="mt-4 bg-orange-500 text-white px-4 py-2">Save Changes</button>
    </div>
  );
};

export default EditAccount;
