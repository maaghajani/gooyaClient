import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noComma'
})
export class NoCommaPipe implements PipeTransform {

  transform(value: any): any {
    const int = parseInt(value)
    return int;
  }

}
