import Table from "../../ui/Table.tsx";
const AppointmentTable: React.FC = () => { 

  const columns = [
    {
      key: "zonaladminname",
      title: "Zonal Admin Name",
    },
    {
      key: "location",
      title: "Location",
    },
    {
      key: "numberadmins",
      title: "Number Admins",
    },
  ];

  const rows = [
    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },
    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },
        {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },    {
      zonaladminname: "P.K.Chakraborty",
      location: "Chandigarh, India",
      numberadmins: 10,
    },
  ];

     return (
        <>
       <Table columns={columns} rows={rows} pagination displayLimit={8} selectable />
        </>
      );
};

export default AppointmentTable;