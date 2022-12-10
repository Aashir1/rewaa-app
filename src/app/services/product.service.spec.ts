import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { of } from "rxjs";
import { Product } from "../interfaces/product";
import { ProductService } from "./product.service";


describe("Product Service Testing", () => {
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  let productService: ProductService;
  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    productService = new ProductService(httpClientSpy);
  });

  it('should return expected products (HttpClient called once)', (done: DoneFn) => {
    const expectedProduct: Product[] =
      [{
        id: 1,
        title: "title",
        price: 12.00,
        description: "description",
        category: "category",
        image: "url",
        rating: {
          rate: 12.00,
          count: 2,
        }
      }];

    httpClientSpy.get.and.returnValue(of(expectedProduct));

    productService.getProducts().subscribe({
      next: products => {
        expect(products)
          .withContext('expected products')
          .toEqual(expectedProduct);
        done();
      },
      error: done.fail
    });
    expect(httpClientSpy.get.calls.count())
      .withContext('one call')
      .toBe(1);
  });
})