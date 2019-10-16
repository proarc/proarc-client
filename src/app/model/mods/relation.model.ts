
export class Relation {


    public pid: string;
    public title: string;
    public model: string;

  

    public static fromJson(json): Relation {
        console.log(json);
        const relation = new Relation();
        relation.pid = json['pid'];
        relation.model = json['model'];
        if (json['details']) {
            if (relation.model === 'page') {
                relation.title = json['details']['pagenumber'].trim();
            } 
        }
        return relation;
    }

    public static fromJsonArray(jsonArray): Relation[] {
        const array: Relation[] = [];
        for (const json of jsonArray) {
            array.push(Relation.fromJson(json));
        }
        return array;
    }

}
