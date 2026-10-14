import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { SoftwarePreviewDialogComponent } from '../../dialogs/software-preview-dialog/software-preview-dialog.component';
import { Software, SOFTWARE_MODELS, SoftwareType } from '../../model/software.model';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';

@Component({
  selector: 'app-software-list',
  standalone: true,
  imports: [TranslateModule, RouterModule, MatButtonModule, MatIconModule, MatPaginatorModule,
    MatProgressBarModule, MatTableModule, MatTooltipModule],
  templateUrl: './software-list.component.html',
  styleUrl: './software-list.component.scss'
})
export class SoftwareListComponent implements OnInit, OnDestroy {
  state = 'loading';
  type: SoftwareType;
  model: string;
  items: Software[] = [];
  displayedColumns = ['label', 'id', 'actions'];
  pageIndex = 0;
  pageSize = 25;
  totalRows = 0;
  private routeSubscription: Subscription;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private translator: TranslateService,
    private ui: UIService,
    private settings: UserSettings
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      const type = params.get('type') as SoftwareType;
      if (!SOFTWARE_MODELS[type]) {
        this.router.navigate(['/devices']);
        return;
      }
      this.type = type;
      this.model = SOFTWARE_MODELS[type];
      this.pageIndex = 0;
      this.load();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  load(): void {
    this.state = 'loading';
    this.api.getSoftwarePage(this.model, this.pageIndex * this.pageSize, this.pageSize).subscribe({
      next: page => {
        this.items = page.items;
        this.totalRows = page.totalRows;
        this.state = 'success';
      },
      error: error => this.showError(error)
    });
  }

  onPageChanged(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.load();
  }

  preview(item: Software): void {
    this.state = 'loading';
    this.api.getSoftwarePreview(item.id).subscribe({
      next: preview => {
        this.state = 'success';
        this.dialog.open(SoftwarePreviewDialogComponent, {
          data: { title: item.label, xml: Software.formatXml(preview.description) },
          width: '90vw',
          maxWidth: '1200px',
          maxHeight: '90vh'
        });
      },
      error: error => this.showError(error)
    });
  }

  remove(item: Software): void {
    const data: SimpleDialogData = {
      title: this.translator.instant('software.delete.title'),
      message: this.translator.instant('software.delete.message', { label: item.label }),
      btn1: { label: this.translator.instant('common.yes'), value: 'yes', color: 'warn' },
      btn2: { label: this.translator.instant('common.no'), value: 'no', color: 'default' }
    };
    this.dialog.open(SimpleDialogComponent, {
      data,
      panelClass: ['app-dialog-simple', 'app-form-view-' + this.settings.appearance]
    }).afterClosed().subscribe(result => {
      if (result !== 'yes') {
        return;
      }
      this.state = 'loading';
      this.api.removeSoftware(item.id).subscribe({
        next: response => {
          if (response.response?.errors) {
            this.state = 'success';
            this.ui.showErrorDialogFromObject(response.response.errors);
            return;
          }
          this.ui.showInfoSnackBar(this.translator.instant('software.delete.success'));
          if (this.items.length === 1 && this.pageIndex > 0) {
            this.pageIndex--;
          }
          this.load();
        },
        error: error => this.showError(error)
      });
    });
  }

  private showError(error: any): void {
    this.state = 'error';
    this.ui.showErrorDialogFromString(error?.message || String(error));
  }
}
