import { createContext, useContext, useState, ReactNode } from "react";

type Role = string | null;

const RoleContext = createContext<{
  role: Role;
  setRole: (role: Role) => void;
}>({
  role: null,
  setRole: () => {},
});

export const RoleProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<Role>(null);
  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);