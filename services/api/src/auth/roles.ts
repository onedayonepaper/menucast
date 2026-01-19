export type Role = 'OWNER' | 'STAFF';

export function isRole(x: any): x is Role {
  return x === 'OWNER' || x === 'STAFF';
}
