import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

declare var ol: any;

declare global {
  interface Document {
    msExitFullscreen: any;
    mozCancelFullScreen: any;
    mozFullScreenElement: any;
    msFullscreenElement: any;
  }

  interface Element {
    msRequestFullscreen(): void;
    mozRequestFullScreen(): void;
  }
}

import { ResizedEvent } from 'angular-resize-event';
import { LayoutService } from 'src/app/services/layout.service';
import { StreamProfile } from 'src/app/model/stream-profile';

@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {

  @Input() idViewer = 'app-viewer';
  @Input() isKramerius: boolean;
  @Input() instance: string;
  @Input() hideToolbar: boolean;

  // @Input()
  // set pid(pid: string) {
  //   this.onPidChanged(pid);
  // }

  private _imageInfo: {pid: string, dsid: string, width?: number, height?: number};
  @Input()
  set imageInfo(info: {pid: string, dsid: string, width?: number, height?: number}) {
    this.inputPid = info.pid;
    if (this.isLocked) {
      return;
    }
    if (this.view) {
      this.view.removeLayer(this.imageLayer);
      this.view.updateSize();
    }
    this._imageInfo = info;
    console.log(this._imageInfo.width);
    if (this._imageInfo.width) {
      this.loadImage();
    } else {
      this.getProfiles(this._imageInfo.pid)
    }
    
  }

  // currentStreamProfile: StreamProfile;
  // @Input()
  // set streamProfile(stream: StreamProfile) {
  //   if (this.isLocked) {
  //     return;
  //   }
  //   if (this.view) {
  //     this.view.removeLayer(this.imageLayer);
  //     this.view.updateSize();
  //   }
  //   this.currentStreamProfile = stream;
  //   this.loadImage();
  // }


  private inputPid: string;
  isLocked = false;

  private view: any;
  private imageLayer: any;

  private imageWidth = 0;
  private imageHeight = 0;

  private maxResolution = 0;
  private minResolution = 0;

  private lastRotateTime = 0;

  fullscreenAvailable = false;
  positionLock: boolean;
  isFitToScreen: boolean;

  private extent: any;

  state = 'none';

  imageUrl: string;
  maxImageSize: number = 6000;
  viewOl = true;

  constructor(private api: ApiService, private layout: LayoutService, private properties: LocalStorageService) {
    this.initFullscreenCapabilities();
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.init();
  }

  onResized(event: ResizedEvent) {
    if (this.view) {
      this.view.updateSize();
    }
    
  }

  changeLockPanel() {
    this.isLocked = !this.isLocked;
    if (!this.isLocked) {
      this.onPidChanged(this.inputPid)
    }
  }

  onPidChanged(pid: string) {
    this.inputPid = pid;
    if (this.isLocked) {
      return;
    }
    if (this.view) {
      this.view.removeLayer(this.imageLayer);
      this.view.updateSize();
    }
    //this.loadImage();
  }

  loadRawImage() {
    this.state = 'loading';
  this.imageUrl = this.isKramerius ?
    this.api.getKrameriusImageUrl(this.inputPid, this.instance) :
    this.api.getStreamUrl(this.inputPid, this._imageInfo.dsid, this.layout.getBatchId());
    const image = new Image();
    image.onload = (() => {
      if (image.width > this.maxImageSize || image.height > this.maxImageSize) {
        this.viewOl = false;
        this.state = 'success';
      } else {
        this.viewOl = true;
        this.onLoad(this.imageUrl, image.width, image.height);
      }
      
    });
    image.onerror = ((err: any) => {
      image.onerror = null;
      this.state = 'error';
      console.log('image load failure');
    });
    image.src = this.imageUrl;
  }

  getProfiles(pid: string) {
    const isRepo = this.layout.type === 'repo';
    if (!isRepo) {
      this.loadRawImage();
      return;
    }
    this.state = 'loading';
    let streamProfile: StreamProfile;
    this.api.getStreamProfile(pid).subscribe((response: any) => {
      if (response?.response?.data) {
        const streamProfiles: StreamProfile[] = response.response.data;
        if (streamProfiles.length > 0) {
          // try FULL as default
          streamProfile = streamProfiles.find((s: any) => s.dsid === 'FULL');
          if (!streamProfile) {
            streamProfile = streamProfiles[0];
          }
          
          this._imageInfo = {pid: pid, dsid: streamProfile.dsid, width: streamProfile.width, height: streamProfile.height};
          this.loadImage();

        } else {
          this.state = 'empty';
          streamProfile = null;
          this.loadRawImage();
          return;
        }
      } 
    });
  }

  loadImage() {
    if (!this.inputPid) {
      return;
    }
    const stream = this._imageInfo ? this._imageInfo.dsid : 'FULL'; 
    this.state = 'loading';
    this.imageUrl = this.isKramerius ?
      this.api.getKrameriusImageUrl(this.inputPid, this.instance) :
      this.api.getStreamUrl(this.inputPid, stream, this.layout.getBatchId());

      if (this._imageInfo.width > this.maxImageSize || this._imageInfo.height > this.maxImageSize) {
        this.viewOl = false;
        // this.state = 'success';
      } else {
        this.viewOl = true;
          if (this.view) {
            this.onLoad(this.imageUrl, this._imageInfo.width, this._imageInfo.height);
          } else {
            setTimeout(() => {
              this.onLoad(this.imageUrl, this._imageInfo.width, this._imageInfo.height);
            }, 1);
          }
      }
  }

  onLoad(url: string, width: number, height: number) {
    this.positionLock = this.properties.getBoolProperty('viewer.positionLock', false);
    // this.isFitToScreen = this.properties.getBoolProperty('viewer.fitToScreen', true);
    if (this.extent) {
      this.saveCurrentPosition();
    }
    this.state = 'success';
    // this.view.removeLayer(this.imageLayer);
    // this.view.updateSize();
    this.imageWidth = width;
    this.imageHeight = height;
    this.extent = [0, -this.imageHeight, this.imageWidth, 0];
    this.maxResolution = this.getBestFitResolution() * 1.5;
    this.minResolution = 0.5;
    const viewOpts: any = {
      extent: this.extent,
      minResolution: this.minResolution,
      maxResolution: this.maxResolution,
      constrainOnlyCenter: true,
      smoothExtentConstraint: false
    };
    const view = new ol.View(viewOpts);
    this.view.setView(view);
    const that = this;
    const source: any = new ol.source.ImageStatic({
        url: url,
        imageSize: [width, height],
        imageExtent: this.extent,
    });
    source.on(['imageloadend', 'imageloaderror'], function () {
      that.state = 'success';
    });
    const iLayer = new ol.layer.Image({
      source: source
      })
    this.view.addLayer(iLayer);
    this.imageLayer = iLayer;
    if (this.positionLock) {
      this.view.updateSize();
      this.view.getView().setRotation(this.properties.getStringProperty('viewer.roration'));
      this.view.getView().setCenter(this.properties.getStringProperty('viewer.center').split(','));
      this.view.getView().setResolution(this.properties.getStringProperty('viewer.resolution'));
    } else {
      //setTimeout(() => {
        this.fitToScreen();
      //}, 1);
      
    }
  }

  onSwitchLock() {
    this.positionLock = !this.positionLock;
    this.properties.setBoolProperty('viewer.positionLock', this.positionLock);
    this.saveCurrentPosition();
  }

  saveCurrentPosition() {
    if (!this.positionLock) {
      return;
    }
    if (this.view.getView()) {
      this.properties.setStringProperty('viewer.rotation', this.view.getView().getRotation());
      this.properties.setStringProperty('viewer.center', this.view.getView().getCenter().join(','));
      this.properties.setStringProperty('viewer.resolution', this.view.getView().getResolution());
    }
  }

  init() {
    const interactions = ol.interaction.defaults({ keyboardPan: false, pinchRotate: false });
    this.view = new ol.Map({
      target: this.idViewer,
      controls: [],
      interactions: interactions,
      loadTilesWhileAnimating: true,
      layers: []
    });
  }

  fitToScreen() {
    // this.isFitToScreen = !this.isFitToScreen;
    // if (!this.isFitToScreen) {
    //   return;
    // }
    this.view.updateSize();
    this.view.getView().setRotation(0);
    this.view.getView().fit(this.extent);
  }

  zoomIn() {
    const currentZoom = this.view.getView().getResolution();
    let newZoom = currentZoom / 1.5;
    if (newZoom < this.minResolution) {
      newZoom = this.minResolution;
    }
    this.view.getView().animate({
      resolution: newZoom,
      duration: 300
    });
  }

  zoomOut() {
    const currentZoom = this.view.getView().getResolution();
    let newZoom = currentZoom * 1.5;
    if (newZoom > this.maxResolution) {
      newZoom = this.maxResolution;
    }
    this.view.getView().animate({
      resolution: newZoom,
      duration: 300
    });
  }

  rotateRight() {
    this.rotate(Math.PI / 2);

  }

  getBestFitResolution() {
    const rx = this.imageWidth / (this.view.getSize()[0] - 10);
    const ry = this.imageHeight / (this.view.getSize()[1] - 10);
    return Math.max(rx, ry);
  }

  // bestFit() {
  //   this.view.getView().setResolution(this.getBestFitResolution());
  // }

  ngOnDestroy() {
    this.saveCurrentPosition();
    this.view.removeLayer(this.imageLayer);
  }

  private rotate(angle: number) {
    const timestamp = new Date().getTime();
    const currentRotation = this.view.getView().getRotation();
    if (timestamp - this.lastRotateTime < 550) {
      return;
    }
    this.view.getView().animate({
      rotation: currentRotation + angle,
      duration: 500
    });
    this.lastRotateTime = timestamp;
  }

  enterFullscreen() {
    const el: any = document.getElementById(this.idViewer);
    // go full-screen
    if (el.requestFullscreen) {
      el.requestFullscreen();
    } else if (el['webkitRequestFullscreen']) {
      el['webkitRequestFullscreen']();
    } else if (el.mozRequestFullScreen) {
      el.mozRequestFullScreen();
    } else if (el.msRequestFullscreen) {
      el.msRequestFullscreen();
    }
  }

  exitFullscreen() {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document['webkitExitFullscreen' as keyof Document]) {
      document['webkitExitFullscreen' as keyof Document]();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }

  fullscreenEnabled() {
    return document['fullscreenElement']
      || document['webkitFullscreenElement' as keyof Document]
      || document.mozFullScreenElement
      || document.msFullscreenElement;
  }

  onFullscreenChanged() {
    this.fitToScreen();
    setTimeout(() => {
      this.fitToScreen();
    }, 200);
  }




  private initFullscreenCapabilities() {
    this.fullscreenAvailable = document.fullscreenEnabled
      || document['webkitFullscreenEnable' as keyof Document]
      || document['mozFullScreenEnabled' as keyof Document]
      || document['msFullscreenEnabled' as keyof Document];

    // document.addEventListener('fullscreenchange', this.onFullscreenChanged);
    const ctx = this;
    document.addEventListener('fullscreenchange', () => ctx.onFullscreenChanged());
    document.addEventListener('webkitfullscreenchange', () => ctx.onFullscreenChanged());
    document.addEventListener('mozfullscreenchange', () => ctx.onFullscreenChanged());
    document.addEventListener('MSFullscreenChange', () => ctx.onFullscreenChanged());
  }


}
