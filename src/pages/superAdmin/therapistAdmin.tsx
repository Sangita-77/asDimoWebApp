import ZonalAdminList from "../../components/modules/zonalAdminList";
import { Heading1 } from "../../components/ui/HeadingPara";

const SupTherapist: React.FC = () => {

  return (
    <>
      <Heading1 text="Therapist Admin" />
      {/* <ZonalAdminList /> */}
      <ZonalAdminList
        flag={3}
        columns={[
          { key: "name", title: "Name", sortable: true },
          { key: "admin_name", title: "Admin", sortable: true },
          { key: "organization_name", title: "Organization", sortable: true },
        //   { key: "email", title: "Email", sortable: true },
          { key: "parent_count", title: "User", sortable: true },
          { key: "subscription", title: "Subscription", sortable: true },
          { key: "location", title: "Location" },
        ]}
      />
    </>
  );
};

export default SupTherapist;