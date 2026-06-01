import { useAuth } from '../context/AuthContext';
import { useFaculty } from '../context/FacultyContext';

/**
 * Returns a department short-code when the user is a super admin
 * with a non-UVT faculty selected, or undefined for the global view.
 */
export function useScopedDepartmentParam(): string | undefined {
  const { user } = useAuth();
  const { state } = useFaculty();

  if (user?.current_role !== 'super_administrator') return undefined;
  if (state.currentFaculty === 'UVT') return undefined;

  return state.currentFaculty;
}
