import React from "react";

export interface ProfileRow {
  id: number;
  profileImage?: string;
  name?: string;
  designation?: string;
  date?: string;
  time?: string;
  status?: string;

  [key: string]: any;
}

interface TableHeader {
  key: string;
  title: string;
}

interface ProfileTableProps {
  headers: TableHeader[];
  data: ProfileRow[];
}

const ProfileTable: React.FC<ProfileTableProps> = ({
  headers,
  data,
}) => {
  return (
    <div className="AnalyticsCardTable">
      <table className="profile-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header.key}>{header.title}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              {headers.map((header) => (
                <td key={header.key}>
                  {header.key === "doctor" ? (
                    <div className="doctor-info">
                      {row.profileImage && (
                        <img
                          src={row.profileImage}
                          alt={row.name || ""}
                          className="doctor-image"
                        />
                      )}

                      <div>
                        <h5>{row.name ?? "-"}</h5>
                        <p>{row.designation ?? "-"}</p>
                      </div>
                    </div>
                  ) : header.key === "status" ? (
                    row.status ? (
                      <span
                        className={`status-badge ${row.status.toLowerCase()}`}
                      >
                        {row.status}
                      </span>
                    ) : (
                      "-"
                    )
                  ) : (
                    row[header.key] ?? "-"
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProfileTable;