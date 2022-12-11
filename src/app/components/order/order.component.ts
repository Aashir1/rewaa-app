import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css'],
})
export class OrderComponent implements OnInit {
  orderForm: FormGroup;
  notesLength: number = 0;
  // *Note: assuming that supplier invoice number only contain digits (0-9) and is atleast 3 digits long
  supplierInvoiceNumberPattern = new RegExp(/[0-9]{3,}/);

  constructor() {
    this.orderForm = new FormGroup({
      supplierName: new FormControl(''),
      location: new FormControl(''),
      supplierInvoiceNumber: new FormControl('', [
        Validators.pattern(this.supplierInvoiceNumberPattern),
      ]),
      notes: new FormControl(''),
    });
  }

  ngOnInit() {
    this.orderForm.valueChanges.pipe(tap(console.log)).subscribe((res) => {
      this.notesLength = res?.notes?.length;
    });
  }
}
