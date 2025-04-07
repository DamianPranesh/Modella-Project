import { useState } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { UserCircle2, Building2, ArrowRight } from 'lucide-react';

export const SelectRole = () => {
  const [selectedType, setSelectedType] = useState<'model' | 'business' | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const { getAccessTokenSilently } = useAuth0();
  const navigate = useNavigate();

  const handleSelection = (type: 'model' | 'business') => {
    setSelectedType(type);
  };

  const handleConfirm = async () => {
    if (!selectedType) return;

    setIsAnimating(true);
    
    try {
      // Get the token
      const token = await getAccessTokenSilently();
      
      // Call your API to update the user's role
      const response = await fetch('http://modella-project.up.railway.app/api/select-role', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ role: selectedType })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update role');
      }
      
      // Wait for the animation
      setTimeout(() => {
        // Redirect based on the selected role
        navigate('/settings');
      }, 500);
      
    } catch (error) {
      console.error('Error updating user role:', error);
      setIsAnimating(false);
    }
  };

  return (
    <div
      // Main container with dynamic classes for animation
      className={`min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DD8560]/20 via-[#DD8560]/5 to-white p-4 transition-opacity duration-500 ${
        isAnimating ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="relative w-full max-w-3xl mx-auto">
        {/* Subtle brand-colored accent circles */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-[#DD8560]/30 rounded-full blur-2xl" />
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-[#DD8560]/30 rounded-full blur-2xl" />

        <div className="relative space-y-8">
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 text-[#DD8560]">
            Choose Your Path
          </h1>
          <p className="text-center text-gray-600 max-w-xl mx-auto text-base">
            Select whether you're a model looking for opportunities or a
            business seeking talent
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Model Option */}
            <button
              onClick={() => handleSelection("model")}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300
                border-2 
                ${
                  selectedType === "model"
                    ? "border-[#DD8560] bg-[#DD8560] shadow-lg"
                    : "border-[#DD8560]/20 hover:border-[#DD8560] bg-white/80 hover:bg-white"
                }`}
            >
              <div className="relative z-10 group-hover:transform group-hover:translate-y-[-4px] transition-transform duration-300">
                <UserCircle2
                  className={`w-14 h-14 mb-4 mx-auto transition-colors
                    ${
                      selectedType === "model" ? "text-white" : "text-[#DD8560]"
                    }`}
                />
                <h2
                  className={`text-xl font-semibold mb-2 text-center transition-colors
                  ${selectedType === "model" ? "text-white" : "text-gray-800"}`}
                >
                  I'm a Model
                </h2>
                <p
                  className={`text-center text-sm transition-colors
                  ${
                    selectedType === "model" ? "text-white/90" : "text-gray-600"
                  }`}
                >
                  Create your portfolio and find opportunities
                </p>
              </div>
            </button>

            {/* Business Option */}
            <button
              onClick={() => handleSelection("business")}
              className={`group relative overflow-hidden rounded-2xl p-6 transition-all duration-300
                border-2
                ${
                  selectedType === "business"
                    ? "border-[#DD8560] bg-[#DD8560] shadow-lg"
                    : "border-[#DD8560]/20 hover:border-[#DD8560] bg-white/80 hover:bg-white"
                }`}
            >
              <div className="relative z-10 group-hover:transform group-hover:translate-y-[-4px] transition-transform duration-300">
                <Building2
                  className={`w-14 h-14 mb-4 mx-auto transition-colors
                    ${
                      selectedType === "business"
                        ? "text-white"
                        : "text-[#DD8560]"
                    }`}
                />
                <h2
                  className={`text-xl font-semibold mb-2 text-center transition-colors
                  ${
                    selectedType === "business" ? "text-white" : "text-gray-800"
                  }`}
                >
                  I'm a Business
                </h2>
                <p
                  className={`text-center text-sm transition-colors
                  ${
                    selectedType === "business"
                      ? "text-white/90"
                      : "text-gray-600"
                  }`}
                >
                  Find and connect with talented models
                </p>
              </div>
            </button>
          </div>

          {selectedType && (
            <div className="mt-8 space-y-4 text-center">
              <p className="text-gray-600">
                You selected:{" "}
                <span className="font-semibold text-[#DD8560]">
                  {selectedType === "model" ? "Model" : "Business"}
                </span>
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <button
                  onClick={() => setSelectedType(null)}
                  className="px-8 py-3 rounded-full text-sm font-medium 
                    text-[#DD8560] border-2 border-[#DD8560] hover:bg-[#DD8560]/5
                    transition-colors duration-300"
                >
                  Change Selection
                </button>
                <button
                  onClick={handleConfirm}
                  className="bg-[#DD8560] text-white px-8 py-3 rounded-full text-sm font-medium 
                    hover:bg-[#C77550] transition-colors duration-300 shadow-md hover:shadow-lg
                    flex items-center gap-2"
                >
                  Confirm Selection
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};