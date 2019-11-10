import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';

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

  private view;
  private imageLayer;

  private imageWidth = 0;
  private imageHeight = 0;

  private maxResolution = 0;
  private minResolution = 0;

  private zoomFactor = 1.5;

  public hideOnInactivity = false;
  private intervalSubscription: Subscription;
  public lastMouseMove = 0;

  private lastRotateTime = 0;

  fullscreenAvailable = false;



  state = 'none';


  constructor(private api: ApiService, private route: ActivatedRoute) {
    this.initFullscreenCapabilities();
  }

  ngOnInit() {
    this.state = 'loading';
    this.route.params.subscribe(params => {
      const id = params['id'];
      const url = this.api.getStreamUrl(id, 'FULL');
      this.init(url);
    });
  }


  onLoad(url: string, width: number, height: number) {
    this.state = 'success';
    this.view.removeLayer(this.imageLayer);
    this.imageWidth = width;
    this.imageHeight = height;
    const extent = [0, -this.imageHeight, this.imageWidth, 0];
    const projection = new ol.proj.Projection({
      units: 'pixels',
      extent: extent
    });
    this.maxResolution = this.getBestFitResolution() * this.zoomFactor;
    this.minResolution = 0.5;
    const viewOpts: any = {
      projection: projection,
      center: ol.extent.getCenter(extent),
      extent: extent
    };
    if (this.maxResolution < 100) {
      viewOpts.minResolution = this.minResolution;
      viewOpts.maxResolution = this.maxResolution;
    }
    const view = new ol.View(viewOpts);
    this.view.setView(view);
    const iLayer = new ol.layer.Image({
      source: new ol.source.ImageStatic({
        url: url,
        imageSize: [width, height],
        imageExtent: extent
      })
    });
    this.view.addLayer(iLayer);
    this.imageLayer = iLayer;
    this.fitToScreen();
  }

  init(url: string) {
    const interactions = ol.interaction.defaults({ keyboardPan: false, pinchRotate: false });
    this.view = new ol.Map({
      target: 'app-viewer',
      controls: [],
      interactions: interactions,
      loadTilesWhileAnimating: true,
      layers: []
    });


    const image = new Image();
    image.onload = (() => {
        this.onLoad(url, image.width, image.height);
    });
    image.onerror = (() => {
        image.onerror = null;
        console.log('image load failure');
    });
    image.src = url;

    this.intervalSubscription = interval(4000).subscribe( () => {
      const lastMouseDist = new Date().getTime() - this.lastMouseMove;
      if (lastMouseDist >= 4000) {
        this.hideOnInactivity = true;
      }
    });


  }

  fitToScreen() {
    this.view.updateSize();
    this.view.getView().setRotation(0);
    this.bestFit();
    const extent = this.view.getView().getProjection().getExtent();
    const center = ol.extent.getCenter(extent);
    this.view.getView().setCenter(center);
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


  onMouseMove() {
    this.lastMouseMove = new Date().getTime();
    this.hideOnInactivity = false;
  }

  getBestFitResolution() {
    const rx = this.imageWidth / (this.view.getSize()[0] - 10);
    const ry = this.imageHeight / (this.view.getSize()[1] - 10);
    return Math.max(rx, ry);
  }

  bestFit() {
    this.view.getView().setResolution(this.getBestFitResolution());
  }


  ngOnDestroy() {
    this.view.removeLayer(this.imageLayer);
    if (this.intervalSubscription) {
      this.intervalSubscription.unsubscribe();
    }
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
