import { Location } from '@angular/common';
import { provideLocationMocks } from '@angular/common/testing';
import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router, provideRouter } from '@angular/router';
import { RouterTestingHarness } from '@angular/router/testing';
import { TranslateService } from '@ngx-translate/core';
import { filter, firstValueFrom, of } from 'rxjs';
import { ApiService } from '../../services/api.service';
import { StatisticsCsvService } from './statistics-csv.service';
import { StatisticsComponent } from './statistics.component';

describe('Statistics navigation', () => {
  let harness: RouterTestingHarness;
  let router: Router;
  let location: Location;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'statistics', component: StatisticsComponent }]),
        provideLocationMocks(),
        { provide: ApiService, useValue: {
          getArticleExportStatistics: () => of({ count: 0 }),
          getExportStatistics: () => of({ groups: [], pageCount: 0 }),
          getProductivityStatistics: () => of({ modelCounts: [], count: 0 }),
          getModelStatistics: () => of([])
        } },
        { provide: StatisticsCsvService, useValue: {} },
        { provide: TranslateService, useValue: { currentLang: 'cs' } }
      ]
    }).overrideComponent(StatisticsComponent, { set: { template: '', imports: [] } }).compileComponents();
    harness = await RouterTestingHarness.create();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    router.setUpLocationChangeListener();
  });

  async function navigate(action: () => void): Promise<void> {
    const finished = firstValueFrom(router.events.pipe(filter(event => event instanceof NavigationEnd)));
    action();
    await finished;
    harness.detectChanges();
  }

  it('returns from detail to the dashboard with browser Back and restores detail with Forward', async () => {
    const component = await harness.navigateByUrl('/statistics', StatisticsComponent);
    await navigate(() => component.open('exports'));
    expect(router.url).toBe('/statistics?view=exports');
    expect(component.view).toBe('exports');
    await navigate(() => location.back());
    expect(component.view).toBe('home');
    expect(router.url).toBe('/statistics');
    await navigate(() => location.forward());
    expect(component.view).toBe('exports');
  });

  it('returns straight to the dashboard after switching active and inactive objects', async () => {
    const component = await harness.navigateByUrl('/statistics', StatisticsComponent);
    await navigate(() => component.open('active'));
    await navigate(() => component.open('inactive'));
    expect(component.active).toBeFalse();
    await navigate(() => location.back());
    expect(component.view).toBe('home');
  });

  it('opens a detail URL directly and supports the dashboard button', async () => {
    const component = await harness.navigateByUrl('/statistics?view=articles', StatisticsComponent);
    expect(component.view).toBe('articles');
    await navigate(() => component.showHome());
    expect(router.url).toBe('/statistics');
    expect(component.view).toBe('home');
  });
});
