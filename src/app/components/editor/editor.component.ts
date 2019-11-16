import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { combineLatest } from 'rxjs'
import { EditorService } from 'src/app/services/editor.service';

@Component({
  selector: 'app-editor',
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.scss']
})
export class EditorComponent implements OnInit {


  constructor(private route: ActivatedRoute, public editor: EditorService) { }

  ngOnInit() {

    combineLatest([this.route.paramMap, this.route.queryParamMap]).subscribe(
      results => {
        const p = results[0];
        const q = results[1];
        const pid = p.get('pid');
        console.log('pid', pid);
        if (pid) {
          // const page = q.get('page');
          const article = q.get('article');
          const chapter = q.get('chapter');
          const fulltext = q.get('fulltext');
          this.editor.init({
            pid: pid
          });
        }
    });

  }


}
