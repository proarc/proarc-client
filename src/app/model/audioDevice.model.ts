
export class AudioDevice {

    public identifierType: string;
    public identifierValue: string;
    public identifierRole: string;

    public name: string;
    public type: string;

    public manufacturer: string;
    public serialNumber: string;
    public settings: string;


    public static fromJsonArray(jsonArray): AudioDevice[] {
      const array: AudioDevice[] = [];
      for (const json of jsonArray) {
          array.push(AudioDevice.fromJson(json));
      }
      return array;
  }

  public static fromJson(json): AudioDevice {
      console.log(json);
      const device = new AudioDevice();
      const data = json['digiprovMD'][0]['mdWrap']['xmlData']['any'][0]['value'];
      if (!data) {
        return device;
      }
      const identifier = data['event'][0]['linkingAgentIdentifier'][0];
      device.identifierType = identifier['linkingAgentIdentifierType'];  
      device.identifierValue = identifier['linkingAgentIdentifierValue'];  
      if (identifier['linkingAgentRole'] && identifier['linkingAgentRole'][0]) {
        device.identifierRole = identifier['linkingAgentRole'][0];  
      }
      const agent = data['agent'][0];
      if (agent) {
        if (agent['agentName'] && agent['agentName'][0]) {
          device.name = agent['agentName'][0];
        }
        device.type = agent['agentType'];
        const agentExtension = agent['agentExtension'][0]['any'][0];
        device.manufacturer = agentExtension['manufacturer'];
        device.serialNumber = agentExtension['serialNumber'];
        device.settings = agentExtension['settings'];
      }
      return device;
    }



    public description(): any {
      return {
        'digiprovMD': 
          {
            'mdWrap': {
              'xmlData': {
                'any': 
                  {
                    'value': {
                      'event': [
                        {
                          'linkingAgentIdentifier': [
                            {
                              'linkingAgentIdentifierType': this.identifierType,
                              'linkingAgentIdentifierValue': this.identifierValue,
                              'linkingAgentRole': this.identifierRole
                            }
                          ]
                        }
                      ],
                      'agent': [
                        {
                          'agentName': this.name,
                          'agentType': this.type,
                          'agentExtension': [
                            {
                              'any': [
                                {
                                  'manufacturer': this.manufacturer,
                                  'serialNumber': this.serialNumber,
                                  'settings': this.settings
                                }
                              ]
                            }
                          ]
                        }
                      ]
                    }
                  }
              }
            }
          }
      };
  }


    private a(value: string): string[] {
      if(value) {
        return [value];
      } else {
        return null;
      }
    }


}



