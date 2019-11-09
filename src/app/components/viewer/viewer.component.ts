import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { ActivatedRoute } from '@angular/router';

declare var ol: any;

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

  state = 'none';

  ngOnInit() {
    this.state = 'loading';
    this.init();
    const url = 'http://localhost:8080/img.jpg';
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

  constructor() {
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

  private fitToScreen() {
    this.view.updateSize();
    this.view.getView().setRotation(0);
    this.bestFit();
    const extent = this.view.getView().getProjection().getExtent();
    const center = ol.extent.getCenter(extent);
    this.view.getView().setCenter(center);
  }

  onMouseMove() {

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
  }

}
