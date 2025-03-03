import { useState } from "react";

const LoginPage = () => {
  const [role, setRole] = useState<"business" | "model" | null>(null);

  return (
    <div className="flex min-h-screen bg-orange-50 w-screen min-w-[360px]">
      {/* Left side image */}
      <div className="hidden lg:flex lg:w-1/2 bg-orange-50">
        <img
          src="/model-3.jpg" // Add your image to the public folder
          alt="Login"
          className="object-cover w-full h-full"
        />
      </div>

      {/* Right side content */}
      <div className="flex flex-col items-center justify-center w-full lg:w-1/2 lg:bg-white bg-white p-8">
        {/* Logo */}
        <div className="mt-[3vh]">
          <img
            src="/logo-orange.png" 
            alt="Company Logo"
            className="h-48 w-auto"
          />
        </div>

        {/* Login Card - Wrapped in a div that maintains center position */}
        <div className="flex items-center justify-center w-full">
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
            <div className="relative w-full max-w-md p-8 rounded-lg">

              {/* Back button */}
              <button 
                onClick={() => setRole(null)}
                className="absolute right-8 -bottom-6 text-orange-600 hover:text-orange-700 flex items-center bg-white gap-2"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Back
              </button>

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
    </div>
  );
};

export default LoginPage;