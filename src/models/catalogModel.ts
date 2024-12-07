export class TreeModel {
    name: string;
    children: Map<string, TreeModel>;

    constructor(name: string) {
        this.name = name;
        this.children = new Map();
    }
}
