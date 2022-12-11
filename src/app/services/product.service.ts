import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../shared/interfaces/product';

const BASE_URL = 'http://localhost:3000';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  model = 'products';

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get<Product[]>(this.getUrl());
  }

  getUrl() {
    return `${BASE_URL}/${this.model}`;
  }
}
