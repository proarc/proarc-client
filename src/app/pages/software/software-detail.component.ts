import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin, of, Subscription } from 'rxjs';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { SoftwarePreviewDialogComponent } from '../../dialogs/software-preview-dialog/software-preview-dialog.component';
import { Software, SOFTWARE_MODELS, SoftwareType } from '../../model/software.model';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { UserSettings } from '../../shared/user-settings';

@Component({
  selector: 'app-software-detail',
  standalone: true,
  imports: [FormsModule, TranslateModule, RouterModule, MatButtonModule, MatFormFieldModule,
    MatIconModule, MatInputModule, MatProgressBarModule, MatSelectModule, MatTooltipModule],
  templateUrl: './software-detail.component.html',
  styleUrl: './software-detail.component.scss'
})
export class SoftwareDetailComponent implements OnInit, OnDestroy {
  state = 'loading';
  mode: 'new' | 'detail' | 'edit';
  type: SoftwareType;
  software: Software;
  candidates: Software[] = [];
  defaultMetadataTypes: string[] = [];
  defaultMetadataType = '';
  selectedMember = '';
  private routeSubscription: Subscription;

  constructor(
    private api: ApiService,
    private dialog: MatDialog,
    private route: ActivatedRoute,
    private router: Router,
    private translator: TranslateService,
    private ui: UIService,
    public settings: UserSettings
  ) {}

  ngOnInit(): void {
    this.routeSubscription = this.route.paramMap.subscribe(params => {
      this.type = params.get('type') as SoftwareType;
      const model = SOFTWARE_MODELS[this.type];
      if (!model) {
        this.router.navigate(['/devices']);
        return;
      }
      const id = params.get('id');
      this.mode = !id ? 'new' : this.router.url.endsWith('/edit') ? 'edit' : 'detail';
      this.defaultMetadataTypes = Software.defaultMetadataTypes(model);
      this.defaultMetadataType = this.defaultMetadataTypes[0] || '';
      if (!id) {
        this.software = new Software();
        this.software.model = model;
        this.software.members = [];
        this.loadCandidates();
        return;
      }
      this.load(id);
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription?.unsubscribe();
  }

  save(): void {
    this.state = 'saving';
    if (this.software.model !== SOFTWARE_MODELS.set) {
      this.software.members = this.selectedMember ? [this.selectedMember] : [];
    }
    const request = this.mode === 'new'
      ? this.api.createSoftware(this.software, this.defaultMetadataType)
      : this.api.updateSoftware(this.software);
    request.subscribe({
      next: saved => {
        this.ui.showInfoSnackBar(this.translator.instant(
          this.mode === 'new' ? 'software.create.success' : 'software.update.success'));
        this.router.navigate(['/software', this.type, saved.id, this.mode === 'new' ? 'edit' : undefined]
          .filter(segment => segment !== undefined));
      },
      error: error => this.showError(error)
    });
  }

  preview(): void {
    this.state = 'loading';
    this.api.getSoftwarePreview(this.software.id).subscribe({
      next: preview => {
        this.state = 'success';
        this.dialog.open(SoftwarePreviewDialogComponent, {
          data: { title: this.software.label, xml: Software.formatXml(preview.description) },
          width: '90vw',
          maxWidth: '1200px',
          maxHeight: '90vh'
        });
      },
      error: error => this.showError(error)
    });
  }

  remove(): void {
    const data: SimpleDialogData = {
      title: this.translator.instant('software.delete.title'),
      message: this.translator.instant('software.delete.message', { label: this.software.label }),
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
      this.api.removeSoftware(this.software.id).subscribe({
        next: response => {
          if (response.response?.errors) {
            this.state = 'success';
            this.ui.showErrorDialogFromObject(response.response.errors);
            return;
          }
          this.ui.showInfoSnackBar(this.translator.instant('software.delete.success'));
          this.router.navigate(['/software', this.type]);
        },
        error: error => this.showError(error)
      });
    });
  }

  private load(id: string): void {
    this.state = 'loading';
    const memberModel = Software.memberModel(SOFTWARE_MODELS[this.type]);
    forkJoin({
      software: this.api.getSoftware(id),
      candidates: memberModel ? this.api.getAllSoftware(memberModel) : of([] as Software[])
    }).subscribe({
      next: result => {
        this.software = result.software;
        if (this.software.model !== SOFTWARE_MODELS[this.type]) {
          this.router.navigate(['/software', Software.typeFromModel(this.software.model), id]);
          return;
        }
        this.candidates = result.candidates;
        this.selectedMember = this.software.members[0] || '';
        this.state = 'success';
      },
      error: error => this.showError(error)
    });
  }

  private loadCandidates(): void {
    const memberModel = Software.memberModel(this.software.model);
    if (!memberModel) {
      this.state = 'success';
      return;
    }
    this.api.getAllSoftware(memberModel).subscribe({
      next: candidates => {
        this.candidates = candidates;
        this.state = 'success';
      },
      error: error => this.showError(error)
    });
  }

  private showError(error: any): void {
    this.state = 'error';
    this.ui.showErrorDialogFromString(error?.message || String(error));
  }
}
