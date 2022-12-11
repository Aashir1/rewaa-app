import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { OrderComponent } from './components/order/order.component';
import { ProductsDetailsComponent } from './components/products-details/products-details.component';
import { ProductsTableComponent } from './components/products-table/products-table.component';
import { OrderDetailsComponent } from './container/order-details/order-details.component';
import { ProductDetailService } from './services/product-detail.service';
import { ProductService } from './services/product.service';

@NgModule({
  declarations: [
    AppComponent,
    OrderComponent,
    ProductsDetailsComponent,
    OrderDetailsComponent,
    ProductsTableComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatToolbarModule,
    MatAutocompleteModule,
    MatIconModule,
    MatTableModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
  ],
  providers: [ProductService, ProductDetailService],
  bootstrap: [AppComponent],
})
export class AppModule {}
