export class Uuid {

    private static regexp = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$');


    static validate(uuid: string): boolean {
        if (!uuid) {
            return false;
        }
        return Uuid.regexp.test(uuid);
    } 

}