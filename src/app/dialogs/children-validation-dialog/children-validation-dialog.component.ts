
import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import {AudioPage} from '../../model/audioPage.model';
import { ILayoutPanel } from '../layout-admin/layout-admin.component';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DocumentItem } from '../../model/documentItem.model';
import { Metadata } from '../../model/metadata.model';
import { Page } from '../../model/page.model';
import { ApiService } from '../../services/api.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TemplateService } from '../../services/template.service';
import { EditorMetadataComponent } from "../../editors/editor-metadata/editor-metadata.component";

@Component({
  imports: [CommonModule, TranslateModule, MatDialogModule,
    MatIconModule, MatButtonModule, MatTooltipModule, MatCardModule,
    MatProgressBarModule, EditorMetadataComponent],
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
  panel: ILayoutPanel = {
    id: 'children_validation',
    visible: true,
    size: 0,
    type: 'a',
    isDirty: false,
    canEdit: true
  };

  metadatas: { item: DocumentItem, metadata: Metadata }[] = [];

  constructor(
    private api: ApiService,
    private tmpl: TemplateService,
    public dialogRef: MatDialogRef<ChildrenValidationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
  }

  ngOnInit() {
    this.children = this.data.children;
    this.count = this.children.length;
    this.dialogRef.disableClose = true;
    if (this.count == 0) {
      this.onFinish();
      return;
    }
    this.state = 'running';
    this.validate();
  }

  validateApi() {
    this.api.validate(this.data.parent.pid, this.data.batchId).subscribe((response: any) => {
      if (response.errors) {

      } else {

      }

      this.state = 'done';

    });
  }

  revalidate() {
    console.log(this.metadatas)
    this.metadatas.forEach(m => {
      const v = m.metadata.validate();
      m.item.invalid = !v;
      if (m.item.invalid) {
        this.numberOfInvalid += 1;
      } else {
        this.numberOfValid += 1;
      }
    });

  }

  validate() {
    if (this.index === this.count) {
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
    } else if(item.isAudioPage()) {
      this.api.getAudioPage(item.pid, item.model, this.data.batchId).subscribe((audioPage: AudioPage) => {
        item.invalid = !audioPage.isValid();
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

          const standard = response['record']['standard'] ? response['record']['standard'] : Metadata.resolveStandardFromXml(response['record']['content']);
          this.tmpl.getTemplate(standard, item.model).subscribe((tmpl: any) => {
            this.metadatas.push({
              item: item,
              metadata: new Metadata(item.pid, item.model, response['record']['content'], response['record']['timestamp'], response['record']['standard'], tmpl)
          });
          })
        }

        this.index += 1;
        this.validate();
      });

    }

  }



  private onFinish() {
    setTimeout(() => {
      this.revalidate();
    }, 100)

    this.state = 'done';
  }


}
