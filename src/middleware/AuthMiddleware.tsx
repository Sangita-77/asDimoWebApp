import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import { routes } from "../routes/AppRoutes";

type AuthMiddlewareProps = {
  allowedFlags: RoleType[];
  children: ReactNode;
};

export type RoleType =
  | "SuperAdmin"
  | "OrganizationAdmin"
  | "ParentsOrg"
  | "TeachersOrg"
  | "parentsGlobal"
  | "teachersGlobal"
  | "zonalAdmin"
  | "Admin";

type StoredUser = {
  flag: number;
};

export const roleTypeByFlag: Record<number, RoleType> = {
  0: "SuperAdmin",
  1: "OrganizationAdmin",
  2: "ParentsOrg",
  3: "TeachersOrg",
  4: "parentsGlobal",
  5: "teachersGlobal",
  6: "zonalAdmin",
  7: "Admin",
};

export const routeByRoleType: Partial<
  Record<RoleType, string>
> = {
  SuperAdmin: routes.SUPERADMIN,
  OrganizationAdmin: routes.ORGANIZATIONADMIN,
  zonalAdmin: routes.ZONALADMIN,
  Admin: routes.ADMIN,
};

export const getRoleTypeByFlag = (
  flag: number
): RoleType | null => {
  return roleTypeByFlag[flag] ?? null;
};

export const getRouteByFlag = (flag: number) => {
  const roleType = getRoleTypeByFlag(flag);

  if (!roleType) {
    return routes.LOGIN;
  }

  return routeByRoleType[roleType] ?? routes.LOGIN;
};

export const getStoredUser = (): StoredUser | null => {
  const user = localStorage.getItem("user");

  if (!user) {
    return null;
  }

  try {
    return JSON.parse(user) as StoredUser;
  } catch {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    return null;
  }
};

export const getCurrentUserRole = (): RoleType | null => {
  const user = getStoredUser();

  if (!user) {
    return null;
  }

  return getRoleTypeByFlag(user.flag);
};

function AuthMiddleware({
  allowedFlags,
  children,
}: AuthMiddlewareProps) {
  const location = useLocation();

  const token = localStorage.getItem("token");

  const user = getStoredUser();

  if (!token || !user) {
    return (
      <Navigate
        to={routes.LOGIN}
        replace
        state={{ from: location }}
      />
    );
  }

  const roleType = getRoleTypeByFlag(user.flag);

  if (
    !roleType ||
    !allowedFlags.includes(roleType)
  ) {
    return (
      <Navigate
        to={getRouteByFlag(user.flag)}
        replace
      />
    );
  }

  return children;
}

export default AuthMiddleware;