import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
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


@Component({
  selector: 'app-viewer',
  templateUrl: './viewer.component.html',
  styleUrls: ['./viewer.component.scss']
})
export class ViewerComponent implements OnInit, OnDestroy {

  @Input() 
  set pid(pid: string) {
    this.onPidChanged(pid);
  }

  private view;
  private imageLayer;

  private imageWidth = 0;
  private imageHeight = 0;

  private maxResolution = 0;
  private minResolution = 0;

  private lastRotateTime = 0;

  fullscreenAvailable = false;
  positionLock: boolean;

  private extent;

  state = 'none';

  constructor(private api: ApiService, private properties: LocalStorageService) {
    this.initFullscreenCapabilities();
  }

  ngOnInit() {
    this.init();
  }

  onPidChanged(pid: string) {
    this.state = 'loading';
    const url = this.api.getStreamUrl(pid, 'FULL');
    const image = new Image();
    image.onload = (() => {
        this.onLoad(url, image.width, image.height);
    });
    image.onerror = (() => {
        image.onerror = null;
        console.log('image load failure');
    });
    image.src = url;
}

  onLoad(url: string, width: number, height: number) {
    this.positionLock = this.properties.getBoolProperty('viewer.positionLock', false);
    if (this.extent) {
      this.saveCurrentPosition();
    }
    this.state = 'success';
    this.view.removeLayer(this.imageLayer);
    this.view.updateSize();
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
    const iLayer = new ol.layer.Image({
      source: new ol.source.ImageStatic({
        url: url,
        imageSize: [width, height],
        imageExtent: this.extent
      })
    });
    this.view.addLayer(iLayer);
    this.imageLayer = iLayer;
    if (this.positionLock) {
      this.view.updateSize();
      this.view.getView().setRotation(this.properties.getStringProperty('viewer.roration'));
      this.view.getView().setCenter(this.properties.getStringProperty('viewer.center').split(','));
      this.view.getView().setResolution(this.properties.getStringProperty('viewer.resolution'));
    } else {
      this.fitToScreen();
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
      target: 'app-viewer',
      controls: [],
      interactions: interactions,
      loadTilesWhileAnimating: true,
      layers: []
    });
  }

  fitToScreen() {
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
    const el = document.getElementById('app-viewer');
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
    } else if (document['webkitExitFullscreen']) {
        document['webkitExitFullscreen']();
    } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

fullscreenEnabled() {
    return document['fullscreenElement']
    || document['webkitFullscreenElement']
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
  || document['webkitFullscreenEnable']
  || document['mozFullScreenEnabled']
  || document['msFullscreenEnabled'];

  // document.addEventListener('fullscreenchange', this.onFullscreenChanged);
  const ctx = this;
  document.addEventListener('fullscreenchange', () => ctx.onFullscreenChanged());
  document.addEventListener('webkitfullscreenchange', () => ctx.onFullscreenChanged());
  document.addEventListener('mozfullscreenchange', () => ctx.onFullscreenChanged());
  document.addEventListener('MSFullscreenChange', () => ctx.onFullscreenChanged());
}


}
