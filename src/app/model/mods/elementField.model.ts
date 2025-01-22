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
import {ModsGeographicCode} from './ModsGeographicCode.model';
import {ModsTopic} from './topic.model';
import {ModsPlaceTerm} from './placeTerm.model';
import {ModsPlace} from './place.model';
import {ModsDateOther} from './dateOther.model';
import {ModsDateCreated} from './dateCreated.model';
import {ModsInternetMediaType} from './internetMediaType.model';
import {ModsPhysicalLocation} from './physicalLocation.model';
import {ModsDescription} from './description.model';
import {ModsDisplayForm} from './displayForm.model';
import {ModsDateValid} from './dateValid.model';
import {ModsDateCaptured} from './dateCaptured.model';
import {ModsDateModified} from './dateModified.model';
import {ModsPhysicalExtent} from './extentPhysical.model';
import {ModsEdition} from './edition.model';
import {ModsRelatedItem2} from './relatedItem2.model';
import {ModsDetail} from './detail.model';
import {ModsLanguageOfCataloging} from './languageOfCataloging.model';
import {ModsTemporal} from './temporal.model';
import {ModsGeographic} from './geographic.model';
import {ModsAccessCondition} from './accessCondition.model';

export class ElementField {

    public id;
    public root;
    public items: ModsElement[];
    private template;
    private allExpanded: boolean;
    isPeerReviewed: boolean;

    public labelKey: string;
    public usage: string;

