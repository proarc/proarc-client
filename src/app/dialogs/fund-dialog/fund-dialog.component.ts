
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FundService } from 'src/app/services/fund.service';

@Component({
  templateUrl: './fund-dialog.component.html',
  styleUrls: ['./fund-dialog.component.scss']
})
export class FundDialogComponent implements OnInit {

  state = 'none';
  allFunds: any;
  funds: any[];
  selectedFund: any;
  query = '';
  archive: string;

  constructor(
    private dialogRef: MatDialogRef<FundDialogComponent>,
    private fund: FundService,
    @Inject(MAT_DIALOG_DATA) private data: string) { 
      this.archive = data;
  }

  ngOnInit() {
    this.allFunds = this.fund.getFund(this.archive);
  }

  search(query: string) {
    if (query.length > 1) {
      this.funds = [];
      for (const id in this.allFunds) {
        const name = this.allFunds[id];
        if (name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          this.funds.push({ id: id, name: name });
        }
        this.funds.sort((a: any, b: any): number => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      }
      if (this.funds.length > 1) {
        this.state = 'results';
      } else {
        this.state = 'empty';
      }
    } else {
      this.state = 'none';
    }
  }


  onChange(value: string) {
    this.search(value);
  }

  onApprove() {
    this.dialogRef.close({ id: this.fund.buildFullId(this.archive, this.selectedFund['id']), name: this.selectedFund['name']});
  }

}

