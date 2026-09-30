import { Pagination } from '@/types/common';
import { Dealer } from '@/types/dealerType';

export type GetDealersRes = Pagination & {
  results: Dealer[];
};

export type GetDealerRes = Dealer;
