import { useState, useEffect } from "react";
import { fetchData } from "./api";

export type ModelInfo = {
  id: string;
  name: string;
  age: number;
  image: string;
  height: number;
  eyeColor: string;
  bodyType: string;
  workField: string;
  gender: string;
  skinTone: string;
  experience: string;
  location: string;
};

export type BusinessInfo = {
  id: string;
  name: string;
  workField: string;
  location: string;
  image: string;
};

export function useModelsAndBusinesses() {
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [businesses, setBusinesses] = useState<BusinessInfo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchModelsAndBusinesses = async () => {
      setLoading(true);
      try {
        // Fetch model IDs
        const modelIds: string[] = await fetchData(
          "ModellaPreference/brand-Model-preference-matched-ids",
          { method: "POST", body: JSON.stringify({}) }
        );

        // Fetch business IDs
        const businessIds: string[] = await fetchData(
          "ModellaPreference/Model-brand-preference-matched-ids",
          { method: "POST", body: JSON.stringify({}) }
        );

        // Fetch model details
        const modelDetails = await Promise.all(
          modelIds.map(async (id) => {
            const user = await fetchData(`users/${id}`);
            const imageRes = await fetchData(
              `files/files/latest?user_id=${id}&folder=profile-pic`
            );
            const tags = await fetchData(`ModellaTag/tags/models/${id}`);

            return {
              id,
              name: user.name,
              age: tags?.age || "Unknown",
              image: imageRes?.s3_url || "/placeholder.svg",
              height: tags?.height || "Unknown",
              eyeColor: tags?.natural_eye_color || "Unknown",
              bodyType: tags?.body_Type || "Unknown",
              workField: tags?.work_Field || "Unknown",
              gender: tags?.gender || "Unknown",
              skinTone: tags?.skin_Tone || "Unknown",
              experience: tags?.experience_Level || "Unknown",
              location: tags?.location || "Unknown",
            };
          })
        );

        // Fetch business details
        const businessDetails = await Promise.all(
          businessIds.map(async (id) => {
            const user = await fetchData(`users/${id}`);
            const imageRes = await fetchData(
              `files/files/latest?user_id=${id}&folder=profile-pic`
            );
            const tags = await fetchData(`ModellaTag/tags/brands/${id}`);

            return {
              id,
              name: user.name,
              workField: tags?.work_Field || "Unknown",
              location: tags?.location || "Unknown",
              image: imageRes?.s3_url || "/placeholder.svg",
            };
          })
        );

        setModels(modelDetails);
        setBusinesses(businessDetails);
        console.log("Models", modelDetails);
        console.log("Business", businessDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchModelsAndBusinesses();
  }, []);

  return { models, businesses, loading };
}
