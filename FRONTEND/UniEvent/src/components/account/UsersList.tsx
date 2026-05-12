import { useState, useEffect } from "react";

export type Role = "Coordonator" | "Administrator de Departament" | "Super Administrator";

export type Faculty = 
  | "ARTE" | "CBG" | "DREPT" | "FEAA" | "FEFS" 
  | "FFM" | "INFO" | "FLIFT" | "FMT" | "FPSE" 
  | "FSAS" | "FSGC";

export interface UserData {
  id: string;
  name: string;
  email: string;
  faculty: Faculty;
  role: Role;
}

const MOCK_USERS: UserData[] = [
  // Am adaugat un nume exagerat de lung ca sa testam comportamentul de text-wrapping
  { id: "1", name: "Ionescu Maria-Alexandra Constantinescu", email: "maria.ionescu.departament@arte.ro", faculty: "ARTE", role: "Coordonator" },
  { id: "2", name: "Popescu Ion", email: "ion.popescu.admin.super.lung@info.ro", faculty: "INFO", role: "Super Administrator" },
  { id: "3", name: "Andrei Vasile", email: "vasile@feaa.ro", faculty: "FEAA", role: "Administrator de Departament" },
  { id: "4", name: "Georgescu Ana", email: "ana@info.ro", faculty: "INFO", role: "Coordonator" },
  { id: "5", name: "Dumitru Elena", email: "elena@drept.ro", faculty: "DREPT", role: "Administrator de Departament" },
];

const ROLES: Role[] = ["Coordonator", "Administrator de Departament", "Super Administrator"];

const UsersList = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const sortedUsers = [...MOCK_USERS].sort((a, b) => {
        if (a.faculty < b.faculty) return -1;
        if (a.faculty > b.faculty) return 1;
        return a.name.localeCompare(b.name, 'ro'); 
      });

      setUsers(sortedUsers);
      setIsLoading(false);
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (userId: string, newRole: Role) => {
    setUsers((prevUsers) => 
      prevUsers.map((user) => 
        user.id === userId ? { ...user, role: newRole } : user
      )
    );
    console.log(`Updated user ${userId} to role: ${newRole}`);
  };

  if (isLoading) {
    return (
      <div className="w-full text-center py-8 text-gray-500 font-medium">
        Se încarcă lista de utilizatori...
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-lg font-bold text-text-secondary mb-2">
        Administrare Utilizatori
      </h2>
      
      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 shadow-sm">
        {users.map((user) => (
          <div 
            key={user.id} 
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors gap-4"
          >
            
            {/* Partea stângă: Nume, Facultate și Email */}
            <div className="flex-1 flex flex-col gap-1.5">
              
              <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
                <span className="font-bold text-gray-900 break-words">
                  {user.name}
                </span>
                <span className="bg-gray-100 text-gray-600 font-bold px-2.5 py-0.5 rounded-md text-xs shrink-0 border border-gray-200">
                  {user.faculty}
                </span>
              </div>

              {/* break-all asigură că un email imens, fără spații, se sparge corect pe mai multe rânduri și nu rupe design-ul */}
              <a 
                href={`mailto:${user.email}`} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {user.email}
              </a>
            </div>

            {/* Partea dreaptă: Dropdown */}
            {/* Lățime fixă mai mică: w-44 (176px). Aici dropdown-ul va arăta identic pe fiecare rând */}
            <div className="w-full sm:w-44 shrink-0">
              <select
                value={user.role}
                onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                className="w-full bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-2.5 cursor-pointer outline-none transition-all shadow-sm hover:border-gray-400 text-ellipsis overflow-hidden whitespace-nowrap"
              >
                {ROLES.map((role) => (
                  <option key={role} value={role} className="font-medium">
                    {role}
                  </option>
                ))}
              </select>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersList;