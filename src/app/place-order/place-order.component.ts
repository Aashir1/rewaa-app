import { Component, OnInit } from '@angular/core';

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

  constructor() {}

  ngOnInit(): void {}
}
