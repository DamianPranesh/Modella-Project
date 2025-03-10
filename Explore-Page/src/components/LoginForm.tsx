import React, { useState } from 'react';
import { AlertCircle, Check } from 'lucide-react';

const countries = [
    "United States", "Canada", "United Kingdom", "Australia", "Germany",
    "France", "Japan", "China", "India", "Brazil", "Mexico",
    "South Africa", "Russia", "Italy", "Spain", "Sri Lanka",
  ];
  
  const countryToCodes: Record<string, string> = {
    "United States": "+1",
    "Canada": "+1",
    "United Kingdom": "+44",
    "Australia": "+61",
    "Germany": "+49",
    "France": "+33",
    "Japan": "+81",
    "China": "+86",
    "India": "+91",
    "Brazil": "+55",
    "Mexico": "+52",
    "South Africa": "+27",
    "Russia": "+7",
    "Italy": "+39",
    "Spain": "+34",
    "Sri Lanka": "+94",
  };
  
  interface ModelFormData {
    fullName: string;
    age: string;
    height: string;
    weight: string;
    country: string;
    address: string;
    phoneNumber: string;
    email: string;
  }

export function LoginForm() {
  const [formData, setFormData] = useState<ModelFormData>({
    fullName: '',
    age: '',
    height: '',
    weight: '',
    country: '',
    address: '',
    phoneNumber: '',
    email: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      country: value,
      phoneNumber: countryToCodes[value] ? countryToCodes[value] + ' ' : ''
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
  
    // Add country validation
    if (!formData.country) {
      newErrors.country = "Please select your country";
    }
  
    // Add phone number validation
    if (!formData.phoneNumber.startsWith(countryToCodes[formData.country] || '')) {
      newErrors.phoneNumber = "Invalid phone number format for selected country";
    }
  
    if (Object.keys(newErrors).length === 0) {
      console.log('Form submitted:', formData);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } else {
      setErrors(newErrors);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-8 py-6">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Model Registration</h2>
          <p className="text-center text-gray-600 mb-8">Enter your information below</p>

          {submitted && (
            <div className="mb-6 p-4 bg-green-50 rounded-lg flex items-center">
              <Check className="h-5 w-5 text-green-500 mr-2" />
              <span className="text-green-700">Registration successful!</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Full Name */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DD8560] focus:border-transparent"
                  required
                />
              </div>

              {/* Age */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Age
                </label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DD8560] focus:border-transparent"
                  required
                />
              </div>

              {/* Height */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Height (cm)
                </label>
                <input
                  type="number"
                  name="height"
                  value={formData.height}
                  onChange={handleChange}
                  min="120"
                  max="250"
                  step="1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DD8560] focus:border-transparent"
                  required
                />
              </div>

              {/* Weight */}
              <div className="form-group">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleChange}
                  min="30"
                  max="180"
                  step="0.1"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DD8560] focus:border-transparent"
                  required
                />
              </div>

              {/* Country selection */}
                <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Country
                </label>
                <select
                    name="country"
                    value={formData.country}
                    onChange={(e) => handleCountryChange(e.target.value)}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DD8560] focus:border-transparent"
                    required
                >
                    <option value="">Select your country</option>
                    {countries.map((country) => (
                    <option key={country} value={country}>
                        {country}
                    </option>
                    ))}
                </select>
                </div>

              {/* Email */}
              <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DD8560] focus:border-transparent"
                  required
                />
              </div>

              {/* Address */}
              <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DD8560] focus:border-transparent"
                  required
                />
              </div>

              {/* Phone Number */}
              <div className="form-group md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#DD8560] focus:border-transparent"
                  required
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                className="w-full md:w-auto px-8 py-3 rounded-lg bg-[#DD8560] text-white hover:bg-[#c77751] transition-colors duration-200 font-medium"
              >
                Submit Registration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}