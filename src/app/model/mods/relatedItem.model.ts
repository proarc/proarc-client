import {ModsElement} from './element.model';
import {ElementField} from './elementField.model';
import {ModsPart} from './part.model';
import {ModsTitle} from './title.model';
import {ModsAuthor} from './author.model';
import {ModsPublisher} from './publisher.model';
import {ModsLocation} from './location.model';
import {ModsSubject} from './subject.model';
import {ModsLanguage} from './language.model';
import {ModsAbstract} from './abstract.model';
import {ModsPhysical} from './physical.model';
import {ModsNote} from './note.mode';
import {ModsGenre} from './genre.model';
import {ModsClassification} from './classification.model';
import {ModsResource} from './resource.model';
import {ModsIdentifier} from './identifier.model';
import {ModsRelatedItem2} from './relatedItem2.model';
import {ModsAccessCondition} from './accessCondition.model';

export class ModsRelatedItem extends ModsElement {

  titleInfos: ElementField;
  accessConditions: ElementField;
  originInfos: ElementField;
  names: ElementField;
  locations: ElementField;
  subjects: ElementField;
  parts: ElementField;
  languages: ElementField;
  abstracts: ElementField;
  physicalDescriptions: ElementField;
  notes: ElementField;
  genres: ElementField;
  classifications: ElementField;
  typeOfResources: ElementField;
  identifiers: ElementField;
  relatedItems: ElementField;


  static getSelector() {
    return 'relatedItem';
  }

  static getId() {
    return 'relatedItem';
  }

  constructor(modsElement: any, template: any) {
    super(modsElement, template, ['type', 'otherType', 'otherTypeURI', 'otherTypeAuth', 'otherTypeAuthURI', 'ID']);
    this.init();
  }

  private init() {
    this.addControl('ID');
    this.addControl('type');
    this.addControl('otherType');
    this.addControl('otherTypeURI');
    this.addControl('otherTypeAuth');
    this.addControl('otherTypeAuthURI');

    if (this.available2('accessCondition')) {
      this.accessConditions = new ElementField(this.modsElement, ModsAccessCondition.getSelector(), this.getField('accessCondition'));
      this.addSubfield(this.accessConditions);
      this.addControl('accessCondition');
    }

    if (this.available2('titleInfo')) {
      this.titleInfos = new ElementField(this.modsElement, ModsTitle.getSelector(), this.getField('titleInfo'));
      this.addSubfield(this.titleInfos);
      this.addControl('titleInfo');
    }

    if (this.available2('originInfo')) {
      this.originInfos = new ElementField(this.modsElement, ModsPublisher.getSelector(), this.getField('originInfo'));
      this.addSubfield(this.originInfos);
      this.addControl('originInfo');
    }

    if (this.available2('name')) {
      this.names = new ElementField(this.modsElement, ModsAuthor.getSelector(), this.getField('name'));
      this.addSubfield(this.names);
      this.addControl('name');
    }

    if (this.available2('location')) {
      this.locations = new ElementField(this.modsElement, ModsLocation.getSelector(), this.getField('location'));
      this.addSubfield(this.locations);
      this.addControl('location');
    }

    if (this.available2('subject')) {
      this.subjects = new ElementField(this.modsElement, ModsSubject.getSelector(), this.getField('subject'));
      this.addSubfield(this.subjects);
      this.addControl('subject');
    }

    if (this.available2('part')) {
      this.parts = new ElementField(this.modsElement, ModsPart.getSelector(), this.getField('part'));
      this.addSubfield(this.parts);
      this.addControl('part');
    }

    if (this.available2('language')) {
      this.languages = new ElementField(this.modsElement, ModsLanguage.getSelector(), this.getField('language'));
      this.addSubfield(this.languages);
      this.addControl('language');
    }

    if (this.available2('abstract')) {
      this.abstracts = new ElementField(this.modsElement, ModsAbstract.getSelector(), this.getField('abstract'));
      this.addSubfield(this.abstracts);
      this.addControl('abstract');
    }

    if (this.available2('physicalDescription')) {
      this.physicalDescriptions = new ElementField(this.modsElement, ModsPhysical.getSelector(), this.getField('physicalDescription'));
      this.addSubfield(this.physicalDescriptions);
      this.addControl('physicalDescription');
    }

    if (this.available2('note')) {
      this.notes = new ElementField(this.modsElement, ModsNote.getSelector(), this.getField('note'));
      this.addSubfield(this.notes);
      this.addControl('note');
    }

    if (this.available2('genre')) {
      this.genres = new ElementField(this.modsElement, ModsGenre.getSelector(), this.getField('genre'));
      this.addSubfield(this.genres);
      this.addControl('genre');
    }

    if (this.available2('classification')) {
      this.classifications = new ElementField(this.modsElement, ModsClassification.getSelector(), this.getField('classification'));
      this.addSubfield(this.classifications);
      this.addControl('classification');
    }

    if (this.available2('typeOfResource')) {
      this.typeOfResources = new ElementField(this.modsElement, ModsResource.getSelector(), this.getField('typeOfResource'));
      this.addSubfield(this.typeOfResources);
      this.addControl('typeOfResource');
    }

    if (this.available2('identifier')) {
      this.identifiers = new ElementField(this.modsElement, ModsIdentifier.getSelector(), this.getField('identifier'));
      this.addSubfield(this.identifiers);
      this.addControl('identifier');
    }

    if (this.available2('relatedItem')) {
      this.relatedItems = new ElementField(this.modsElement, ModsRelatedItem2.getSelector(), this.getField('relatedItem'));
      this.addSubfield(this.relatedItems);
      this.addControl('relatedItem');
    }

  }
}
