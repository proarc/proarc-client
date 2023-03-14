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
import { ModsFrequency } from './frequency.model';
import { ModsCartographics } from './cartographics.model';
import { ModsForm } from './form.model';
import { ModsPart } from './part.model';
import {ModsRecordInfo} from './recordInfo.model';
import {ModsRecordChangeDate} from './recordChangeDate.model';
import {ModsRecordContentSource} from './recordContentSource.model';
import {ModsRecordCreationDate} from './recordCreationDate.model';
import {ModsRecordIdentifier} from './recordIdentifier.model';
import {ModsExtent} from './extent.model';
import {ModsTableOfContents} from './tableOfContents';
import {ModsRelatedItem} from './relatedItem.model';
import { TranslateService } from '@ngx-translate/core';
import {ModsDateIssued} from './dateIssued.model';
import {ModsUrl} from './url.model';
import {ModsShelfLocator} from './shelfLocator.model';
import {ModsNamePart} from './namePart.model';

export class ElementField {

    private id;
    public root;
    private items: ModsElement[];
    private template;
    private allExpanded: boolean;

    constructor(mods: { [x: string]: any; }, id: string, template: any, attr: any = null, requiredValues: any[] = [], forbiddenValues: any[] = []) {
        this.template = template;
        if (localStorage.getItem('metadata.allExpanded')) {
            this.allExpanded = localStorage.getItem('metadata.allExpanded') === 'true';
        }
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
            if (!this.allExpanded && !this.hasExpandedChildren() && !this.template.expanded) {
                item.collapsed = true;
            }
        }
    }

    hasExpandedChildren(): boolean {
        for (const item of this.items) {
            if (item.getTemplate().expanded) {
                return true;
            }
        }
        return false;
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

    public update() {
        for (const item of this.items) {
            item.update();
        }
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

    private remove(index: number) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.root.splice(index, 1);
        }
        if (this.visibleItemsCount() === 0) {
            const item = this.add();
            item.collapsed = true;
        }
    }

    private move(array: any[], from: number, to: number) {
        if (to >= 0 && to < array.length) {
            const x: any = array[from];
            array[from] = array[to];
            array[to] = x;
        }
    }


    private newElement(id: any, el: {}): ModsElement | undefined {
        switch (id) {
            case ModsTitle.getId():
                return new ModsTitle(el, this.template);
            case ModsLanguage.getId():
                return new ModsLanguage(el, this.template);
            case ModsRole.getId():
                return new ModsRole(el, this.template);
            case ModsAuthor.getId():
                return new ModsAuthor(el, this.template);

            case ModsPart.getId():
                return new ModsPart(el, this.template);
            case ModsPublisher.getId():
                return new ModsPublisher(el, this.template);
            case ModsLocation.getId():
                return new ModsLocation(el, this.template);
            case ModsChronicleLocation.getId():
                return new ModsChronicleLocation(el, this.template);
            case ModsIdentifier.getId():
                return new ModsIdentifier(el, this.template);
            case ModsNote.getId():
                return new ModsNote(el, this.template);
            case ModsAbstract.getId():
                return new ModsAbstract(el, this.template);
            case ModsGenre.getId():
                return new ModsGenre(el, this.template);
            case ModsGenreChronical.getId():
                return new ModsGenreChronical(el, this.template);
            case ModsGeo.getId():
                return new ModsGeo(el, this.template);
            case ModsPhysical.getId():
                return new ModsPhysical(el, this.template);
            case ModsRecordInfo.getId():
                return new ModsRecordInfo(el, this.template);
            case ModsRelatedItem.getId():
                return new ModsRelatedItem(el, this.template);
            case ModsTableOfContents.getId():
                return new ModsTableOfContents(el, this.template);
            case ModsSubject.getId():
                return new ModsSubject(el, this.template);
            case ModsClassification.getId():
                return new ModsClassification(el, this.template);
            case ModsResource.getId():
                return new ModsResource(el, this.template);
            case ModsFrequency.getId():
                return new ModsFrequency(el, this.template);
            case ModsNamePart.getId():
                return new ModsNamePart(el, this.template);
            case ModsDateIssued.getId():
                return new ModsDateIssued(el, this.template);
            case ModsUrl.getId():
                return new ModsUrl(el, this.template);
            case ModsShelfLocator.getId():
                return new ModsShelfLocator(el, this.template);
            case ModsCartographics.getId():
                return new ModsCartographics(el, this.template);
            case ModsForm.getId():
                return new ModsForm(el, this.template);
            case ModsRecordChangeDate.getId():
                return new ModsRecordChangeDate(el, this.template);
            case ModsRecordContentSource.getId():
                return new ModsRecordContentSource(el, this.template);
            case ModsRecordCreationDate.getId():
                return new ModsRecordCreationDate(el, this.template);
            case ModsRecordIdentifier.getId():
                return new ModsRecordIdentifier(el, this.template);
            case ModsExtent.getId():
                return new ModsExtent(el, this.template);
        }
        return undefined;
    }


    public help(translator: TranslateService) {
        const label = translator.instant('mods.' + this.template.labelKey);
        let help = `
            <h2>${label} <i>${this.template.usage || ''}</i> <code>${this.template.selector || ''}</code></h2>
            ${this.template.description || ''}<br/>
        `;
        for (const field of Object.keys(this.template.fields)) {
            const f = this.template.fields[field];
            if (f.help != 'off') {
                help += `
                    <h3>${translator.instant('mods.' + f.labelKey)} <i>${f.usage || ''}</i> <code>${f.selector || ''}</code></h3>
                    ${f.description || ''}`;
            }

        }
        return help;
    }


    public usage() {
        return this.template.usage;
    }

    public label() {
        return this.template.label;
    }

    public labelKey() {
        return this.template.labelKey;
    }

    public selector() {
        return this.template.selector;
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
            case ModsPart.getId():
                return ModsPart.getSelector();
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
            case ModsRecordInfo.getId():
                return ModsRecordInfo.getSelector();
            case ModsRelatedItem.getId():
                return ModsRelatedItem.getSelector();
            case ModsSubject.getId():
                return ModsSubject.getSelector();
            case ModsClassification.getId():
                return ModsClassification.getSelector();
            case ModsResource.getId():
                return ModsResource.getSelector();
            case ModsFrequency.getId():
                return ModsFrequency.getSelector();
            case ModsNamePart.getId():
                return ModsNamePart.getSelector();
            case ModsDateIssued.getId():
                return ModsDateIssued.getSelector();
            case ModsCartographics.getId():
                return ModsCartographics.getSelector();
            case ModsUrl.getId():
                return ModsUrl.getSelector();
            case ModsShelfLocator.getId():
                return ModsShelfLocator.getSelector();
            case ModsForm.getId():
                return ModsForm.getSelector();
            case ModsRecordChangeDate.getId():
                return ModsRecordChangeDate.getSelector();
            case ModsRecordContentSource.getId():
                return ModsRecordContentSource.getSelector();
            case ModsRecordCreationDate.getId():
                return ModsRecordCreationDate.getSelector();
            case ModsRecordIdentifier.getId():
                return ModsRecordIdentifier.getSelector();
            case ModsExtent.getId():
                return ModsExtent.getSelector();
            case ModsTableOfContents.getId():
                return ModsTableOfContents.getSelector();
        }
        return '';
    }

}
