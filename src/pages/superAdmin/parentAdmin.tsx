import GlobalTableList from "../../components/modules/GlobalTableList";
import { Heading1 } from "../../components/ui/HeadingPara";
import { getCurrentUserRole } from "../../middleware/AuthMiddleware";
import { tokenManager } from "../../services/tokenManager";

const SupParent: React.FC = () => {
  const role = getCurrentUserRole();
  const user = tokenManager.getUser();
  const filteredUserId = role === "teachersGlobal" ? user?.userId : undefined;

  return (
    <>
      <Heading1 text="Parent Admin" />
      {/* <ZonalAdminList /> */}
      <GlobalTableList
        // flag={2}
        flag={[2, 4]}
        columns={[
          { key: "parent_name", title: "Users", sortable: true,},
          { key: "children_details", title: "Children Details", sortable: true },
          { key: "admin_name", title: "Admin", sortable: true },
          { key: "organization_name", title: "Organization", sortable: true },
          { key: "location", title: "Location" },
        //   { key: "email", title: "Email", sortable: true },
          { key: "subscription", title: "Subscription", sortable: true },
          { key: "created", title: "Created", sortable: true },
        ]}
        filteredUserId={filteredUserId}
      />
    </>
  );
};

export default SupParent;