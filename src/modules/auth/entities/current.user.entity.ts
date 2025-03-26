import { UserRole } from '../../users/enums/user-role';

export interface CurrentUser {
  id: string;
  uid: string;
  email: string;
  name: string;
  role?: UserRole;
}
