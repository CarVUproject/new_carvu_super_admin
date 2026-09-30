import { Pagination } from './common';

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  is_active: boolean;
  is_dealer: boolean;
  avatar: string | null;
  roles: string[];
  created_at: string;
  last_login: string | null;
}

export type Address = {
  country: string;
  state: string;
  city: string;
  street: string;
  postal_code: string;
};

export type Dealer = {
  id: string;
  primary_address: Address;
  shipping_address: Address[];
  mailing_address: Address[];
  dealer_class: string;
  business_type: string;
  operating_name: string;
  dealership_email: string;
  dealership_phone: string;
  business_number: string;
  omvic_number: string;
  tax_id: string;
  business_website: string;
  status: 'pending' | 'approved' | 'rejected';
  user: User;
};
