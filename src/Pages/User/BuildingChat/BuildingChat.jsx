import { useLocation } from "react-router-dom";
import { ChatWindow } from "../../../Component/ChatWindow";

export const BuildingChat = () => {
  const location = useLocation();

  const buildingId = location?.state?.buildingId;
  const category = location?.state?.category;

  console.log(buildingId, category, "building data");

  return (
    <ChatWindow
      category={category}
      heading="💬 Building Information"
      building_id={buildingId}
    />
  );
};
