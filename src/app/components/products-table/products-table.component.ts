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
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { Observable, of } from 'rxjs';
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
export class ProductsTableComponent implements OnInit, OnChanges {
  @Input() dataSource: Observable<ProductDetail[]> = of([] as ProductDetail[]);
  @Output() onRemoveItem = new EventEmitter();
  isDataPresent: boolean = false;

  columnsToDisplay = ['title', 'newCost', 'newQty', 'taxCode', 'remove'];
  columnsToDisplayWithExpand = ['expand', ...this.columnsToDisplay];
  expandedElement?: ProductDetail | null;

  constructor() {}

  ngOnInit(): void {
    this.dataSource.subscribe((value) => {
      if (value.length > 0) {
        this.isDataPresent = true;
      } else {
        this.isDataPresent = false;
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log(changes);
  }

  handleRemove(element: ProductDetail) {
    this.onRemoveItem.emit(element);
  }
}
