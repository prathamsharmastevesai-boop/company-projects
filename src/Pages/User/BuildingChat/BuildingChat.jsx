import { useLocation } from "react-router-dom";
import { ChatWindow } from "../../../Component/ChatWindow";

export const BuildingChat = () => {
  const location = useLocation();
  const buildingId = location?.state?.office?.buildingId;

  return (
    <ChatWindow
      category="Building"
      heading="💬 Building Information"
      building_id={buildingId}
    />
  );
};
