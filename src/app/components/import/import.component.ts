import { DocumentItem } from '../../model/documentItem.model';
import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Profile } from 'src/app/model/profile.model';

@Component({
  selector: 'app-import',
  templateUrl: './import.component.html',
  styleUrls: ['./import.component.scss']
})
export class ImportComponent implements OnInit {

  state = 'none';
  items: DocumentItem[];
  profles: Profile[];

  pageIndex = 0;
  pageSize = 100;
  resultCount = 200;

  constructor(private api: ApiService) { }

  ngOnInit() {
    this.reload();
  }

  reload() {
    this.state = 'loading';
    this.api.getImportProfiles().subscribe((profiles: Profile[]) => {
      this.profles = profiles;
      console.log('profiles', profiles);
    });
  //   this.api.getSearchResults(this.model, this.query, this.pageIndex).subscribe((items: DocumentItem[]) => {
  //     this.items = items;
  //     this.state = 'success';
  //   });
  // }
  }

  onPageChanged(page) {
    this.pageIndex = page.pageIndex;
    this.reload();
  }



}
