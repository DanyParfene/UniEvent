import { useUsers, useUpdateUserRole } from "../../api/users";
import { ROLE_LABELS, ROLE_VALUES, type UserRole } from "../../api/api-types";

const UsersList = () => {
  const { data: users } = useUsers();
  const updateRole = useUpdateUserRole();

  const sortedUsers = [...users].sort((a, b) => {
    const aEmail = a.email.split("@")[1] ?? "";
    const bEmail = b.email.split("@")[1] ?? "";
    if (aEmail < bEmail) return -1;
    if (aEmail > bEmail) return 1;
    return a.name.localeCompare(b.name, "ro");
  });

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    updateRole.mutate({ id: userId, role_name: newRole });
  };

  return (
    <div className="w-full flex flex-col gap-4">
      <h2 className="text-lg font-bold text-text-secondary mb-2">
        Administrare Utilizatori
      </h2>

      <div className="flex flex-col border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-200 shadow-sm">
        {sortedUsers.map((user) => (
          <div
            key={user.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-white hover:bg-gray-50 transition-colors gap-4"
          >
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="flex items-start sm:items-center gap-3 flex-col sm:flex-row">
                <span className="font-bold text-gray-900 break-words">
                  {user.name}
                </span>
              </div>
              <a
                href={`mailto:${user.email}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline break-all"
              >
                {user.email}
              </a>
            </div>

            <div className="w-full sm:w-52 shrink-0">
              <select
                value={user.current_role}
                onChange={(e) =>
                  handleRoleChange(user.id, e.target.value as UserRole)
                }
                disabled={updateRole.isPending}
                className="w-full bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary block p-2.5 cursor-pointer outline-none transition-all shadow-sm hover:border-gray-400 text-ellipsis overflow-hidden whitespace-nowrap disabled:opacity-60"
              >
                {ROLE_VALUES.map((role) => (
                  <option key={role} value={role} className="font-medium">
                    {ROLE_LABELS[role]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
        {users.length === 0 && (
          <div className="p-6 text-center text-gray-400">
            Nu există utilizatori înregistrați.
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersList;
