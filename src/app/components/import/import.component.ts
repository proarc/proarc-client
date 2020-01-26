import { Device } from 'src/app/model/device.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Profile } from 'src/app/model/profile.model';
import { forkJoin } from 'rxjs';
import { Folder } from 'src/app/model/folder.model';
import { Batch } from 'src/app/model/batch.model';
import { MatDialog } from '@angular/material';
import { ImportDialogComponent } from 'src/app/dialogs/import-dialog/import-dialog.component';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { Translator } from 'angular-translator';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { ParentDialogComponent } from 'src/app/dialogs/parent-dialog/parent-dialog.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  state = 'none';

  pageIndex = 0;
  pageSize = 100;
  resultCount = 200;

  generateIndex = true;

  devices: Device[];
  selectedDevice: Device;

  profiles: Profile[];
  selectedProfile: Profile;

  folders: Folder[];
  selectedFolder: Folder;

  path: string;

  constructor(
    private api: ApiService,
    private translator: Translator,
    private router: Router,
    private dialog: MatDialog) { }

  ngOnInit() {
    this.path = '/';
    this.state = 'loading';
    const rDevice = this.api.getDevices();
    const rProfiles = this.api.getImportProfiles();
    forkJoin(rDevice, rProfiles).subscribe(([devices, profiles]: [Device[], Profile[]]) => {
      this.profiles = profiles;
      this.devices = devices;
      if (this.profiles.length > 0) {
        this.selectedProfile = this.profiles[0];
      }
      if (this.devices.length > 0) {
        this.selectedDevice = this.devices[0];
      }
      this.reload();
    });
  }

  openPath(path: string) {
    console.log('path', path);
    this.path = path;
    this.reload();
  }

  openFolder(folder: Folder) {
   this.openPath(folder.path);
  }

  openFolderAtPathIndex(index: number) {
    console.log('openFolderAtPathIndex', index);
    let path = '';
    const segments = this.path.split('/');
    for (let i = 0; i < index; i++) {
      path += segments[i] + '/';
    }
    console.log('openFolderAtPathIndex', path);
    this.openPath(path);
  }


  selectFolder(folder: Folder) {
    this.selectedFolder = folder;
  }

  canBeLoaded(): boolean {
    return this.selectedDevice && this.selectedProfile && this.selectedFolder && this.selectedFolder.isNew();
  }

  onContinue() {
    const dialogRef = this.dialog.open(ParentDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['pid']) {
        this.loadAndSave(result['pid']);
      }
    });
  }


  loadAndSave(parentPid: string) {
    this.api.createImportBatch(this.selectedFolder.path, this.selectedProfile.id, this.generateIndex, this.selectedDevice.id).subscribe((batch: Batch) => {
      const dialogRef = this.dialog.open(ImportDialogComponent, { data: {batch: batch.id, parent: parentPid }});
      dialogRef.afterClosed().subscribe(result => {
        console.log('dialog res', result);
        if (result === 'success') {
          this.router.navigate(['/document', parentPid]);
        } else if (result === 'failure') {
          this.onImportFailure();
        }
      });
    })
    // this.api.getImportBatch(1302).subscribe((batch: Batch) => {
    //   console.log('batch', batch);
    //   const dialogRef = this.dialog.open(ImportDialogComponent, { data: batch.id });
    //   dialogRef.afterClosed().subscribe(result => {
    //     console.log('dialog res', result);
    //   });
    // });
  }




  private onImportFailure() {
    this.reload();
    const data: SimpleDialogData = {
      title: String(this.translator.instant('import.error_dialog.title')),
      message: String(this.translator.instant('import.error_dialog.message')),
      btn1: {
        label: String(this.translator.instant('common.ok')),
        value: 'ok',
        color: 'default'
      }
    };
    this.dialog.open(SimpleDialogComponent, { data: data });
    this.state = 'success';
  }

  reload() {
    this.selectedFolder = null;
    this.state = 'loading';
    this.api.getImportFolders(this.selectedProfile, this.path).subscribe((folders: Folder[]) => {
      this.folders = folders;
      this.state = 'success';
    });
  }

  onProfileChanged() {
    this.reload();
  }


  onPageChanged(page) {
    // this.pageIndex = page.pageIndex;
    // this.reload();
  }



}
