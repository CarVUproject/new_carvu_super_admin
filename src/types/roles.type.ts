// Roles Type Definitions
export interface Permission {
  module: string;
  code: string;
  name: string;
}

export interface Role {
  permissions: Permission[];
  name: string;
  is_active: boolean;
}

export type RolesResponseType = Role[];

// Create and Update Role Type Definitions
export interface CreateUpdateRoleType {
  permissions: string[];
  name: string;
  is_active: boolean;
}

// Modules Type Definitions
export interface Module {
  permissions: Permission[];
  code: string;
  name: string;
}

export type ModulesResponseType = {
  results: Module[];
  count: number;
  next: string | null;
  previous: string | null;
};
