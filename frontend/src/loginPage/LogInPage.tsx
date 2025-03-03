import { useState } from "react";

const LoginPage = () => {
  const [role, setRole] = useState<"business" | "model" | null>(null);

  return (
    <div className="flex min-h-screen">
      {/* Left side image */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-50">
        <img
          src="/model-3.jpg" // Add your image to the public folder
          alt="Login"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side content */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 bg-white p-8">
        {!role ? (
          <div className="w-full max-w-md p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-orange-600">Select Your Role</h2>
            <button
              onClick={() => setRole("business")}
              className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md mb-4 w-full transition-colors"
            >
              Login as Business
            </button>
            <button
              onClick={() => setRole("model")}
              className="px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md w-full transition-colors"
            >
              Login as Model
            </button>
          </div>
        ) : (
          <div className="w-full max-w-md p-8 rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-orange-600">
              {role === "business" ? "Business Login" : "Model Login"}
            </h2>
            <input
              type="email"
              placeholder="Email"
              className="w-full p-3 border-2 border-orange-200 rounded-md mb-4 focus:outline-none focus:border-orange-500 transition-colors text-black"
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-3 border-2 border-orange-200 rounded-md mb-4 focus:outline-none focus:border-orange-500 transition-colors text-black"
            />
            <button className="w-full px-4 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors">
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;