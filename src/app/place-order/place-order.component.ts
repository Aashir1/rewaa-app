import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  map,
  NEVER,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { Product } from '../interfaces/product';
import { ProductService } from '../services/product.service';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.css'],
})
export class PlaceOrderComponent implements OnInit {
  supplierName: string = '';
  location: string = '';
  supplierInvoiceNumber: string = '';
  notes: string = '';

  // *Note: assuming that supplier invoice number only contain digits (0-9) and is atleast 3 digits long
  supplierInvoiceNumberPattern = new RegExp(/[0-9]{3,}/);

  productVariantControl = new FormControl();
  productOptions$: Observable<Product[]> = of([] as Product[]);
  filteredProductOptions$: Observable<Product[]> = of([] as Product[]);

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.productOptions$ = this.productService.getProducts();
    this.filteredProductOptions$ = this.productVariantControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap((value: Product | string) => {
        if (value) {
          const query = typeof value === 'string' ? value : value.description;
          return this._filterProductOptions(query);
        }

        return NEVER;
      })
    );
  }

  private _filterProductOptions(value: string) {
    return this.productOptions$.pipe(
      map((products) =>
        products.filter((each) =>
          each.description.toLowerCase().includes(value.toLowerCase())
        )
      )
    );
  }

  displayOption(option?: Product | null) {
    return option?.description ?? '';
  }
}
