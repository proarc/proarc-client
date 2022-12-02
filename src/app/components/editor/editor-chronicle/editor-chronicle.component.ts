import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CatalogDialogComponent } from 'src/app/dialogs/catalog-dialog/catalog-dialog.component';
import {SimpleDialogData} from '../../../dialogs/simple-dialog/simple-dialog';
import {SimpleDialogComponent} from '../../../dialogs/simple-dialog/simple-dialog.component';
import { LayoutService } from 'src/app/services/layout.service';
import { Metadata } from 'src/app/model/metadata.model';
import { ApiService } from 'src/app/services/api.service';
import { UIService } from 'src/app/services/ui.service';
import { MetadataService } from 'src/app/services/metadata.service';

@Component({
  selector: 'app-editor-chronicle',
  templateUrl: './editor-chronicle.component.html',
  styleUrls: ['./editor-chronicle.component.scss']
})
export class EditorChronicleComponent implements OnInit {

  @Input() model: string;
  @Input() notSaved = false;
  state = 'none';

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }
  constructor(public layout: LayoutService, 
    private api: ApiService,
    private ui: UIService,
    public metaService: MetadataService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  private onPidChanged(pid: string) {
    if (this.notSaved) {
      return;
    }
    this.state = 'loading';
    this.metaService.loadMetadata(this.pid, this.model, (metadata: Metadata) => {
      this.state = 'success';
    });
  }

  onSave() {
    if (this.metaService.metadata.validate()) {
      this.metaService.saveMetadata(false, () => {
      });
    } else {

      const data: SimpleDialogData = {
        title: "Nevalidní data",
        message: "Nevalidní data, přejete si dokument přesto uložit?",
        btn1: {
          label: "Uložit nevalidní dokument",
          value: 'yes',
          color: 'warn'
        },
        btn2: {
          label: "Neukládat",
          value: 'no',
          color: 'default'
        },
      };
      const dialogRef = this.dialog.open(SimpleDialogComponent, { data: data });
      dialogRef.afterClosed().subscribe(result => {
        if (result === 'yes') {
          this.metaService.saveMetadata(false, () => {
          });
        }
      });
    }
  }

  available(element: string): boolean {
    return this.metaService.metadata.template[element];
  }


  onLoadFromCatalog() {
    const dialogRef = this.dialog.open(CatalogDialogComponent, { data: { type: 'full' } });
    dialogRef.afterClosed().subscribe(result => {
      if (result && result['mods']) {
        this.metaService.saveModsFromCatalog(result['mods'], () => {

        });
      }
    });
  }

}
