
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentItem } from 'src/app/model/documentItem.model';
import { Metadata } from 'src/app/model/metadata.model';
import { Page } from 'src/app/model/page.model';
import { ApiService } from 'src/app/services/api.service';

@Component({
  templateUrl: './children-validation-dialog.component.html',
  styleUrls: ['./children-validation-dialog.component.scss']
})
export class ChildrenValidationDialogComponent implements OnInit {

  private children: DocumentItem[];

  state: string;
  index = 0;
  numberOfInvalid = 0;
  numberOfValid = 0;
  count: number;

  metadatas: { item: DocumentItem, metadata: Metadata }[] = [];

  constructor(
    private api: ApiService,
    public dialogRef: MatDialogRef<ChildrenValidationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.children = data.children;
    this.count = this.children.length;
    dialogRef.disableClose = true;
  }

  ngOnInit() {
    if (this.count == 0) {
      this.onFinish();
      return;
    }
    this.state = 'running';
    this.validate();
  }

  revalidate() {

    // this.index = 0;
    // this.numberOfInvalid = 0;
    // this.numberOfValid = 0;
    this.metadatas.forEach(m => {
        m.item.invalid = !m.metadata.validate();
        console.log(m.item)
        if (m.item.invalid) {
          this.numberOfInvalid += 1;
        } else {
          this.numberOfValid += 1;
        }
      
    });

  }

  validate() {
    if (this.index == this.count) {
      this.onFinish();
      return;
    }
    const item = this.children[this.index];
    if (item.isPage()) {
      this.api.getPage(item.pid, item.model, this.data.batchId).subscribe((page: Page) => {
        item.invalid = !page.isValid();
        if (item.invalid) {
          this.numberOfInvalid += 1;
        } else {
          this.numberOfValid += 1;
        }
        this.index += 1;
        this.validate();
      });
    } else {
      this.api.getMetadata(item.pid).subscribe((response: any) => {
        if (response.errors) {
          this.numberOfInvalid += 1;
          item.invalid = true;
        } else {
          const metadata = new Metadata(item.pid, item.model, response['record']['content'], response['record']['timestamp']);
          this.metadatas.push({ item, metadata });
        }

        this.index += 1;
        this.validate();
      });

    }

  }


  //   this.api.getImportBatchStatus(this.batchId).subscribe(
  //     (status: [number, number]) => {
  //     this.done = status[0];
  //     this.count = status[1];
  //     if (this.done === this.count) {
  //       this.onLoaded();
  //     }
  //   },
  //   (error) => {
  //       clearInterval(this.timer);
  //       this.state = 'failure';
  //   });
  // }


  private onFinish() {
    setTimeout(() => {
      this.revalidate();
    }, 100)

    this.state = 'done';
  }


}
