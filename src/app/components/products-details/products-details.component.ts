import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
import { ProductDetailService } from 'src/app/services/product-detail.service';

type PayNowOrLater = 'payNow' | 'payLater';
type PaymentMethod = 'cash' | 'credit' | null;

@Component({
  selector: 'app-products-details',
  templateUrl: './products-details.component.html',
  styleUrls: ['./products-details.component.css'],
})
export class ProductsDetailsComponent implements OnInit {
  @Output() onSubmit = new EventEmitter();

  productVariantControl = new FormControl();
  productOptions$: Observable<Product[]> = of([] as Product[]);
  filteredProductOptions$: Observable<Product[]> = of([] as Product[]);

  productForm = new FormGroup({
    payNowOrLater: new FormControl<PayNowOrLater>('payNow'),
    paymentMethod: new FormControl<PaymentMethod>(null, [Validators.required]),
    paidAmount: new FormControl<number | undefined>(0, [Validators.min(0)]),
    paymentDueDate: new FormControl<Date | undefined>(new Date(), [
      Validators.required,
    ]),
  });

  isPayingNow: boolean = true;

  // TODO: cleanup variable names
  private _previouslySelectedProducts: ProductDetail[] = [];
  private _selectedProducts = new BehaviorSubject([] as ProductDetail[]);
  selectedProducts$ = this._selectedProducts.asObservable();

  constructor(
    private productService: ProductService,
    private productDetailService: ProductDetailService
  ) {}

  ngOnInit() {
    this.productForm.valueChanges.subscribe((change) => {
      this.isPayingNow = change.payNowOrLater === 'payNow';

      if (change.payNowOrLater === 'payLater' && change.paidAmount) {
        const updatedValue = {
          payNowOrLater: 'payLater' as const,
          paidAmount: 0,
          paymentMethod: 'cash' as const,
          paymentDueDate: change.paymentDueDate,
        };

        this.productForm.setValue(updatedValue);
      }
    });

    this.productOptions$ = this.productService.getProducts();
    this.filteredProductOptions$ = this.productVariantControl.valueChanges.pipe(
      debounceTime(300),
      startWith(''),
      switchMap((value: Product | string) => {
        if (value) {
          const query = typeof value === 'string' ? value : value.name;
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
          each.name.toLowerCase().includes(value.toLowerCase())
        )
      )
    );
  }

  displayOption(option?: Product | null) {
    return option?.name ?? '';
  }

  handleSelectionChange(event: MatOptionSelectionChange) {
    const selectedProduct = event.source.value as Product;

    this._previouslySelectedProducts.push({
      ...selectedProduct,
      newCost: 0,
      newQty: 0,
      taxCode: TaxCode.ValueAddedTax,
    });

    this._selectedProducts.next(this._previouslySelectedProducts);
    this.productVariantControl.setValue('');
  }

  handleRemoveItemFromList(product: ProductDetail) {
    this._previouslySelectedProducts = this._previouslySelectedProducts.filter(
      (it) => it.id !== product.id
    );
    this._selectedProducts.next(this._previouslySelectedProducts);
  }

  calculateTotalCost(withTax: boolean = false) {
    let total = 0;

    this._previouslySelectedProducts.forEach((it) => {
      total += this.productDetailService.calculateCost(it, withTax);
    });

    return total;
  }

  calculateTotalTax() {
    let total = 0;

    this._previouslySelectedProducts.forEach((it) => {
      total += this.productDetailService.calculateTax(it);
    });

    return total;
  }

  calculateCreditAmount() {
    const totalCost = this.calculateTotalCost();
    let paidAmount = 0;

    if (this.productForm.get('paidAmount')?.valid) {
      paidAmount = this.productForm.get('paidAmount')?.value ?? 0;
    }

    return totalCost - paidAmount;
  }

  handleSubmit(event: any) {
    this.onSubmit.emit(event);

    this.productForm.reset({
      payNowOrLater: 'payNow',
      paidAmount: 0,
      paymentMethod: 'cash',
      paymentDueDate: new Date(),
    });

    window.alert('Data Submitted');
  }
}
