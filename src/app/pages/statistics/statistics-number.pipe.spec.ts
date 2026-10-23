import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';
import { StatisticsNumberPipe, StatisticsPercentPipe } from './statistics-number.pipe';

describe('Statistics locale', () => {
  const translator = { currentLang: 'cs' };
  beforeEach(() => TestBed.configureTestingModule({ providers: [{ provide: TranslateService, useValue: translator }] }));
  it('uses spaces for cs/cs and cs/en and commas for en/en, including language changes', () => {
    const pipe = TestBed.runInInjectionContext(() => new StatisticsNumberPipe());
    for (const language of ['cs', 'cs-en']) {
      translator.currentLang = language;
      expect(pipe.transform(1234567)?.replace(/\u00a0/g, ' ')).toBe('1 234 567');
    }
    translator.currentLang = 'en';
    expect(pipe.transform(1234567)).toBe('1,234,567');
  });
  it('uses the interface language for chart percentages', () => {
    const pipe = TestBed.runInInjectionContext(() => new StatisticsPercentPipe());
    translator.currentLang = 'cs-en';
    expect(pipe.transform(0.123, '1.1-1')?.replace(/\u00a0/g, ' ')).toBe('12,3 %');
    translator.currentLang = 'en';
    expect(pipe.transform(0.123, '1.1-1')).toBe('12.3%');
  });
});
