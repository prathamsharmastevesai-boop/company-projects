import DocumentManager from "../../../Component/DocumentManager";
import { useLocation } from "react-router-dom";

export const BuildingInfo = () => {
  const location = useLocation();

  const buildingId = location?.state?.office?.buildingId;
  console.log(buildingId, "buildingId");

  return (
    <DocumentManager
      category="Building"
      title="Building Information Data"
      description="Upload and manage documents for Building Information"
      building_Id={buildingId}
    />
  );
};
