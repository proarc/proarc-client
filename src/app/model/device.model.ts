
export class Device {

    public id: string;
    public label: string;

    public static fromJson(json): Device {
        console.log(json);
        const device = new Device();
        device.id = json['id'];
        device.label = json['label'];
        return device;
    }

    public static fromJsonArray(jsonArray): Device[] {
        const array: Device[] = [];
        for (const json of jsonArray) {
            array.push(Device.fromJson(json));
        }
        return array;
    }

}
