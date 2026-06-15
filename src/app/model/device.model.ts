import {AudioDevice} from './audioDevice.model';

export class Device {

  public id: string;
  public label: string;

  public model: string;

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
  public audiotimestamp = -1;

  public audioDevices: AudioDevice[];


  public static fromJsonArray(jsonArray: any[]): Device[] {
    const array: Device[] = [];
    for (const json of jsonArray) {
      array.push(Device.fromJson(json));
    }
    return array;
  }

  constructor(model: string) {
    this.model = model;
    this.audioDevices = [];
  }

  public static fromJson(json: any): Device {
    let model = json['model'];
    if (model === 'Audio linka') {
      model = 'proarc:audiodevice';
    }
    if (model === 'Skener') {
      model = 'proarc:device';
    }
    const device = new Device(model);
    device.id = json['id'];
    device.label = json['label'];
    device.timestamp = json['timestamp'];
    device.audiotimestamp = json['audiotimestamp'];
    const description = typeof json['description'] === 'string'
      ? Device.descriptionFromXml(json['description'])
      : json['description'];
    if (description && description['ImageCaptureMetadata']) {
      const icm = description['ImageCaptureMetadata'];
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
    if (device.isAudio() && json['audiodescription'] && json['audiodescription']['amdSec']) {
      device.audioDevices = AudioDevice.fromJsonArray(json['audiodescription']['amdSec']);
    }
    return device;
  }

  public isAudio(): boolean {
    return this.model === 'proarc:audiodevice';
  }

  public audioDescription(): string {
    let desc = {};
    if (this.isAudio() && this.audioDevices.length > 0) {
      const audios = [];
      for (const audioDevice of this.audioDevices) {
        audios.push(audioDevice.description());
      }
      desc = {
        'amdSec': audios
      };
    }
    return JSON.stringify(desc);
  }

  public description(): string {
    return JSON.stringify({
      'imageCaptureMetadata': {
        'generalCaptureInformation': {
          'imageProducer': [
            {
              'value': this.imageProducer
            }
          ],
          'captureDevice': {
            'value': Device.enumValue(this.captureDevice)
          }
        },
        'scannerCapture': {
          'scannerManufacturer': {
            'value': this.scannerManufacturer
          },
          'scannerModel': {
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
          'maximumOpticalResolution': {
            'xopticalResolution': {
              'value': this.xOpticalResolution
            },
            'yopticalResolution': {
              'value': this.yOpticalResolution
            },
            'opticalResolutionUnit': {
              'value': Device.enumValue(this.opticalResolutionUnit)
            }
          },
          'scannerSensor': {
            'value': Device.enumValue(this.scannerSensor)
          },
          'scanningSystemSoftware': {
            'scanningSoftwareName': {
              'value': this.scanningSoftwareName
            },
            'scanningSoftwareVersionNo': {
              'value': this.scanningSoftwareVersionNo
            }
          }
        },
        'digitalCameraCapture': {
          'digitalCameraManufacturer': {
            'value': this.digitalCameraManufacturer
          },
          'digitalCameraModel': {
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
            'value': Device.enumValue(this.cameraSensor)
          }
        }
      }
    });
  }

  private static enumValue(value: string): string {
    if (!value) {
      return value;
    }
    return value
      .replace(/\./g, '')
      .replace(/([a-z])([A-Z])/g, '$1_$2')
      .replace(/[\s-]+/g, '_')
      .toUpperCase();
  }

  private static descriptionFromXml(xml: string): any {
    if (!xml || xml.indexOf('<') === -1) {
      return null;
    }
    const doc = new DOMParser().parseFromString(xml, 'application/xml');
    if (doc.getElementsByTagName('parsererror').length > 0) {
      return null;
    }
    const value = (name: string) => {
      const nsNodes = doc.getElementsByTagNameNS('*', name);
      const node = nsNodes[0] || doc.getElementsByTagName(`mix:${name}`)[0] || doc.getElementsByTagName(name)[0];
      const text = node && node.textContent ? node.textContent.trim() : '';
      return text || undefined;
    };
    const numberValue = (name: string) => {
      const text = value(name);
      return text ? Number(text) : undefined;
    };
    return {
      'ImageCaptureMetadata': {
        'GeneralCaptureInformation': {
          'imageProducer': [
            {
              'value': value('imageProducer')
            }
          ],
          'captureDevice': {
            'value': value('captureDevice')
          }
        },
        'ScannerCapture': {
          'scannerManufacturer': {
            'value': value('scannerManufacturer')
          },
          'ScannerModel': {
            'scannerModelName': {
              'value': value('scannerModelName')
            },
            'scannerModelNumber': {
              'value': value('scannerModelNumber')
            },
            'scannerModelSerialNo': {
              'value': value('scannerModelSerialNo')
            }
          },
          'MaximumOpticalResolution': {
            'xOpticalResolution': {
              'value': numberValue('xOpticalResolution')
            },
            'yOpticalResolution': {
              'value': numberValue('yOpticalResolution')
            },
            'opticalResolutionUnit': {
              'value': value('opticalResolutionUnit')
            }
          },
          'scannerSensor': {
            'value': value('scannerSensor')
          },
          'ScanningSystemSoftware': {
            'scanningSoftwareName': {
              'value': value('scanningSoftwareName')
            },
            'scanningSoftwareVersionNo': {
              'value': value('scanningSoftwareVersionNo')
            }
          }
        },
        'DigitalCameraCapture': {
          'digitalCameraManufacturer': {
            'value': value('digitalCameraManufacturer')
          },
          'DigitalCameraModel': {
            'digitalCameraModelName': {
              'value': value('digitalCameraModelName')
            },
            'digitalCameraModelNumber': {
              'value': value('digitalCameraModelNumber')
            },
            'digitalCameraModelSerialNo': {
              'value': value('digitalCameraModelSerialNo')
            }
          },
          'cameraSensor': {
            'value': value('cameraSensor')
          }
        }
      }
    };
  }


}
