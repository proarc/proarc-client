import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Book from 'epubjs/types/book';
import { NavItem } from 'epubjs/types/navigation';
import Rendition from 'epubjs/types/rendition';
import Epub from 'epubjs';

@Component({
  selector: 'app-epub',
  templateUrl: './epub.component.html',
  styleUrls: ['./epub.component.scss']
})
export class EpubComponent implements OnInit {
  bookTitle = '';
  chapterTitle = '';
  book: Book;
  rendition: Rendition;
  chapters: NavItem[] = [];
  navOpen: Boolean;
  currentChapter: any;
  sessionId: string;
  pollInterval: any;
  state: string;
  epubUrl: string;

  
  private currentStream: string;
  @Input()
  set stream(stream: string) {
    this.currentStream = stream;
    this.onPidChanged(this.currentPid);
  }

  private currentPid: string;
  @Input() 
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  onPidChanged(pid: string) {
    this.currentPid = pid;
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
  }

  ngOnInit() {}

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
      flow: "scrolled",
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

  toggleNav() {
    this.navOpen = !this.navOpen;
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