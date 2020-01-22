import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Batch } from 'src/app/model/batch.model';
import { User } from 'src/app/model/user.model';
import { SimpleDialogData } from 'src/app/dialogs/simple-dialog/simple-dialog';
import { MatDialog } from '@angular/material';
import { SimpleDialogComponent } from 'src/app/dialogs/simple-dialog/simple-dialog.component';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  state = 'none';

  pageIndex = 0;
  pageSize = 100;
  resultCount = 200;

  selectedState = 'ALL';

  users: User[];
  batches: Batch[];
  selectedBatch: Batch;
  

  batchStates = [
    'ALL',
    'LOADING',
    'LOADING_FAILED',
    'LOADED',
    'INGESTING',
    'INGESTING_FAILED',
    'INGESTED'
  ];

  constructor(
    private api: ApiService, private dialog: MatDialog) { }

  ngOnInit() {
    this.reload();
  }

  selectBatch(batch: Batch) {
    this.selectedBatch = batch;
  }

  reload() {
    this.selectedBatch = null;
    this.state = 'loading';
    this.api.getImportBatches(this.selectedState).subscribe((batches: Batch[]) => {
      console.log('batches', batches);
      this.batches = batches;
      this.state = 'success';
    })
  }

  reloadBatch() {
    
  }

  onReloadBatch() {
    const data: SimpleDialogData = {
      title: 'Opětovné načtení dávky',
      message: `Opravdu chcete importovaný adresář načíst znovu? Vytvořena metadata budou odstraněna.`,
      btn2: {
        label: 'Ne',
        value: 'no',
        color: 'default'
      },
      btn1: { 
        label: 'Ano',
        value: 'yes',
        color: 'warn'
      }
    };
    const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.reloadBatch();
      }
    });
  }

  onEditBatchObject() {

  }

  onContinueWithBatch() {

  }


  onStateChanged() {
    this.reload();
  }


  onPageChanged(page) {
    // this.pageIndex = page.pageIndex;
    // this.reload();
  }



}
