import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-song',
  templateUrl: './song.component.html',
  styleUrls: ['./song.component.scss']
})
export class SongComponent implements OnInit, OnDestroy {

  @Input()
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  playing: boolean;
  canPlay: boolean;
  trackPosition: number;
  trackDuration: number;
  trackPositionText: string;
  trackDurationText: string;

  state = 'none';
  audio: any;

  constructor(private api: ApiService, private layout: LayoutService) {
  }

  ngOnDestroy(): void {
    if (this.isPlaying()) {
      this.pauseTrack();
    }
    this.audio = null;
  }

  ngOnInit() {
  }

  onPidChanged(pid: string) {
    this.audio = null;
    this.trackPosition = -1;
    this.trackDuration = -1;
    this.trackPositionText = '';
    this.trackDurationText = '';
    this.playing = false;
    this.canPlay = false;
    this.state = 'loading';
    const url = this.api.getStreamUrl(pid, 'FULL', this.layout.getBatchId());
    if (this.audio) {
      this.audio.setAttribute('src', url);
      this.audio.load();
    } else {
      this.audio = new Audio(url);
      this.audio.load();
    }
    this.audio.ontimeupdate = () => {
      this.trackPosition = Math.round(this.audio.currentTime);
      this.trackPositionText = this.formatTime(this.trackPosition);
    };
    this.audio.onloadedmetadata = () => {

      if (this.audio.duration !== Infinity) {
        this.trackDuration = Math.round(this.audio.duration);
        this.trackDurationText = this.formatTime(this.trackDuration);
      } else {
        this.trackDurationText = 'Infinity';
      }
      this.trackPosition = Math.round(this.audio.currentTime);
      this.trackPositionText = this.formatTime(this.trackPosition);
      console.log('this.trackDuration', this.trackDuration);
    };
    this.audio.onended = () => {
    };
    this.audio.oncanplay = () => {
      this.state = 'success';
      this.canPlay = true;
      // if (autoplay) {
      //   this.playTrack();
      // }
    };
  }


  isPlaying(): boolean {
    return this.playing;
  }

  playTrack() {
    console.log('play');
    if (this.audio && this.canPlay) {
      this.playing = true;
      this.audio.play();
    }
  }

  pauseTrack() {
    console.log('pause');
    if (this.audio && this.canPlay) {
      this.playing = false;
      this.audio.pause();
    }
  }

  changeTrackPosition(value: number) {
    this.audio.currentTime = value;
  }

  moveForward() {
    this.audio.currentTime = Math.min(this.audio.currentTime + 10, this.trackDuration);
  }

  moveBackward() {
    this.audio.currentTime = Math.max(this.audio.currentTime - 10, 0);
  }


  private formatTime(secs: number) {
    const hr = Math.floor(secs / 3600);
    const min = Math.floor((secs - (hr * 3600)) / 60);
    const sec = Math.floor(secs - (hr * 3600) - (min * 60));
    const m = min < 10 ? '0' + min : '' + min;
    const s = sec < 10 ? '0' + sec : '' + sec;
    const h = hr > 0 ? hr + ':' : '';
    return h + m + ':' + s;
  }

}
