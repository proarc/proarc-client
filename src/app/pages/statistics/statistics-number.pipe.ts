import { formatNumber, formatPercent, registerLocaleData } from '@angular/common';
import cs from '@angular/common/locales/cs';
import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

registerLocaleData(cs);

@Pipe({ name: 'statisticsNumber', standalone: true, pure: false })
export class StatisticsNumberPipe implements PipeTransform {
  private readonly translator = inject(TranslateService);
  transform(value: number | null | undefined, digits = '1.0-3'): string | null {
    return value == null ? null : formatNumber(value, this.translator.currentLang === 'en' ? 'en-US' : 'cs', digits);
  }
}

@Pipe({ name: 'statisticsPercent', standalone: true, pure: false })
export class StatisticsPercentPipe implements PipeTransform {
  private readonly translator = inject(TranslateService);
  transform(value: number | null | undefined, digits = '1.0-0'): string | null {
    return value == null ? null : formatPercent(value, this.translator.currentLang === 'en' ? 'en-US' : 'cs', digits);
  }
}
