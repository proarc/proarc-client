import { Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'appShorten'
})
export class ShortenPipe implements PipeTransform {

  transform(text: string, length: number = 30) {
    if (!text) {
      return '';
    } else if (text.length <= length) {
      return text;
    }
    return text.substring(0, length - 3) + '...';
  }

}
