import { useParams } from "react-router-dom";

const SuperAdminOrderDetailsPage = () => {
  const orderId = useParams();
  console.log("OrderId", orderId);
  return <div>SuperAdminOrderDetailsPage</div>;
};

export default SuperAdminOrderDetailsPage;
