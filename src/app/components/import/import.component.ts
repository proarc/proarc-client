import { Device } from 'src/app/model/device.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Profile } from 'src/app/model/profile.model';
import { forkJoin } from 'rxjs';
import { Folder } from 'src/app/model/folder.model';
import { Batch } from 'src/app/model/batch.model';
import { MatDialog } from '@angular/material/dialog';
import { ImportDialogComponent } from 'src/app/dialogs/import-dialog/import-dialog.component';
import { Router } from '@angular/router';
import { ImportService } from 'src/app/services/import.service';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';
import { UIService } from 'src/app/services/ui.service';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  generateIndex = true;

  devices: Device[];
  selectedDevice: Device;

  profiles: Profile[];
  selectedProfile: Profile;

  folders: Folder[] = [];
  nonStatusProfiles: string[] = [
    'profile.default_archive_import', 
    'profile.default_kramerius_import',
     'profile.ndk_monograph_kramerius_import',
    'profile.ndk_periodical_kramerius_import',
    'profile.stt_kramerius_import']

  constructor(
    private api: ApiService,
    private ui: UIService,
    public importService: ImportService,
    private router: Router,
    private dialog: MatDialog) { }


  ngOnInit() {
    this.importService.init();
    const rDevice = this.api.getDevices();
    const rProfiles = this.api.getImportProfiles();
    forkJoin([rDevice, rProfiles]).subscribe(([devices, profiles]: [Device[], Profile[]]) => {
      this.profiles = profiles;
      this.devices = devices;
      if (this.profiles.length > 0) {
        this.selectedProfile = this.profiles[0];
      }
      if (this.devices.length > 0) {
        this.selectedDevice = this.devices[0];
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
      console.log(resp);
      if (resp.response.error) {
        this.ui.showErrorSnackBar(resp.error);
      } else {
        folder.state = "NEW";
        folder.states.find(s => s.profile === this.selectedProfile.id).state = "NEW"
      }
      
    });
  }

  loadFolder(folder: Folder, idx: number) {
    this.api.getImportFolders(folder.path).subscribe((response: any) => {
      if (response['response'].errors) {
        console.log('getImportFolders error', response['response'].errors);
        this.ui.showErrorSnackBarFromObject(response['response'].errors);
        return;
      }
      const folders: Folder[] = Folder.fromJsonArray(response['response']['data']);
      if (folders.length === 0) {
        folder.canExpand = false;
      } else {
        folders.forEach(f => {
          f.level = folder.level + 1;
          f.parent = folder.path;
        });
        this.folders.splice(idx, 0, ...folders);
      }
      // console.log(this.folders)
    });
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
      return false;
    }
  }

  // Determine when can select folder by profile
  canReread(folder: Folder): boolean {
    if (!folder.states) {
      return false;
    }
    const p = folder.states.find(s => s.profile === this.selectedProfile.id);
    if (p) {
      return p.state === 'IMPORTED'
    } else {
      return false;
    }
  }

  toggleSelected(folder: Folder) {
    folder.selected = !folder.selected;
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
    if (this.nonStatusProfiles.includes(this.selectedProfile.id)) {
      this.api.createImportBatch(selectedFolders[0].path, this.selectedProfile.id, this.generateIndex, this.selectedDevice.id).subscribe((response: any) => {
        const data: SimpleDialogData = {
          title: "Načtení adresářů",
          message: "Načtení adresářů se zpracovává na pozadí.",
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
        const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'open') {
            this.router.navigate(['/import', 'history']);
          }
        });
      });
    } else if (selectedFolders.length === 1) {
      this.api.createImportBatch(selectedFolders[0].path, this.selectedProfile.id, this.generateIndex, this.selectedDevice.id).subscribe((response: any) => {

        if (response['response'].errors) {
          console.log('error', response['response'].errors);
          this.ui.showErrorSnackBarFromObject(response['response'].errors);
          return;
        }
        const batch: Batch = Batch.fromJson(response['response']['data'][0]);
        const dialogRef = this.dialog.open(ImportDialogComponent, { data: { batch: batch.id } });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'open') {
            this.router.navigate(['/import', 'edit', batch.id]);
          } else {
            this.reload();
          }
        });
      });
    } else {
      const paths = selectedFolders.map((folder: Folder) => folder.path);
      this.api.createImportBatches(paths, this.selectedProfile.id, this.generateIndex, this.selectedDevice.id).subscribe(result => {
        const data: SimpleDialogData = {
          title: "Hromadné načtení adresářů",
          message: "Hromadné načtení adresářů se zpracovává na pozadí.",
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
        const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'open') {
            this.router.navigate(['/import', 'history']);
          }
        });
      });
    }

  }


  onProfileChanged() {
    // this.reload();
  }


  onPageChanged(page: any) {
    // this.pageIndex = page.pageIndex;
    // this.reload();
  }



}
