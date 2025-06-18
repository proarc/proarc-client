import { Component, Input, OnInit, ElementRef, ViewChild, effect, input } from '@angular/core';
import Book from 'epubjs/types/book';
import { NavItem } from 'epubjs/types/navigation';
import Rendition from 'epubjs/types/rendition';
import Epub from 'epubjs';
import { Subscription } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { FlexLayoutModule } from 'ngx-flexible-layout';
import { ApiService } from '../../services/api.service';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  imports: [TranslateModule, FormsModule, FlexLayoutModule, MatCardModule, MatButtonModule, MatMenuModule, MatIconModule, MatTooltipModule],
  selector: 'app-epub',
  templateUrl: './epub.component.html',
  styleUrls: ['./epub.component.scss']
})
export class EpubComponent implements OnInit {

  @ViewChild('epubViewer') epubViewer: ElementRef;

  bookTitle = '';
  chapterTitle = '';
  book: Book;
  rendition: Rendition;
  chapters: NavItem[] = [];
  
  currentChapter: any;
  
  state: string;
  epubUrl: string;

  subscriptions: Subscription[] = [];
  stream = input<string>();
  pid = input<string>();
  private currentStream: string;
  private currentPid: string;

  onPidChanged(pid: string) {
    this.state = 'loading';
    this.epubUrl = this.api.getStreamUrl(pid, this.currentStream);
    if (!pid) {
      return;
    }
    this.loadBook();
  }

  constructor(
    private api: ApiService
  ) {
    effect(() => {
      this.currentPid = this.pid();
      this.currentStream = this.stream();
      this.onPidChanged(this.currentPid);
    })
  }

  ngOnDestroy() {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

  ngOnInit() {
    // this.subscriptions.push(this.layout.resized().subscribe((a: boolean) => {
    //   if(this.rendition) {
    //     this.rendition.resize(this.epubViewer.nativeElement.clientWidth, this.epubViewer.nativeElement.clientHeight);
    //   }
    // }))
    document.addEventListener("keydown", (e: KeyboardEvent) => {
      
      if (e.key === 'ArrowLeft') {
        // left arrow
        this.showPrev();
      }
      else if (e.key === 'ArrowRight') {
        // right arrow
        this.showNext();
      }
    });
  }

  loadBook() {
    this.book = Epub(this.epubUrl,  { openAs: "epub" });
    this.book.loaded.metadata.then(meta => {
      this.bookTitle = meta.title;
    });
    this.storeChapters();
    this.rendition = this.book.renderTo('epub_viewer', 
    {
      width: "100%",
      height: "100%",
      // manager: "continuous",
      // flow: "scrolled",
      spread: "always"
    });
    this.rendition.on('rendered', (section: { href: string; }) => {
      this.currentChapter = this.book.navigation.get(section.href);
      this.chapterTitle = this.currentChapter ? this.currentChapter.label : '';
    });
    this.rendition.display();
  }


  showNext() {
    this.rendition.next();
  }
  showPrev() {
    this.rendition.prev();
  }

  displayChapter(chapter: any) {
    this.currentChapter = chapter;
    this.rendition.display(chapter.href);
  }

  private storeChapters() {
    this.book.loaded.navigation.then(navigation => {
      this.chapters = navigation.toc;
      this.currentChapter = this.chapters[4];
    });
  }
}