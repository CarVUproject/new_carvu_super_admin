import { z } from 'zod';

export const superAdminDealerApprovalSchema = z.object({
  roles: z.array(z.string()).min(1, 'Select at least one role'),
});

export type SuperAdminDealerApprovalFormValues = z.infer<typeof superAdminDealerApprovalSchema>;
