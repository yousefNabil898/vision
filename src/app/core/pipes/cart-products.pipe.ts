import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cartProducts',
  standalone: true
})
export class FilterProductsPipe implements PipeTransform {

  transform(products: any[], productIds: string[]): any[] {
    if (!products || !productIds) {
      return products;
    }

    return products.filter(product => productIds.includes(product.id));
  }
}