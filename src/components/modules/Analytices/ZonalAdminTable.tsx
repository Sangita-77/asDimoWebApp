import React from 'react';
import { useNavigate } from 'react-router-dom';
import Table from '../../ui/Table.tsx';
import Loader from '../../ui/Loaders';
import DashboardButtons from '../../ui/Buttons';
import { routes } from '../../../routes/AppRoutes';
import IButton from "../../../assets/Images/iButton.svg";


interface ZonalAdminTableProps {
  rows: Array<{
    zonaladminname: string;
    location: string;
    numberadmins: number;
    numberorganizations: number;
    numbertherapists: number;
    numbersubscriptions: number;
    numberpes: number;
    userId: string | number;
  }>;
  loading?: boolean;
}

const ZonalAdminTable: React.FC<ZonalAdminTableProps> = ({ rows, loading = false }) => {
  const navigate = useNavigate();

  const handleViewDetails = (userId: string | number) => {
    navigate(routes.SUP_ZONALADMIN_DETAILS, {
      state: { userId },
    });
  };

  const columns = [
    {
      key: 'zonaladminname',
      title: 'Name',
    },
    {
      key: 'location',
      title: 'Location',
    },
    {
      key: 'numberadmins',
      title: 'Admins',
    },
    {
      key: 'numberorganizations',
      title: 'Organizations',
    },
    {
      key: 'numbertherapists',
      title: 'Therapists',
    },
    {
      key: 'numbersubscriptions',
      title: 'Subscriptions',
    },
    {
      key: 'numberpes',
      title: 'PE',
    },
    {
      key: "action",
      title: "Action",
      render: (_: any, row: any) => (
        <DashboardButtons
          className="appointment_view"
          text="View Details"
          icon={<img src={IButton} alt="view" className="btn-icon" />}
          variant="trashparent"
          onClick={() => handleViewDetails(row.userId)}
        />
      ),
    },
  ];

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Table columns={columns} rows={rows} pagination displayLimit={8} selectable />
    </>
  );
};

export default ZonalAdminTable;
