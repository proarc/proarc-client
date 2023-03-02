import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import Book from 'epubjs/types/book';
import { NavItem } from 'epubjs/types/navigation';
import Rendition from 'epubjs/types/rendition';
import Epub from 'epubjs';
import { LayoutService } from 'src/app/services/layout.service';
import { Subscription } from 'rxjs';

@Component({
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
    private api: ApiService,
    private layout: LayoutService
  ) {
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