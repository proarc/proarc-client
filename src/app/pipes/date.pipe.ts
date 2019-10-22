import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'appDate'
})
export class DatePipe implements PipeTransform {

  transform(value: Date) {
    if (!value) {
      return '';
    }
    return this.add0(value.getDate()) + '.'
         + this.add0((value.getMonth() + 1)) + '.'
         + value.getFullYear();
  }

  private add0(value: number): string {
    if (value < 10) {
      return '0' + value;
    }
    return value.toString();
  }
}
