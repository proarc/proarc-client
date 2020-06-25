export class Coordinates {

    static latLngToDegrees(lat: number, lng: number): string {
        const dLat = (lat > 0 ? 'N' : 'S') + ' ' + Coordinates.toDegrees(lat);
        const dLng = (lng > 0 ? 'E' : 'W') + ' ' + Coordinates.toDegrees(lng);
        return `(${dLng}--${dLng}/${dLat}--${dLat})`
    } 

    private static toDegrees(coor: number): string {
        const d = Math.floor(coor);
        const minutes = (coor - d) * 60.0;
        const m = Math.floor(minutes);
        const s = Math.floor((minutes - m) * 60.0);
        return `${d}°${Coordinates.add0(m)}'${Coordinates.add0(s)}"`;
    }


    private static add0(number: number): string {
        return number < 10 ? `0${number}` : `${number}`;
    }

}