    constructor(mods: { [x: string]: any; }, id: string, template: any, attr: any = null, requiredValues: any[] = [], forbiddenValues: any[] = []) {
        this.template = template;

        this.labelKey = this.template.labelKey;
        this.usage = this.template.usage;
        if (localStorage.getItem('metadata.allExpanded')) {
            this.allExpanded = localStorage.getItem('metadata.allExpanded') === 'true';
        }


        if (id.startsWith('relatedItem')) {
            this.allExpanded = this.allExpanded || localStorage.getItem('relatedItemExpanded') === 'true';
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
            if (!this.allExpanded && !this.hasExpandedChildren() && !this.template.expanded && !item.isRequired2()) {
                item.collapsed = true;
            }
        }

        // set isPeerReviewed for electronic articles
        // this.isPeerReviewed = false;
        if(this.items[0] instanceof ModsGenre && template['selector'] === 'genre' &&  template['isElectronicArticle']) {
            if (this.items[0].attrs['type'] === 'peer-reviewed') {
                this.isPeerReviewed = true;
            } else  if (this.items[0].modsElement['_'] === 'article' && !this.items[0].attrs['type']) {
                this.isPeerReviewed = false;
            } else  if (this.items[0].modsElement['_'] === 'electronic_article' && !this.items[0].attrs['type']) {
                this.isPeerReviewed = false;
            } else {
                this.isPeerReviewed = false;
                const peerRaw = JSON.parse(JSON.stringify(this.root[0]));
                delete peerRaw['$']['type'];
                if (peerRaw['_'] !== 'article' && peerRaw['_'] !== 'electronic_article') {
                    // peerRaw['_'] = 'article';
                }
                const peerEl = this.newElement(id, peerRaw);
                this.items.unshift(peerEl);
                this.root.unshift(peerRaw);
            }


            // if (this.items.length === 1) {
            //     const item = this.add();
            //     item.hidden = true;
            //     if (!this.allExpanded && !this.hasExpandedChildren() && !this.template.expanded && !item.isRequired2()) {
            //         item.collapsed = true;
            //     }
            // }

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

    cantAdd(): boolean {
        return this.items.length >= (this.template.max ? this.template.max : 10000000);
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

    public duplicateItemAfter(oldItem: ModsElement, el: ModsElement = null): ModsElement {
        const index = this.items.indexOf(oldItem);
        const item: ModsElement = el || this.newElement(this.id, {});
        if (!el && this.template['defaultValue']) {
          item.modsElement['_'] = this.template['defaultValue'];
        }
        this.items.splice(index + 1, 0, item);
        this.root.splice(index + 1, 0, item.getEl());
        setTimeout(() => {item.setAsDirty();}, 100);
        return item;
    }

    public add(el: ModsElement = null): ModsElement {
        const item: ModsElement = el || this.newElement(this.id, {});
        if (!el && this.template['defaultValue']) {
            item.modsElement['_'] = this.template['defaultValue'];
        }
        this.items.push(item);
        this.root.push(item.getEl());
        return item;
    }

    public addAsFirst(el: ModsElement = null): ModsElement {
        const item: ModsElement = el || this.newElement(this.id, {});
        if (!el && this.template['defaultValue']) {
            item.modsElement['_'] = this.template['defaultValue'];
        }
        this.items.unshift(item);
        this.root.unshift(item.getEl());
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
        if (!el && this.template['defaultValue']) {
          item.modsElement['_'] = this.template['defaultValue'];
        }
        this.items.splice(index + 1, 0, item);
        this.root.splice(index + 1, 0, item.getEl());
        setTimeout(() => {item.setAsDirty();}, 100);
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

    public remove(index: number) {
        if (index >= 0 && index < this.items.length) {
            this.items.splice(index, 1);
            this.root.splice(index, 1);

        }
        if (this.visibleItemsCount() === 0) {
            const item = this.add();
            item.collapsed = true;
            setTimeout(() => {item.setAsDirty();}, 100);
        } else {
            setTimeout(() => {this.items[0].setAsDirty();}, 100);
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
            case ModsAccessCondition.getId() :
                return new ModsAccessCondition(el, this.template);
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
            case ModsRelatedItem2.getId():
                return new ModsRelatedItem2(el, this.template);
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
            case ModsGeographicCode.getId():
                return new ModsGeographicCode(el, this.template);
            case ModsDateIssued.getId():
                return new ModsDateIssued(el, this.template);
            case ModsDateCreated.getId():
                return new ModsDateCreated(el, this.template);
            case ModsDateValid.getId():
                return new ModsDateValid(el, this.template);
            case ModsDateCaptured.getId():
                return new ModsDateCaptured(el, this.template);
            case ModsDateModified.getId():
                return new ModsDateModified(el, this.template);
            case ModsDateOther.getId():
                return new ModsDateOther(el, this.template);
            case ModsPlace.getId():
                return new ModsPlace(el, this.template);
            case ModsPlaceTerm.getId():
                return new ModsPlaceTerm(el, this.template);
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
            case ModsLanguageOfCataloging.getId():
                return new ModsLanguageOfCataloging(el, this.template);
            case ModsExtent.getId():
                return new ModsExtent(el, this.template);
            case ModsDetail.getId():
                return new ModsDetail(el, this.template);
            case ModsPhysicalLocation.getId():
                return new ModsPhysicalLocation(el, this.template);
            case ModsDescription.getId():
                return new ModsDescription(el, this.template);
            case ModsDisplayForm.getId():
                return new ModsDisplayForm(el, this.template);
            case ModsInternetMediaType.getId():
                return new ModsInternetMediaType(el, this.template);
            case ModsTopic.getId():
                return new ModsTopic(el, this.template);
            case ModsTemporal.getId():
                return new ModsTemporal(el, this.template);
            case ModsGeographic.getId():
                return new ModsGeographic(el, this.template);
            case ModsPhysicalExtent.getId():
                return new ModsPhysicalExtent(el, this.template);
            case ModsEdition.getId():
                return new ModsEdition(el, this.template);
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

    public label() {
        return this.template.label;
    }

    public selector() {
        return this.template.selector;
    }

    private selectorById(id: string): string {
        switch (id) {
            case ModsAccessCondition.getId():
                return ModsAccessCondition.getSelector();
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
            case ModsRelatedItem2.getId():
                return ModsRelatedItem2.getSelector();
            case ModsSubject.getId():
                return ModsSubject.getSelector();
            case ModsClassification.getId():
                return ModsClassification.getSelector();
            case ModsResource.getId():
                return ModsResource.getSelector();
            case ModsFrequency.getId():
                return ModsFrequency.getSelector();
            case ModsPlace.getId():
                return ModsPlace.getSelector();
            case ModsPlaceTerm.getId():
                return ModsPlaceTerm.getSelector();
            case ModsNamePart.getId():
                return ModsNamePart.getSelector();
            case ModsGeographicCode.getId():
              return ModsGeographicCode.getSelector();
            case ModsDateIssued.getId():
                return ModsDateIssued.getSelector();
            case ModsDateCreated.getId():
                return ModsDateCreated.getSelector();
            case ModsDateValid.getId():
                return ModsDateValid.getSelector();
            case ModsDateCaptured.getId():
                return ModsDateCaptured.getSelector();
            case ModsDateModified.getId():
                return ModsDateModified.getSelector();
            case ModsDateOther.getId():
                return ModsDateOther.getSelector();
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
            case ModsLanguageOfCataloging.getId():
                return ModsLanguageOfCataloging.getSelector()
            case ModsExtent.getId():
                return ModsExtent.getSelector();
            case ModsDetail.getId():
                return ModsDetail.getSelector();
            case ModsPhysicalLocation.getId():
                return ModsPhysicalLocation.getSelector();
            case ModsDisplayForm.getId():
                return ModsDisplayForm.getSelector();
            case ModsDescription.getId():
                return ModsDescription.getSelector();
            case ModsInternetMediaType.getId():
                return ModsInternetMediaType.getSelector();
            case ModsTableOfContents.getId():
                return ModsTableOfContents.getSelector();
            case ModsTopic.getId():
                return ModsTopic.getSelector();
            case ModsTemporal.getId():
                return ModsTemporal.getSelector();
            case ModsGeographic.getId():
              return ModsGeographic.getSelector()
            case ModsPhysicalExtent.getId():
                return ModsPhysicalExtent.getSelector();
            case ModsEdition.getId():
                return ModsEdition.getSelector();
        }
        return '';
    }

}
