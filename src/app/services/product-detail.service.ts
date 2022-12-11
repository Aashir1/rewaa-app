import { Injectable } from '@angular/core';
import { TaxCode } from '../shared/enums/tax-code';
import { ProductDetail } from '../shared/interfaces/product-detail';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailService {
  calculateTax(item: ProductDetail) {
    if (item.taxCode === TaxCode.NoTax) {
      return 0;
    }

    return this.calculateCost(item) * 0.15;
  }

  calculateCost(item: ProductDetail, withTax: boolean = false) {
    let tax = 0;
    if (withTax) {
      tax = this.calculateTax(item);
    }

    return item.newCost * item.newQty + tax;
  }
}
