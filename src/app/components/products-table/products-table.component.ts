import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { ProductDetailService } from 'src/app/services/product-detail.service';
import { TaxCode } from 'src/app/shared/enums/tax-code';
import { ProductDetail } from 'src/app/shared/interfaces/product-detail';

@Component({
  selector: 'app-products-table',
  templateUrl: './products-table.component.html',
  styleUrls: ['./products-table.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class ProductsTableComponent implements OnInit, OnDestroy {
  @Input() dataSource: Observable<ProductDetail[]> = of([] as ProductDetail[]);
  @Output() onRemoveItem = new EventEmitter();
  isDataPresent: boolean = false;

  columnsToDisplay = ['name', 'newCost', 'newQty', 'taxCode', 'remove'];
  columnsToDisplayWithExpand = ['expand', ...this.columnsToDisplay];
  expandedElement?: ProductDetail | null;

  dataSourceSubscription?: Subscription;

  constructor(private productDetailService: ProductDetailService) {}

  ngOnInit(): void {
    this.dataSourceSubscription = this.dataSource.subscribe((value) => {
      if (value.length > 0) {
        this.isDataPresent = true;
      } else {
        this.isDataPresent = false;
      }
    });
  }

  ngOnDestroy() {
    this.dataSourceSubscription?.unsubscribe();
  }

  calculateCost(element: ProductDetail, withTax: boolean = false) {
    return this.productDetailService.calculateCost(element, withTax);
  }

  calculateTax(element: ProductDetail) {
    return this.productDetailService.calculateTax(element);
  }

  handleRemove(element: ProductDetail) {
    this.onRemoveItem.emit(element);
  }
}
