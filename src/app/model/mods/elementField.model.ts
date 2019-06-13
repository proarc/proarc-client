import { ModsElement } from './element.model';
import { ModsTitle } from './title.model';
import ModsUtils from './utils';

export class ElementField {

    private selector;
    public root;
    public items: ModsElement[];

    constructor(mods, selector) {
        this.selector = selector;
        if (mods[selector] === undefined) {
            mods[selector] = [];
        }
        this.root = mods[selector];
        this.items = [];
        for (const el of this.root) {
            if (el) {
                this.items.push(this.newInstance(el));
            }
        }
        if (this.items.length < 1) {
            this.add();
        }
    }

    private newInstance(el) {
        switch (this.selector) {
            case ModsTitle.getSelector():
                return new ModsTitle(el);
        }
    }

    public remove(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.root.splice(index, 1);
        }
    }

    public removeAll() {
        while (this.items.length > 0) {
            this.remove(0);
        }
    }

    public removeObject(obj) {
        const index = this.items.indexOf(obj);
        if (index > -1) {
           this.items.splice(index, 1);
           this.root.splice(index, 1);
        }
    }

    public add(): ModsElement {
        const item: ModsElement = this.newInstance({});
        this.items.push(item);
        this.root.push(item.getEl());
        return item;
    }

    public moveDown(index: number) {
        ModsUtils.moveDown(this.root, index);
        ModsUtils.moveDown(this.items, index);
    }

      public moveUp(index: number) {
        ModsUtils.moveUp(this.root, index);
        ModsUtils.moveUp(this.items, index);
      }

    public toDC() {
        let dc = '';
        for (const item of this.items) {
            dc += item.toDC();
        }
        return dc;
    }

    public update() {
        for (const item of this.items) {
            item.update();
        }
    }

    public firstToDC() {
        let dc = '';
        if (this.items.length > 0) {
            dc = this.items[0].toDC();
        }
        return dc;
    }

    public count(): number {
        return this.items.length;
    }
}
