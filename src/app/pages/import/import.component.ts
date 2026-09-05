import { Component, OnInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { Router, RouterModule } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ImportDialogComponent } from '../../dialogs/import-dialog/import-dialog.component';
import { SimpleDialogData } from '../../dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from '../../dialogs/simple-dialog/simple-dialog.component';
import { Batch } from '../../model/batch.model';
import { Device } from '../../model/device.model';
import { Folder } from '../../model/folder.model';
import { Profile } from '../../model/profile.model';
import { ApiService } from '../../services/api.service';
import { UIService } from '../../services/ui.service';
import { ProArc } from '../../utils/proarc';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserSettings } from '../../shared/user-settings';
import { PeroModel } from '../../model/pero.model';
import { MetakatModel } from '../../model/metakat.model';

@Component({
  imports: [TranslateModule, FormsModule, RouterModule,
    MatCheckboxModule, MatIconModule, MatButtonModule, MatSelectModule, MatTooltipModule],
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  generateIndex = true;
  nightOnly = false;

  devices: Device[];
  selectedDevice: Device;

  pero: PeroModel[] = [];
  selectedPero: PeroModel;

  metakat: MetakatModel[] = [];
  selectedMetakat: MetakatModel;
  private metakatLoaded = false;
  private metakatLoading = false;

  profiles: Profile[];
  selectedProfile: Profile;

  priorities = [
    'lowest',
    'low',
    'medium',
    'high',
    'highest'
  ];
  selectedPriority = 'medium';

  folders: Folder[] = [];
  nonStatusProfiles: string[] = [
    'profile.default_archive_import',
    'profile.default_ndk_import',
    'profile.default_kramerius_import',
    'profile.ndk_monograph_kramerius_import',
    'profile.ndk_periodical_kramerius_import',
    'profile.stt_kramerius_import',
    'profile.ndk_emonograph_kramerius_import',
    'profile.ndk_eperiodical_kramerius_import',
    'profile.generate',
    'profile.replace_stream_import'
  ]

  constructor(
    private translator: TranslateService,
    private api: ApiService,
    private ui: UIService,
    //public importService: ImportService,
    private router: Router,
    private dialog: MatDialog,
    public settings: UserSettings) { }


  ngOnInit() {
    //this.importService.init();
    const rDevice = this.api.getDevices();
    const rProfiles = this.api.getImportProfiles();
    const rPero = this.api.getPero();
    forkJoin([rDevice, rProfiles, rPero]).subscribe(([devices, profiles, pero]: [Device[], Profile[], PeroModel[] ]) => {
      this.profiles = profiles;
      this.devices = devices;
      this.pero = pero;
      if (this.profiles.length > 0) {
        this.selectedProfile = this.profiles[0];
        this.loadMetakatIfNeeded();
      }
      if (this.devices.length > 0) {
        const d = new Device('none');
        d.label = 'Vybrat';
        this.devices.unshift(d);
        this.selectedDevice = this.devices[0];
      }
      if (this.pero.length > 0) {
        const p: PeroModel = {id: null, label: 'Vybrat', description: null};
        this.pero.unshift(p);
        this.selectedPero = this.pero[0];
      }
      this.loadFolder(Folder.root(), 0);
    });
  }

  reload() {

  }

  toggleFolder(folder: Folder, idx: number) {
    if (folder.expanded) {
      folder.expanded = false;
      // hide children
      this.folders.forEach(f => {
        if (f.parent.startsWith(folder.path)) {
          f.hidden = true;
        }
      });
    } else {
      folder.expanded = true;
      if (folder.loaded) {
        // show children
        this.folders.forEach(f => {
          if (f.parent.startsWith(folder.path)) {
            f.hidden = false;
          }
        });
      } else {
        this.loadFolder(folder, idx);
      }
    }
  }



  reRead(folder: Folder) {
    // this.importService.toggleFoder(this.tree.folder);
    this.api.reReadFolder(folder.path).subscribe((resp: any) => {

      if (resp.response.error) {
        this.ui.showErrorSnackBar(resp.error);
      } else {
        this.reloadParentFolder(folder);
      }

    });
  }

  loadFolder(folder: Folder, idx: number, selectedPath: string = null) {
    this.api.getImportFolders(folder.path).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('getImportFolders error', response['response'].errors);
        const a = this.ui.showErrorDialogFromObject(response['response'].errors);
        a.afterClosed().subscribe(result => {
          this.router.navigate(['/process-management']);
        });
      }
      const folders: Folder[] = Folder.fromJsonArray(response['response']['data']);
      if (folders.length === 0) {
        folder.canExpand = false;
      } else {
        folders.forEach(f => {
          f.level = folder.level + 1;
          f.parent = folder.path;
          f.hidden = folder.path !== '/' && folder.hidden;
          f.selected = f.path === selectedPath;
        });
        this.folders.splice(idx, 0, ...folders);
      }
      folder.loaded = true;
      this.loadMetakatIfNeeded();
      // console.log(this.folders)
    });
  }

  private reloadParentFolder(folder: Folder) {
    const selectedPath = folder.path;
    const parent = this.folders.find(f => f.path === folder.parent) || Folder.root();
    const parentIndex = this.folders.findIndex(f => f.path === parent.path);
    const insertIndex = parentIndex === -1 ? 0 : parentIndex + 1;

    this.folders = this.folders.filter(f => !this.isChildOfFolder(f, parent.path));
    parent.expanded = true;
    parent.loaded = false;
    this.loadFolder(parent, insertIndex, selectedPath);
  }

  private isChildOfFolder(folder: Folder, parentPath: string): boolean {
    if (!folder.parent) {
      return false;
    }
    return folder.parent === parentPath || folder.parent.startsWith(parentPath === '/' ? '/' : parentPath + '/');
  }

  // Determine when can select folder by profile
  canSelect(folder: Folder): boolean {
    if (!folder.states) {
      return false;
    }
    const p = folder.states.find(s => s.profile === this.selectedProfile.id);
    if (p) {
      return p.state === 'NEW'
    } else {
      const p2 = folder.states.find(s => s.profile === 'profile.default');
      if (p2) {
        return p2.state === 'NEW'
      } else {
        return false;
      }
    }
  }

  // Determine when can select folder by profile
  canReread(folder: Folder): boolean {
    if (!folder.states) {
      return false;
    }
    const p:{profile: string, state: string, params?: any} = folder.states.find(s => s.profile === this.selectedProfile.id && s.state === 'IMPORTED');
    if (p) {
      return true;
    } else {
      return false;
    }
  }

  toggleSelected(folder: Folder) {
    folder.selected = !folder.selected;
    this.loadMetakatIfNeeded();
  }

  onLoad() {
    const selectedFolders: Folder[] = [];

    this.folders.forEach(f => {
      if (f.selected && this.canSelect(f)) {
        selectedFolders.push(f);
      }
    });

    if (selectedFolders.length === 0) {
      return;
    }
    const generateIndex = this.showGenerateIndex() ? this.generateIndex : null;
    const selectedDeviceId = this.showDevice() ? this.selectedDevice?.id : null;
    const selectedPeroId = this.showPero() ? this.selectedPero?.id : null;
    const selectedMetakatId = this.showMetakat() ? this.selectedMetakat?.id : null;
    if (this.nonStatusProfiles.includes(this.selectedProfile.id)) {
      this.api.createImportBatch(selectedFolders[0].path, this.selectedProfile.id, generateIndex, this.nightOnly, selectedDeviceId, this.selectedPriority, selectedPeroId, selectedMetakatId).subscribe((response: any) => {
        const data: SimpleDialogData = {
          title: "Načtení adresářů",
          message: "Načtení adresářů se zpracovává na pozadí.",
          alertClass: 'app-message',
          btn1: {
            label: "Zavřít",
            value: 'close',
            color: 'default'
          },
          btn2: {
            label: "Otevřít správu importních procesů",
            value: 'open',
            color: 'primary'
          }
        };
        const dialogRef = this.dialog.open(SimpleDialogComponent, {
          data: data,
          panelClass: ['app-dialog-simple', 'app-form-view-' + this.settings.appearance]
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'open') {
            this.router.navigate(['/process-management']);
          }
        });
      });
    } else if (selectedFolders.length === 1) {
      this.api.createImportBatch(selectedFolders[0].path, this.selectedProfile.id, generateIndex, this.nightOnly, selectedDeviceId, this.selectedPriority, selectedPeroId, selectedMetakatId).subscribe((response: any) => {

        if (response['response'].errors) {
          console.log('error', response['response'].errors);
          this.ui.showErrorDialogFromObject(response['response'].errors);
          return;
        }
        const batch: Batch = Batch.fromJson(response['response']['data'][0]);

        if (ProArc.dontShowStatusByProfile(batch.profile)) {
          this.ui.showInfoSnackBar(this.translator.instant('IMPORT_PLANNED'));
          return;
        }

        const dialogRef = this.dialog.open(ImportDialogComponent, {
          data: { batch: batch.id },
          panelClass: ['app-dialog-import', 'app-form-view-' + this.settings.appearance],
          width: '600px'
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'open') {
            this.router.navigate(['/process-management', 'edit', batch.id]);
          } else {
            this.reload();
          }
        });
      });
    } else {
      const paths = selectedFolders.map((folder: Folder) => folder.path);
      this.api.createImportBatches(paths, this.selectedProfile.id, generateIndex, selectedDeviceId, selectedPeroId, selectedMetakatId).subscribe(result => {
        const data: SimpleDialogData = {
          title: "Hromadné načtení adresářů",
          message: "Hromadné načtení adresářů se zpracovává na pozadí.",
          alertClass: 'app-message',
          btn1: {
            label: "Zavřít",
            value: 'close',
            color: 'default'
          },
          btn2: {
            label: "Otevřít správu importních procesů",
            value: 'open',
            color: 'primary'
          }
        };
        const dialogRef = this.dialog.open(SimpleDialogComponent, {
          data: data,
          panelClass: ['app-dialog-simple', 'app-form-view-' + this.settings.appearance]
        });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'open') {
            this.router.navigate(['/process-management']);
          }
        });
      });
    }

  }


  onProfileChanged() {
    // this.reload();
    this.selectedMetakat = null;
    this.loadMetakatIfNeeded();
  }

  showDevice(): boolean {
    return this.hasImportParam(true, 'device');
  }

  showPero(): boolean {
    return this.hasImportParam(true, 'ocrEngine', 'peroOcrEngine', 'pero');
  }

  showMetakat(): boolean {
    return this.hasImportParam(false, 'metakatEngine', 'metakat');
  }

  showGenerateIndex(): boolean {
    return this.hasImportParam(true, 'generateIndex', 'indices', 'index');
  }

  private hasImportParam(defaultValue: boolean, ...names: string[]): boolean {
    if (!this.selectedProfile) {
      return false;
    }
    const params = this.getSelectedFolderParams();
    if (params === null || params === undefined) {
      return defaultValue;
    }
    return names.some(name => this.containsImportParam(params, name));
  }

  private containsImportParam(params: any, name: string): boolean {
    if (Array.isArray(params)) {
      return params.some(param => this.matchesImportParam(param, name));
    }
    if (typeof params === 'object') {
      return Object.prototype.hasOwnProperty.call(params, name) && params[name] !== false;
    }
    return false;
  }

  private matchesImportParam(param: any, name: string): boolean {
    if (typeof param === 'string') {
      return param === name;
    }
    if (!param || typeof param !== 'object') {
      return false;
    }
    const paramName = param['name'] || param['id'] || param['key'];
    return paramName === name && param['enabled'] !== false && param['visible'] !== false;
  }

  private getSelectedFolderParams(): any {
    const selectedFolder = this.folders.find(f => f.selected) || this.folders.find(f => !f.hidden);
    const folderState = this.getFolderStateForSelectedProfile(selectedFolder);
    if (folderState && folderState.params !== null && folderState.params !== undefined) {
      return folderState.params;
    }
    return this.selectedProfile.params;
  }

  private getFolderStateForSelectedProfile(folder: Folder): {profile: string, state: string, params?: any} {
    if (!folder || !folder.states || !this.selectedProfile) {
      return null;
    }
    const selectedState = folder.states.find(s => s.profile === this.selectedProfile.id);
    if (selectedState) {
      return selectedState;
    }
    return folder.states.find(s => s.profile === 'profile.default');
  }

  private loadMetakatIfNeeded() {
    if (!this.showMetakat()) {
      this.selectedMetakat = null;
      return;
    }
    if (this.metakatLoaded) {
      if (!this.selectedMetakat && this.metakat.length > 0) {
        this.selectedMetakat = this.metakat[0];
      }
      return;
    }
    if (this.metakatLoading) {
      return;
    }
    this.metakatLoading = true;
    this.api.getMetakat().subscribe({
      next: (metakat: MetakatModel[]) => {
        this.metakat = metakat || [];
        if (this.metakat.length > 0) {
          const m: MetakatModel = {id: null, label: 'Vybrat', description: null};
          this.metakat.unshift(m);
          this.selectedMetakat = this.metakat[0];
        }
        this.metakatLoaded = true;
        this.metakatLoading = false;
      },
      error: () => {
        this.metakat = [];
        this.metakatLoading = false;
      }
    });
  }


  onPageChanged(page: any) {
    // this.pageIndex = page.pageIndex;
    // this.reload();
  }



}
