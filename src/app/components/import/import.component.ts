import { Device } from 'src/app/model/device.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Profile } from 'src/app/model/profile.model';
import { forkJoin } from 'rxjs';
import { Folder } from 'src/app/model/folder.model';
import { Batch } from 'src/app/model/batch.model';
import { MatDialog } from '@angular/material';
import { ImportDialogComponent } from 'src/app/dialogs/import-dialog/import-dialog.component';
import { Router } from '@angular/router';
import { ImportTree } from './tree/tree.model';
import { ImportService } from 'src/app/services/import.service';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  // state = 'none';

  // pageIndex = 0;
  // pageSize = 100;
  // resultCount = 200;

  generateIndex = true;

  devices: Device[];
  selectedDevice: Device;

  profiles: Profile[];
  selectedProfile: Profile;

  // folders: Folder[];
  // selectedFolder: Folder;
  // path: string;
  // folderReloading: boolean;

  // foldersRight: Folder[];
  // selectedFolderRight: Folder;

  tree: ImportTree;

  // state = 1;

  constructor(
    private api: ApiService,
    public importService: ImportService,
    private router: Router,
    private dialog: MatDialog) { }

  // ngOnInit() {
  //   // this.folderReloading = false;
  //   // this.path = '/';
  //   // this.state = 'loading';
  //   const rDevice = this.api.getDevices();
  //   const rProfiles = this.api.getImportProfiles();
  //   forkJoin(rDevice, rProfiles).subscribe(([devices, profiles]: [Device[], Profile[]]) => {
  //     this.profiles = profiles;
  //     this.devices = devices;
  //     if (this.profiles.length > 0) {
  //       this.selectedProfile = this.profiles[0];
  //     }
  //     if (this.devices.length > 0) {
  //       this.selectedDevice = this.devices[0];
  //     }
  //     this.reload();
  //     this.tree = new ImportTree(Folder.root());
  //     // this.search.selectedTree = this.tree;
  //     this.tree.expand(this.api);
  //   });
  // }


  ngOnInit() {
    this.importService.init();
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

  reload() {
    this.tree = new ImportTree(Folder.root());
    this.tree.expand(this.api);
  }

  onLoad() {
    if (!this.importService.anyFolderSelected()) {
      return;
    }
    if (this.importService.folders.length == 1) {
      this.api.createImportBatch(this.importService.folders[0].path, this.selectedProfile.id, this.generateIndex, this.selectedDevice.id).subscribe((batch: Batch) => {
        const dialogRef = this.dialog.open(ImportDialogComponent, { data: {batch: batch.id }});
        dialogRef.afterClosed().subscribe(result => {
          if (result === 'open') {
            this.router.navigate(['/import', 'edit', batch.id]);
          } else {
            this.reload();
          }
        });
      });
    } else {
      const paths = this.importService.folders.map((folder: Folder) => folder.path);
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
            label: "Otevří správu importních procesů",
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

  // openPath(path: string) {
  //   this.path = path;
  //   this.reload();
  // }


  // openFolderRight(folder: Folder) {
  //   this.path = this.selectedFolder.path;
  //   this.reload(folder);
  // }



  // openFolder(folder: Folder) {
  //  this.openPath(folder.path);
  // }

  // openFolderAtPathIndex(index: number) {
  //   let path = '';
  //   const segments = this.path.split('/');
  //   for (let i = 0; i < index; i++) {
  //     path += segments[i] + '/';
  //   }
  //   this.openPath(path);
  // }


  // selectFolder(folder: Folder) {
  //   if (folder == this.selectedFolder) {
  //     return;
  //   }
  //   this.selectedFolder = folder;
  //   this.reloadRight(folder.path);
  // }

  // selectFolderRight(folder: Folder) {
  //   this.selectedFolderRight = folder;
  // }

  // onLoadAndSave() {
  //   const dialogRef = this.dialog.open(ParentDialogComponent, { data: { btnLabel: 'import.load_and_save' }});
  //   dialogRef.afterClosed().subscribe(result => {
  //     if (result && result['pid']) {
  //       this.load(result['pid']);
  //     }
  //   });
  // }

  // private load(parentPid: string = null) {
  //   this.api.createImportBatch(this.selectedFolderRight.path, this.selectedProfile.id, this.generateIndex, this.selectedDevice.id).subscribe((batch: Batch) => {
  //     const dialogRef = this.dialog.open(ImportDialogComponent, { data: {batch: batch.id, parent: parentPid }});
  //     dialogRef.afterClosed().subscribe(result => {
  //       if (result === 'open') {
  //         this.router.navigate(['/document', parentPid]);
  //       } else {
  //         this.reload();
  //       }
  //     });
  //   });
  // }



  // reload() {

  // }



  // reload(preselectFolder: Folder = null) {
  //   this.selectedFolder = null;
  //   this.selectedFolderRight = null;
  //   this.folderReloading = true;
  //   this.api.getImportFolders(this.selectedProfile, this.path).subscribe((folders: Folder[]) => {
  //     this.folders = folders;
  //     if (preselectFolder) {
  //       for (const folder of folders) {
  //         if (folder.path == preselectFolder.path) {
  //           this.selectFolder(folder);
  //           return;
  //         }
  //       }

  //     } else if (folders.length > 0) {
  //       this.selectFolder(folders[0]);
  //       return;
  //     }
  //     this.folderReloading = false;
  //     this.state = 'success';
  //   });
  // }


  // reloadRight(path: string) {
  //   this.selectedFolderRight = null;
  //   this.folderReloading = true;
  //   this.api.getImportFolders(this.selectedProfile, path).subscribe((folders: Folder[]) => {
  //     this.foldersRight = folders;
  //     this.folderReloading = false;
  //     this.state = 'success';
  //   });
  // }

  onProfileChanged() {
    // this.reload();
  }


  onPageChanged(page) {
    // this.pageIndex = page.pageIndex;
    // this.reload();
  }



}
