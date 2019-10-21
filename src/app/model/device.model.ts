
export class Device {

    public id: string;
    public name: string;

    public imageProducer: string;
    public captureDevice: string;

    public scannerManufacturer: string;
    public scannerModelName: string;
    public scannerModelNumber: string;
    public scannerModelSerialNo: string;
    public xOpticalResolution: number;
    public yOpticalResolution: number;
    public opticalResolutionUnit: string;
    public scannerSensor: string;
    public scanningSoftwareName: string;
    public scanningSoftwareVersionNo: string;

    public digitalCameraManufacturer: string;
    public digitalCameraModelName: string;
    public digitalCameraModelNumber: string;
    public digitalCameraModelSerialNo: string;
    public cameraSensor: string;

    public timestamp = -1;


    public static fromJsonArray(jsonArray): Device[] {
      const array: Device[] = [];
      for (const json of jsonArray) {
          array.push(Device.fromJson(json));
      }
      return array;
  }

  public static fromJson(json): Device {
      console.log(json);
      const device = new Device();
      device.id = json['id'];
      device.name = json['label'];
      device.timestamp = json['timestamp'];
      if (json['description'] && json['description']['ImageCaptureMetadata']) {
          const icm = json['description']['ImageCaptureMetadata'];
          if (icm['GeneralCaptureInformation']) {
              const imageProducer = icm['GeneralCaptureInformation']['imageProducer'];
              if (imageProducer && imageProducer[0]) {
                  device.imageProducer = imageProducer[0]['value'];
              }
              const captureDevice = icm['GeneralCaptureInformation']['captureDevice'];
              if (captureDevice) {
                  device.captureDevice = captureDevice['value'];
              }
          }
          if (icm['ScannerCapture']) {
              const sc = icm['ScannerCapture'];
              if (sc['scannerManufacturer']) {
                  device.scannerManufacturer = sc['scannerManufacturer']['value'];
              }
              const sm = sc['ScannerModel'];
              if (sm && sm['scannerModelName']) {
                  device.scannerModelName = sm['scannerModelName']['value'];
              }
              if (sm && sm['scannerModelNumber']) {
                  device.scannerModelNumber = sm['scannerModelNumber']['value'];
              }
              if (sm && sm['scannerModelSerialNo']) {
                  device.scannerModelSerialNo = sm['scannerModelSerialNo']['value'];
              }
              const mor = sc['MaximumOpticalResolution'];
              if (mor && mor['scannerModelName']) {
                  device.scannerModelName = mor['scannerModelName']['value'];
              }
              if (mor && mor['xOpticalResolution']) {
                  device.xOpticalResolution = mor['xOpticalResolution']['value'];
              }
              if (mor && mor['yOpticalResolution']) {
                  device.yOpticalResolution = mor['yOpticalResolution']['value'];
              }
              if (mor && mor['opticalResolutionUnit']) {
                  device.opticalResolutionUnit = mor['opticalResolutionUnit']['value'];
              }
              if (sc['scannerSensor']) {
                  device.scannerSensor = sc['scannerSensor']['value'];
              }
              const sss = sc['ScanningSystemSoftware'];
              if (sss && sss['scanningSoftwareName']) {
                  device.scanningSoftwareName = sss['scanningSoftwareName']['value'];
              }
              if (sss && sss['scanningSoftwareVersionNo']) {
                  device.scanningSoftwareVersionNo = sss['scanningSoftwareVersionNo']['value'];
              }
          }
          if (icm['DigitalCameraCapture']) {
              const dcc = icm['DigitalCameraCapture'];
              if (dcc['digitalCameraManufacturer']) {
                  device.digitalCameraManufacturer = dcc['digitalCameraManufacturer']['value'];
              }
              const dcm = dcc['DigitalCameraModel'];
              if (dcm && dcm['digitalCameraModelName']) {
                  device.digitalCameraModelName = dcm['digitalCameraModelName']['value'];
              }
              if (dcm && dcm['digitalCameraModelNumber']) {
                  device.digitalCameraModelNumber = dcm['digitalCameraModelNumber']['value'];
              }
              if (dcm && dcm['digitalCameraModelSerialNo']) {
                  device.digitalCameraModelSerialNo = dcm['digitalCameraModelSerialNo']['value'];
              }
              if (dcc['cameraSensor']) {
                  device.cameraSensor = dcc['cameraSensor']['value'];
              }
          }
      }
      return device;
  }

    public description(): string {
        return JSON.stringify({
            'ImageCaptureMetadata': {
              'GeneralCaptureInformation': {
                'imageProducer': [
                  {
                    'value': this.imageProducer
                  }
                ],
                'captureDevice': {
                  'value': this.captureDevice
                }
              },
              'ScannerCapture': {
                'scannerManufacturer': {
                  'value': this.scannerManufacturer
                },
                'ScannerModel': {
                  'scannerModelName': {
                    'value': this.scannerModelName
                  },
                  'scannerModelNumber': {
                    'value': this.scannerModelNumber
                  },
                  'scannerModelSerialNo': {
                    'value': this.scannerModelSerialNo
                  }
                },
                'MaximumOpticalResolution': {
                  'xOpticalResolution': {
                    'value': this.xOpticalResolution
                  },
                  'yOpticalResolution': {
                    'value': this.yOpticalResolution
                  },
                  'opticalResolutionUnit': {
                    'value': this.opticalResolutionUnit
                  }
                },
                'scannerSensor': {
                  'value': this.scannerSensor
                },
                'ScanningSystemSoftware': {
                  'scanningSoftwareName': {
                    'value': this.scanningSoftwareName
                  },
                  'scanningSoftwareVersionNo': {
                    'value': this.scanningSoftwareVersionNo
                  }
                }
              },
              'DigitalCameraCapture': {
                'digitalCameraManufacturer': {
                  'value': this.digitalCameraManufacturer
                },
                'DigitalCameraModel': {
                  'digitalCameraModelName': {
                    'value': this.digitalCameraModelName
                  },
                  'digitalCameraModelNumber': {
                    'value': this.digitalCameraModelNumber
                  },
                  'digitalCameraModelSerialNo': {
                    'value': this.digitalCameraModelSerialNo
                  }
                },
                'cameraSensor': {
                  'value': this.cameraSensor
                }
              }
            }
        });
    }


}
