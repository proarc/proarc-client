export class Uuid {

    // Client
    // private static regexp = new RegExp('[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$');

    // Jadro
    private static regexp = new RegExp('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$');


    static validate(uuid: string): boolean {
        if (!uuid) {
            return false;
        }
        return Uuid.regexp.test(uuid);
    } 

}