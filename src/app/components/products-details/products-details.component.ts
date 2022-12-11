import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatOptionSelectionChange } from '@angular/material/core';
import {
  BehaviorSubject,
  debounceTime,
  map,
  NEVER,
  Observable,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { TaxCode } from 'src/app/shared/enums/tax-code';
import { ProductDetail } from 'src/app/shared/interfaces/product-detail';
import { Product } from '../../shared/interfaces/product';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.css'],
})
export class ProductsDetailsComponent implements OnInit {
  supplierName: string = '';
  location: string = '';
  supplierInvoiceNumber: string = '';
  notes: string = '';

  // *Note: assuming that supplier invoice number only contain digits (0-9) and is atleast 3 digits long
  supplierInvoiceNumberPattern = new RegExp(/[0-9]{3,}/);

  productVariantControl = new FormControl();
  productOptions$: Observable<Product[]> = of([] as Product[]);
  filteredProductOptions$: Observable<Product[]> = of([] as Product[]);

  // TODO: cleanup variable names
  previouslySelectedProducts: ProductDetail[] = [];
  _selectedProducts = new BehaviorSubject([] as ProductDetail[]);
  selectedProducts$ = this._selectedProducts.asObservable();

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

  handleSelectionChange(event: MatOptionSelectionChange) {
    const selectedProduct = event.source.value as Product;

    this.previouslySelectedProducts.push({
      ...selectedProduct,
      newCost: 0,
      newQty: 0,
      taxCode: TaxCode.ValueAddedTax,
    });

    this._selectedProducts.next(this.previouslySelectedProducts);
  }
}
