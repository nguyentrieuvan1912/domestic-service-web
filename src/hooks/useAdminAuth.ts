import { useIdentitySession } from './useIdentitySession'

export function useAdminAuth() { return useIdentitySession('ADMIN') }
