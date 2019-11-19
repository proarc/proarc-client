import { ModsGeo } from './geo.model';
import { ModsLocation } from './location.model';
import { ModsPublisher } from './publisher.model';
import { ModsAuthor } from './author.model';
import { ModsRole } from './role.model';
import { ModsLanguage } from './language.model';
import { ModsElement } from './element.model';
import { ModsTitle } from './title.model';
import ModsUtils from './utils';
import { ModsIdentifier } from './identifier.model';
import { ModsNote } from './note.mode';

export class ElementField {

    private selector;
    public root;
    public items: ModsElement[];

    constructor(mods, selector, attr = null, values = []) {
        this.selector = selector;
        if (mods[selector] === undefined) {
            mods[selector] = [];
        }
        this.root = mods[selector];
        this.items = [];
        for (const el of this.root) {
            if (el) {
                if (attr) {
                    if (el['$'] && el['$'][attr] && values.indexOf(el['$'][attr]) > -1) {
                        this.items.push(this.newInstance(el));
                    }
                } else {
                    this.items.push(this.newInstance(el));
                }
            }
        }
        if (this.items.length < 1) {
            const item = this.add();
            item.collapsed = true;
        }
    }

    private newInstance(el) {
        switch (this.selector) {
            case ModsTitle.getSelector():
                return new ModsTitle(el);
            case ModsLanguage.getSelector():
                return new ModsLanguage(el);
            case ModsRole.getSelector():
                return new ModsRole(el);
            case ModsAuthor.getSelector():
                return new ModsAuthor(el);
            case ModsPublisher.getSelector():
                return new ModsPublisher(el);
            case ModsLocation.getSelector():
                return new ModsLocation(el);
            case ModsIdentifier.getSelector():
                return new ModsIdentifier(el);
            case ModsNote.getSelector():
                return new ModsNote(el);
            case ModsGeo.getSelector():
                return new ModsGeo(el);
            }
    }

    public remove(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.root.splice(index, 1);
        }
        if (this.items.length === 0) {
            const item = this.add();
            item.collapsed = true;
        }
    }

    // public removeAll() {
    //     while (this.items.length > 0) {
    //         this.remove(0);
    //     }
    // }

    public removeObject(obj) {
        const index = this.items.indexOf(obj);
        this.remove(index);
    }

    public add(): ModsElement {
        const item: ModsElement = this.newInstance({});
        this.items.push(item);
        this.root.push(item.getEl());
        return item;
    }

    public addAfter(index: number): ModsElement {
        const item: ModsElement = this.newInstance({});
        this.items.splice(index + 1, 0, item);
        this.root.splice(index + 1, 0, item.getEl());
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
