export type UserType = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar: string;
  roles: [{ [key: string]: any }];
  is_active: boolean;
  is_dealer: boolean;
  dealer: [{ [key: string]: any }];
  is_superuser: boolean;
};
