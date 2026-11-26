import { Component, DestroyRef, OnInit, Input, inject } from '@angular/core';
import { CommonModule, formatDate, registerLocaleData } from '@angular/common';
import cs from '@angular/common/locales/cs';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { UserSettings } from '../../../shared/user-settings';
import { MatIconModule } from '@angular/material/icon';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { timer } from 'rxjs';
import { ApiService } from '../../../services/api.service';
import { CurrentUsage, UsageHistory, UsageDisk, UsagePeriod, UsagePoint, usagePoints, formatUsageBytes } from '../../../model/server-usage';

registerLocaleData(cs);

@Component({
  selector: 'app-server-usage',
  imports: [MatCardModule, MatFormFieldModule, MatSelectModule, MatProgressBarModule, CommonModule, FormsModule, TranslateModule, MatButtonModule, MatIconModule],
  templateUrl: './server-usage.component.html',
  styleUrls: ['./server-usage.component.scss']
})
export class ServerUsageComponent implements OnInit {
  @Input() preview = false;
  readonly settings = inject(UserSettings);
  private destroyRef = inject(DestroyRef);
  current: CurrentUsage | null = null;
  history: UsageHistory | null = null;
  loading = false;
  historyLoading = false;
  loadError = false;
  historyError = false;
  detail = false;
  diskId = '';
  period: UsagePeriod = 'day';
  mode: 'used' | 'growth' = 'used';
  points: UsagePoint[] = [];
  chartPath = '';
  chartDots: {x: number; y: number; label: string}[] = [];
  ticks: {y: number; label: string}[] = [];
  zeroY = 220;
  bytes = formatUsageBytes;

  constructor(private api: ApiService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParamMap.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(params => {
      this.detail = !this.preview && params.get('view') === 'storage';
      this.diskId = params.get('disk') || this.diskId;
      this.rebuildChart();
      if (this.detail && !this.history && !this.historyLoading) this.loadHistory();
    });
    timer(0, 60000).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.loadCurrent());
  }

  get disks(): UsageDisk[] { return this.current?.actual?.disks || []; }
  get diskColumns(): number {
    const count = this.disks.length;
    return count ? Math.ceil(count / Math.ceil(count / 5)) : 1;
  }
  get selectedDisk(): UsageDisk | undefined { return this.disks.find(disk => disk.id === this.diskId); }
  get diskOptions(): {id: string; name: string}[] {
    const disks = new Map<string, {id: string; name: string}>();
    this.history?.samples.forEach(sample => sample.disks.forEach(disk => disks.set(disk.id, disk)));
    this.disks.forEach(disk => disks.set(disk.id, disk));
    return [...disks.values()];
  }
  get stale(): boolean {
    const time = this.current?.actual?.measuredAt;
    return !!time && Date.now() - Date.parse(time) > 3600000;
  }
  percent(disk: UsageDisk): number | null {
    return !disk.error && disk.usedBytes != null && disk.totalBytes > 0
      ? Math.max(0, Math.min(100, 100 * disk.usedBytes / disk.totalBytes)) : null;
  }
  openDetail(disk?: UsageDisk): void {
    this.router.navigate([], {relativeTo: this.route, queryParams: {view: 'storage', disk: disk?.id || this.diskId || null}});
  }
  selectDisk(): void {
    this.rebuildChart();
    this.router.navigate([], {relativeTo: this.route, queryParams: {view: 'storage', disk: this.diskId}});
  }
  refresh(): void {
    this.loadCurrent();
    if (this.detail) this.loadHistory();
  }
  private loadCurrent(): void {
    if (this.loading) return;
    this.loading = true;
    this.api.getServerUsage().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: value => {
        this.current = value;
        this.loadError = false;
        this.loading = false;
        this.rebuildChart();
      },
      error: () => { this.loadError = true; this.loading = false; }
    });
  }
  private loadHistory(): void {
    if (this.historyLoading) return;
    this.historyLoading = true;
    this.api.getServerUsageHistory().pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: value => { this.history = value; this.historyError = false; this.historyLoading = false; this.rebuildChart(); },
      error: () => { this.historyError = true; this.historyLoading = false; }
    });
  }
  rebuildChart(): void {
    if (!this.diskId) this.diskId = this.diskOptions[0]?.id || '';
    this.points = usagePoints(this.history?.samples || [], this.diskId, this.period);
    const values = this.points.map(point => this.mode === 'used' ? point.usedBytes : point.growthBytes);
    const known = values.filter((value): value is number => value != null);
    const min = Math.min(0, ...known);
    const max = Math.max(1, ...known);
    const y = (value: number) => 220 - (value - min) / (max - min) * 190;
    this.zeroY = y(0);
    this.ticks = [min, (min + max) / 2, max].map(value => ({y: y(value), label: this.bytes(value)}));
    let connected = false;
    this.chartPath = '';
    this.chartDots = [];
    values.forEach((value, index) => {
      if (value == null) { connected = false; return; }
      const x = values.length === 1 ? 440 : 90 + index / (values.length - 1) * 680;
      const cy = y(value);
      this.chartPath += `${connected ? 'L' : 'M'}${x},${cy} `;
      connected = true;
      this.chartDots.push({x, y: cy, label: `${formatDate(this.points[index].date, 'dd.MM.yyyy', 'cs')}: ${this.bytes(value)}`});
    });
  }
}
