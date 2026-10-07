
import { Component, OnInit, OnDestroy, Input, effect, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { ApiService } from '../../services/api.service';
import { LayoutService } from '../../services/layout-service';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSliderModule} from '@angular/material/slider';
import {FormsModule} from '@angular/forms';



@Component({
  imports: [TranslateModule, MatIconModule, MatProgressSpinnerModule, MatTooltipModule, FormsModule, MatSliderModule],
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit, OnDestroy {

  currentPid: string;
  pid = input<string>();

  playing: boolean;
  canPlay: boolean;
  trackPosition: number;
  trackDuration: number;
  trackPositionText: string;
  trackDurationText: string;

  state = 'none';
  audio: any;


  // Stavy pro šablonu
  currentTime = 0;
  duration = 0;
  isUserSeeking = false; 

  constructor(private api: ApiService, private layout: LayoutService) {
    effect(() => {
      this.currentPid = this.pid();
      this.onPidChanged(this.currentPid);
    })
  }

  ngOnDestroy(): void {
    // if (this.isPlaying()) {
    //   this.pauseTrack();
    // }
    // this.audio = null;

    this.audio.pause();
    this.audio.src = '';
  }

  ngOnInit() {
  }

  onPidChanged(pid: string) {

    console.log('AAA')
    this.audio = null;
    this.trackPosition = -1;
    this.trackDuration = -1;
    this.trackPositionText = '';
    this.trackDurationText = '';
    this.playing = false;
    this.canPlay = false;
    this.state = 'loading';
    const url = this.api.getStreamUrl(pid, 'FULL', this.layout.batchId);

    if (this.audio) {
      this.audio.setAttribute('src', url);
      this.audio.load();
    } else {
      this.audio = new Audio(url);
      this.audio.load();
    }

    // 1. Načtení celkové délky audia
    this.audio.addEventListener('loadedmetadata', () => {

      this.duration = this.audio.duration;
      this.state = 'success';
      this.canPlay = true;
    });

    // 2. Aktualizace slideru během přehrávání
    this.audio.addEventListener('timeupdate', () => {
      if (!this.isUserSeeking) {
    
        this.currentTime = this.audio.currentTime;
      }
    });

    // Sledování stavu přehrávání (volitelné)
    this.audio.addEventListener('play', () => this.playing = true);
    this.audio.addEventListener('pause', () => this.playing = false);


    // this.audio.ontimeupdate = () => {
    //   this.trackPosition = Math.round(this.audio.currentTime);
    //   this.trackPositionText = this.formatTime(this.trackPosition);
    // };

    // this.audio.onloadedmetadata = () => {
    //   if (this.audio.duration !== Infinity) {
    //     this.trackDuration = Math.round(this.audio.duration);
    //     this.trackDurationText = this.formatTime(this.trackDuration);
    //   } else {
    //     this.trackDurationText = 'Infinity';
    //   }
    //   this.trackPosition = Math.round(this.audio.currentTime);
    //   this.trackPositionText = this.formatTime(this.trackPosition);
    // };

    // this.audio.onended = () => {
    // };

    // this.audio.oncanplay = () => {
    //   this.state = 'success';
    //   this.canPlay = true;
    // };
  }


  // isPlaying(): boolean {
  //   return this.playing;
  // }

  playTrack() {
    if (this.audio && this.canPlay) {
      this.playing = true;
      this.audio.play();
    }
  }

  pauseTrack() {
    if (this.audio && this.canPlay) {
      this.playing = false;
      this.audio.pause();
    }
  }

  changeTrackPosition(value: number) {
    //this.audio.currentTime = value;
  }

  moveForward() {
    this.audio.currentTime = Math.min(this.audio.currentTime + 10, this.trackDuration);
  }

  moveBackward() {
    this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
  }


  formatTime(secs: number) {
    if (secs === Infinity) {
      return '';
    }
    const hr = Math.floor(secs / 3600);
    const min = Math.floor((secs - (hr * 3600)) / 60);
    const sec = Math.floor(secs - (hr * 3600) - (min * 60));
    const m = min < 10 ? '0' + min : '' + min;
    const s = sec < 10 ? '0' + sec : '' + sec;
    const h = hr > 0 ? hr + ':' : '';
    return h + m + ':' + s;
  }

  onSliderStart() {
    this.isUserSeeking = true;
  }

  // Uživatel posouvá slider (aktualizujeme pouze vizuální stav čísla)
  onSliderInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.currentTime = parseFloat(input.value);
  }

  // Uživatel slider pustil (teď teprve změníme reálný čas v audio souboru)
  onSliderChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const targetTime = parseFloat(input.value);
    
    this.audio.currentTime = targetTime;
    this.isUserSeeking = false; 
  }

}
