import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Note } from 'src/app/model/note.model';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-note',
  templateUrl: './note.component.html',
  styleUrls: ['./note.component.scss']
})
export class NoteComponent implements OnInit {

  state = 'none';
  note: Note;

  constructor(private api: ApiService, private layout: LayoutService, private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.state = 'loading';
    this.route.params.subscribe(params => {
      const id = params['id'];
      this.api.getNote(id).subscribe((note: Note) => {
        this.note = note;
        this.state = 'success';
      }, () => {
        this.state = 'failure';
      });
    });
  }

  updateNote() {
    this.state = 'loading';
    this.api.editNote(this.note, this.layout.getBatchId()).subscribe((note: Note) => {
      this.note = note;
      this.state = 'success';
    }, () => {
      this.state = 'failure';
    });
  }

}
