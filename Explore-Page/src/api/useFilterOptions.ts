import { useState, useEffect } from "react";
import { fetchData } from "./api"; // Import the fetchData function

export function useFilterOptions() {
  const [filterOptions, setFilterOptions] = useState({
    eyeColorOptions: [],
    bodyTypeOptions: [],
    workFieldOptions: [],
    skinToneOptions: [],
    genderOptions: [],
    locationOptions: [],
    experienceOptions: [],
  });

  useEffect(() => {
    const fetchOptions = async (category: string) => {
      try {
        return await fetchData(`keywords/filters/${category}`);
      } catch (error) {
        console.error(`Failed to fetch ${category}:`, error);
        return [];
      }
    };

    const loadFilters = async () => {
      const categories = [
        "natural_eye_colors",
        "body_types",
        "work_fields",
        "skin_tones",
        "genders",
        "locations",
        "experience_levels",
      ];

      const results = await Promise.all(categories.map(fetchOptions));

      setFilterOptions({
        eyeColorOptions: results[0],
        bodyTypeOptions: results[1],
        workFieldOptions: results[2],
        skinToneOptions: results[3],
        genderOptions: results[4],
        locationOptions: results[5],
        experienceOptions: results[6],
      });
    };

    loadFilters();
  }, []);

  return filterOptions;
}
