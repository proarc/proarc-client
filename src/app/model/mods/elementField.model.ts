import { ModsElement } from './element.model';
import { ModsTitle } from './title.model';
import { ModsLanguage } from './language.model';
import { ModsRole } from './role.model';
import { ModsAuthor } from './author.model';
import { ModsPublisher } from './publisher.model';
import { ModsLocation } from './location.model';
import { ModsChronicleLocation } from './chronicle_location.model';
import { ModsIdentifier } from './identifier.model';
import { ModsNote } from './note.mode';
import { ModsAbstract } from './abstract.model';
import { ModsGenreChronical } from './genre_chronical.model';
import { ModsGeo } from './geo.model';
import { ModsPhysical } from './physical.model';
import { ModsSubject } from './subject.model';
import { ModsGenre } from './genre.model';
import { ModsClassification } from './classification.model';
import { ModsResource } from './resource.model';

export class ElementField {

    private id;
    public root;
    private items: ModsElement[];

    constructor(mods, id, attr = null, requiredValues = [], forbiddenValues = []) {
        this.id = id;
        const selector = this.selectorById(id)
        if (mods[selector] === undefined) {
            mods[selector] = [];
        }
        this.root = mods[selector];
        this.items = [];
        let hiddenItems = 0;
        for (const el of this.root) {
            if (el) {
                const newEl = this.newElement(id, el);
                if (attr) {
                    if (requiredValues.length > 0 && !(el['$'] && el['$'][attr] && requiredValues.indexOf(el['$'][attr]) > -1)) {
                        newEl.hidden = true;
                        hiddenItems += 1;
                    } else if (forbiddenValues.length > 0 && el['$'] && el['$'][attr] && forbiddenValues.indexOf(el['$'][attr]) > -1) {
                        newEl.hidden = true;
                        hiddenItems += 1;
                    }
                } 
                this.items.push(newEl);
            }
        }
        if (this.items.length - hiddenItems < 1) {
            const item = this.add();
            if (this.id != 'role') {
                item.collapsed = true;
            }
        }
    }

    public getItems(): ModsElement[] {
        const result = [];
        for (const item of this.items) {
            if (!item.hidden) {
                result.push(item);
            }
        }
        return result;
    }

    public removeItem(item: ModsElement) {
        const index = this.items.indexOf(item);
        this.remove(index);
    }

    public addAfterItem(item: ModsElement, el: ModsElement = null): ModsElement {
        const index = this.items.indexOf(item);
        return this.addAfter(index, el);
    }

    public add(el: ModsElement = null): ModsElement {
        const item: ModsElement = el || this.newElement(this.id, {});
        this.items.push(item);
        this.root.push(item.getEl());
        return item;
    }

    public moveDown(item: ModsElement) {
        const index = this.items.indexOf(item);
        let newIndex = index + 1;
        while (this.items.length > newIndex - 1 && this.items[newIndex].hidden) {
            newIndex += 1;
        }
        this.move(this.root, index, newIndex);
        this.move(this.items, index, newIndex);
    }

    public moveUp(item: ModsElement) {
        const index = this.items.indexOf(item);
        let newIndex = index - 1;
        while (newIndex > 0 && this.items[newIndex].hidden) {
            newIndex -= 1;
        }
        this.move(this.root, index, newIndex);
        this.move(this.items, index, newIndex);
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







    private addAfter(index: number, el: ModsElement = null): ModsElement {
        const item: ModsElement = el || this.newElement(this.id, {});
        this.items.splice(index + 1, 0, item);
        this.root.splice(index + 1, 0, item.getEl());
        return item;
    }

    private visibleItemsCount(): number {
        let c = 0;
        for (const item of this.items) {
            if (!item.hidden) {
                c += 1;
            }
        }
        return c;
    }

    private remove(index) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.root.splice(index, 1);
        }
        if (this.visibleItemsCount() === 0) {
            const item = this.add();
            item.collapsed = true;
        }
    }

    private move(array, from: number, to: number) {
        if (to >= 0 && to < array.length) {
            const x = array[from];
            array[from] = array[to];
            array[to] = x;
        }
    }


    private newElement(id, el): ModsElement {
        switch (id) {
            case ModsTitle.getId():
                return new ModsTitle(el);
            case ModsLanguage.getId():
                return new ModsLanguage(el);
            case ModsRole.getId():
                return new ModsRole(el);
            case ModsAuthor.getId():
                return new ModsAuthor(el);
            case ModsPublisher.getId():
                return new ModsPublisher(el);
            case ModsLocation.getId():
                return new ModsLocation(el);
            case ModsChronicleLocation.getId():
                return new ModsChronicleLocation(el);
            case ModsIdentifier.getId():
                return new ModsIdentifier(el);
            case ModsNote.getId():
                return new ModsNote(el);
            case ModsAbstract.getId():
                return new ModsAbstract(el);
            case ModsGenre.getId():
                return new ModsGenre(el);
            case ModsGenreChronical.getId():
                return new ModsGenreChronical(el);
            case ModsGeo.getId():
                return new ModsGeo(el);
            case ModsPhysical.getId():
                return new ModsPhysical(el);
            case ModsSubject.getId():
                return new ModsSubject(el);
            case ModsClassification.getId():
                return new ModsClassification(el);
            case ModsResource.getId():
                return new ModsResource(el);
            }
    }


    private selectorById(id: string): string {
        switch (id) {
            case ModsTitle.getId():
                return ModsTitle.getSelector();
            case ModsLanguage.getId():
                return ModsLanguage.getSelector();
            case ModsRole.getId():
                return ModsRole.getSelector();
            case ModsAuthor.getId():
                return ModsAuthor.getSelector();
            case ModsPublisher.getId():
                return ModsPublisher.getSelector();
            case ModsLocation.getId():
                return ModsLocation.getSelector();
            case ModsChronicleLocation.getId():
                return ModsChronicleLocation.getSelector();
            case ModsIdentifier.getId():
                return ModsIdentifier.getSelector();
            case ModsNote.getId():
                return ModsNote.getSelector();
            case ModsAbstract.getId():
                return ModsAbstract.getSelector();
            case ModsGenre.getId():
                return ModsGenre.getSelector();
            case ModsGenreChronical.getId():
                return ModsGenreChronical.getSelector();
            case ModsGeo.getId():
                return ModsGeo.getSelector();
            case ModsPhysical.getId():
                return ModsPhysical.getSelector();
            case ModsSubject.getId():
                return ModsSubject.getSelector();
            case ModsClassification.getId():
                return ModsClassification.getSelector();
            case ModsResource.getId():
                return ModsResource.getSelector();
            }
    }








}
