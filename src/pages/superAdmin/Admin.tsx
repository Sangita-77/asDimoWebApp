import AdminList from "../../components/modules/AdminList";
import { Heading1 } from "../../components/ui/HeadingPara";

const SupAdmin: React.FC = () => {
  return (
    <>
      <Heading1 text="Admin" />
      <AdminList />
    </>
  );
};

export default SupAdmin;