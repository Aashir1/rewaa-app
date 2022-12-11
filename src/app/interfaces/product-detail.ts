import { TaxCode } from '../enums/tax-code';
import { Product } from './product';

export interface ProductDetail extends Product {
  newQty: number;
  newCost: number;
  taxCode: TaxCode;
}
