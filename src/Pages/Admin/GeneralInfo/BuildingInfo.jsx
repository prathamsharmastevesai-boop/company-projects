import DocumentManager from "../../../Component/DocumentManager";
import { useLocation } from "react-router-dom";

export const BuildingInfo = () => {
  const location = useLocation();
  const buildingId = location?.state?.buildingId;
  const category = location?.state?.category;

  const handleUpload = async (files) => {
    if (!files || files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("category", category);
    formData.append("building_id", buildingId);

    try {
      const response = await fetch("/building/files/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Upload success:", data);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  return (
    <DocumentManager
      category={category}
      title="Building Information Data"
      description={`Upload and manage documents for ${category}`}
      building_Id={buildingId}
      onUpload={handleUpload}
    />
  );
};
