import { useLocation } from "react-router-dom";
import { ChatWindow } from "../../../Component/ChatWindow";

export const ComparativeBuildingChat = () => {
  const location = useLocation();
  const buildingId = location?.state?.office?.buildingId;

  console.log(buildingId, "buildingIdbuildingId");

  return (
    <ChatWindow
      category="ComparativeBuilding"
      heading="💬 Comparative Building Chat"
      building_id={buildingId}
    />
  );
};
