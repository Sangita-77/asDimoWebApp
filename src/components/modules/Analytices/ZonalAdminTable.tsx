import React from 'react';
import Table from '../../ui/Table.tsx';
import Loader from '../../ui/Loaders';

interface ZonalAdminTableProps {
  rows: Array<{
    zonaladminname: string;
    location: string;
    numberadmins: number;
  }>;
  loading?: boolean;
}

const ZonalAdminTable: React.FC<ZonalAdminTableProps> = ({ rows, loading = false }) => {
  const columns = [
    {
      key: 'zonaladminname',
      title: 'Zonal Admin Name',
    },
    {
      key: 'location',
      title: 'Location',
    },
    {
      key: 'numberadmins',
      title: 'Number Admins',
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
