import { UserRole } from '../../users/enums/user-role';

export interface CurrentUser {
  id: string;
  email: string;
  uid: string;
  name: string;
  role: UserRole;
}
