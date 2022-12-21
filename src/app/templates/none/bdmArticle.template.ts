export class BdmArticleTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Názvové údaje',
      selector: 'titleInfo',
      labelKey: 'titleInfo',
      description: `Názvová informace vnitřní části.`,
      fields: {
        type: {
          usage: 'MA',
          label: 'Typ',
          selector: 'titleInfo/@type',
          labelKey: 'titleInfo/@type',
          cols: 3,
          options: [
            ['', '-'],
            ['translated', 'Přeložený název'],
            ['alternative', 'Variantní název']
          ]
        },
        lang: {
          usage: 'O',
          label: 'Jazyk',
          selector: 'titleInfo/lang',
          labelKey: 'titleInfo/@lang',
          cols: 3
        },
        nonSort: {
          usage: 'O',
          label: 'Člen, jímž začíná název',
          selector: 'bdm/titleInfo/nonSort',
          labelKey: 'titleInfo/nonSort',
          cols: 3,
          description: `Člen, jímž začíná název`,
        },
        title: {
          usage: 'M',
          label: 'Název',
          selector: 'titleInfo/title',
          labelKey: 'titleInfo/title',
          description: `Vlastní název článku.
            <p>Pokud není titul, nutno vyplnit hodnotu „untitled“`
        },
        subTitle: {
          usage: 'MA',
          label: 'Podnázev článku',
          selector: 'titleInfo/subTitle',
          labelKey: 'titleInfo/subTitle',
          description: `Podnázev článku. Za podnázev lze považovat i perex.`
        },
        partNumber: {
          usage: 'MA',
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          labelKey: 'titleInfo/partNumber',
          cols: 2,
          description: `Číslo článku. Např. článek na pokračování.`
        },
        partName: {
          usage: 'MA',
          label: 'Název části',
          selector: 'titleInfo/partName',
          labelKey: 'titleInfo/partName',
          cols: 2,
          description: `Název pokračování článku.`
        }
      }
    },
    name: {
      usage: 'MA',
      label: 'Autoři',
      selector: 'name',
      labelKey: 'bdm/name',
      description: `Údaje o odpovědnosti za článek.`,
      fields: {
        type: {
          usage: 'R',
          label: 'Typ',
          selector: 'name/@type',
          labelKey: 'name/@type',
          cols: 2,
          description: `Použít jednu z hodnot:
          <ul>
            <li><strong>Osoba</strong> (personal)</li>
            <li><strong>Organizace</strong> (corporate)</li>
            <li><strong>Konference</strong> (conference)</li>
            <li><strong>Rodina</strong> (family)</li>
          </ul>`,
          options: [
            ['', '-'],
            ['personal', 'Osoba'],
            ['corporate', 'Organizace'],
            ['conference', 'Konference'],
            ['family', 'Rodina']
          ]
        },
        nameIdentifier: {
          usage: 'RA',
          label: 'Identifikátor autora',
          selector: 'bdm/name/nameIdentifier',
          labelKey: 'bdm/name/nameIdentifier',
          cols: 2,
          description: `Číslo národní autority`,
        },
        nameIdentifierOrcId: {
          usage: 'RA',
          label: 'ORC ID',
          selector: 'bdm/name/nameIdentifierOrcId',
          labelKey: 'bdm/name/nameIdentifierOrcId',
          cols: 2,
          description: `ORC ID`,
        },
        namePart: {
          usage: 'MA',
          label: 'Jméno',
          selector: 'name/namePart',
          labelKey: 'name/namePart',
          description: `Vyplnit údaje o autorovi.`,
          fields: {
            type: {
              usage: 'R',
              label: 'Typ',
              selector: 'name/namePart/@type',
              labelKey: 'name/namePart/@type',
              cols: 2,
              description: `Použít jednu z hodnot:
                <ul>
                    <li><strong>Křestní jméno</strong> (given)</li>
                    <li><strong>Příjmení</strong> (family)</li>
                    <li><strong>Datum</strong> (date)</li>
                    <li><strong>Ostatní související se jménem</strong> (termsOfAddress)</li>
                </ul>`,
              options: [
                ['', '-'],
                ['given', 'Křestní jméno'],
                ['family', 'Příjmení'],
                ['date', 'Datum'],
                ['termsOfAddress', 'Ostatní související se jménem'],
              ]
            },
            value: {
              label: 'Hodnota',
              usage: 'M',
              selector: 'name/namePart',
              labelKey: 'name/namePart/value',
              cols: 2,
              help: 'off'
            }
          }
        },
        etal: {
          usage: 'O',
          label: 'Etal',
          selector: 'name/etal',
          labelKey: 'name/etal',
          cols: 2,
          description: `Element indikující, že existuje více autorů, než pouze ti, kteří byli uvedeni v <name> elementu.</br>
          V případě užití tohoto elementu je dále top element <name> neopakovatelný.</br>
          <etal> je nutné umístit do samostatného top elementu <name>, ve kterém se nesmí objevit subelementy <namePart> a <nameIdentifier>.`
        },
        affiliation: {
          usage: 'O',
          label: 'Napojená instituce',
          selector: 'name/affiliation',
          labelKey: 'name/affiliation',
          cols: 2,
          description: `Umožňuje vepsat název instituce, se kterou je autor spojen<br/>
          např.: Slezská univerzita v Opavě, Ústav pro studium totalitních režimů, Katedra politologie při Filosofické fakultě University Palackého, apod.`
        },
        role: {
          usage: 'MA',
          label: 'Role',
          selector: 'name/role/roleTerm',
          labelKey: 'name/role/roleTerm',
          expanded: true,
          description: `Specifikace role osoby nebo organizace<br/>
          Kód role z kontrolovaného slovníku rolí
          (<a href=\"http://www.loc.gov/marc/relators/relaterm.html\" target=\"_blank\">http://www.loc.gov/marc/relators/relaterm.html</a>)`,
          fields: {},
        }
      }
    },
    subject: {
      usage: 'R',
      label: 'Klíčová slova',
      selector: 'subject',
      labelKey: 'bdm/subject',
      description: `Údaje o věcném třídění`,
      fields: {
        topic: {
          usage: 'R',
          label: 'Klíčové slovo/Předmětové heslo',
          selector: 'subject/topic',
          labelKey: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah článku.<br\>
           Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21.`,
        },
        lang: {
          usage: 'M',
          label: 'Jazyk',
          selector: 'subject/@lang',
          labelKey: 'subject/@lang',
        }
      }
    },
    language: {
      usage: 'M',
      label: 'Jazyk',
      selector: 'language',
      labelKey: 'language',
      description: `Údaje o jazyce dokumentu; v případě vícenásobného výskytu nutno element &lt;language> opakovat`,
      fields: {
        language: {
          usage: 'M',
          label: 'Jazyk článku',
          selector: 'language/languageTerm',
          labelKey: 'language/languageTerm',
          description: `Přesné určení jazyka článku`
        }
      }
    },
    abstract: {
      usage: 'R',
      label: 'Abstrakt',
      selector: 'abstract',
      labelKey: 'abstract',
      description: `Shrnutí obsahu jako celku odpovídá poli 520 MARC21`,
      fields: {
        abstract: {
          usage: 'RA',
          label: 'Abstrakt',
          selector: 'abstract',
          labelKey: 'abstract/value',
          description: 'Shrnutí obsahu článku.',
          help: 'off'
        },
        lang: {
          usage: 'RA',
          label: 'Jazyk abstraktu',
          selector: 'abstract/@lang',
          labelKey: 'abstract/@lang',
          description: 'Jazyk abstraktu',
          help: 'off'
        }
      }
    },
    part: {
      usage: 'MA',
      label: 'Rozsah článku',
      selector: 'part',
      labelKey: 'bdm/part',
      description: `Rozsah článku`,
      fields: {
        extent: {
          usage: 'MA',
          label: 'Rozsah',
          selector: 'part/extent',
          labelKey: 'part/extent',
          description: `Tento kontejner <part> slouží k zaznamenání rozsahu stran v reprezentaci.`,
          fields: {
            start: {
              usage: 'MA',
              label: 'Od strany',
              cols: 2,
              selector: 'part/extent/start',
              labelKey: 'bdm/part/extent/start',
              description: `První stránka článku.`
            },
            end: {
              usage: 'MA',
              label: 'Do strany',
              cols: 2,
              selector: 'part/extent/end',
              labelKey: 'bdm/part/extent/end',
              description: `Poslední stránka článku.`
            }
          }
        }
      }
    },
    physicalDescription: {
      usage: 'M',
      label: 'Fyzický popis',
      selector: 'physicalDescription',
      labelKey: 'physicalDescription',
      description: `Obsahuje údaje o fyzickém popisu článku.`,
      fields: {
        form: {
          usage: 'M',
          label: 'Typ média',
          selector: 'physicalDescription/form',
          labelKey: 'physicalDescription/form',
          description: `Údaje o fyzické podobě dokumentu, např. print, electronic, microfilm apod."
                            + "Odpovídá hodnotě v poli 008/23`,
          fields: {
            value: {
              usage: 'M',
              label: 'Hodnota',
              labelKey: 'physicalDescription/form/value',
              help: 'off',
              options: [
                ['bez média', 'bez média'],
                ['jiný', 'jiný'],
                ['počítač', 'počítač']
              ]
            }
          }
        }
      }
    },
    note: {
      usage: 'R',
      label: 'Poznámka',
      selector: 'note',
      labelKey: 'note',
      description: `Obecná poznámka k vnitřní části.<br\>
 Do poznámky by se měla dávat šifra autora vnitřní části, která se vyskytuje pod vnitřní částí.`,
      fields: {
        note: {
          usage: 'RA',
          selector: 'note/value',
          labelKey: 'note/value',
          label: 'Poznámka',
          help: 'off'
        }
      }
    },
    genre: {
      usage: 'R',
      label: 'Typ obsahu',
      selector: 'genre',
      labelKey: 'genre',
      fields: {
        value: {
          usage: 'M',
          selector: 'genre/value',
          labelKey: 'genre/value',
          label: 'Hodnota',
          cols: 2,
          help: 'off'
        },
        type: {
          usage: 'R',
          label: 'Typ obsahu',
          cols: 2,
          selector: 'genre/@type',
          labelKey: 'bdm/genre/@type',
          options: [
            ['abstract', 'abstrakt'],
            ['directory', 'adresář'],
            ['annotations', 'anotace'],
            ['bibliography', 'bibliografie'],
            ['main article', 'hlavní článek'],
            ['biographical portrait', 'medailonek'],
            ['obituary', 'nekrolog'],
            ['cover', 'obálka'],
            ['table of content', 'obsah'],
            ['peer-reviewed', 'recenzováno'],
            ['preface', 'předmluva'],
            ['review', 'recenze'],
            ['index', 'rejstřík'],
            ['advertisement', 'reklama'],
            ['interview', 'rozhovor'],
            ['colophon', 'tiráž'],
            ['title page', 'titulní list'],
            ['introduction', 'úvod'],
            ['editorsNote', 'úvodník'],
            ['dedication', 'věnování'],
            ['news', 'zpráva'],
            ['unspecified', 'nespecifikován']]
        }
      }
    },
    classification: {
      usage: 'R',
      label: 'Klasifikace',
      selector: 'classification',
      labelKey: 'classification',
      description: `Klasifikační údaje věcného třídění podle Mezinárodního desetinného třídění<br/>
      odpovídá poli 080 MARC21`,
      fields: {
        authority: {
          usage: 'M',
          label: 'Autorita',
          selector: 'classification/@authority',
          labelKey: 'classification/@authority',
          cols: 2,
          description: `
          <ul>
            <li>
              vyplnit hodnotu <strong>udc</strong> (v případě 072 $a)
            </li>
            <li>
              vyplnit hodnotu <strong>Konspekt</strong>  (v případě 072 $9)
            </li>
          </ul>`,
          options: [
            ['udc', 'udc'],
            ['Konspekt', 'Konspekt']
          ]
        },
        edition: {
          usage: 'M',
          label: 'Vydání',
          selector: 'classification/@edition',
          labelKey: 'classification/@edition',
          cols: 2,
          description: `
          <ul>
            <li>
              vyplnit hodnotu <strong>Konspekt</strong> (v případě 072 $a)
            </li>
          </ul>`,
          options: [
            ['Konspekt', 'Konspekt']
          ]
        },
        value: {
          usage: 'R',
          selector: 'classification/value',
          labelKey: 'classification/value',
          label: 'Hodnota',
          help: 'off'
        }
      }
    },
    location: {
      usage: 'MA',
      label: 'Uložení',
      selector: 'location',
      labelKey: 'location',
      description: `Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.`,
      fields: {
        url: {
          usage: 'MA',
          label: 'URL',
          selector: 'location/url',
          labelKey: 'location/url',
          description: `Pro uvedení lokace elektronického dokumentu`,
          fields: {
            value: {
              usage: 'MA',
              selector: 'location/url/value',
              labelKey: 'location/url/value',
              label: 'Hodnota',
              help: 'off'
            },
            note: {
              usage: 'R',
              selector: 'location/url/@note',
              labelKey: 'location/url/@note',
              cols: 2,
              label: 'Note',
              help: 'off'
            },
            usage: {
              usage: 'R',
              cols: 2,
              selector: 'location/url/@usage',
              labelKey: 'location/url/@usage',
              label: 'Usage',
              help: 'off',
              options: [
                ['', '-'],
                ['primary', 'primary']
              ]
            },
          }
        },
      }
    },
    identifier: {
      usage: 'M',
      label: 'Identifikátory článku',
      selector: 'identifier',
      labelKey: 'identifier',
      description: `Údaje o identifikátorech článku.`,
      fields: {
        type: {
          usage: 'M',
          label: 'Typ',
          selector: 'identifier/@type',
          labelKey: 'identifier/@type',
          cols: 2,
          description: `Výběr typu identifikátoru článku.`,
          options: [
            ['doi', 'doi'],
            ['uuid', 'uuid']
          ]
        },
        value: {
          usage: 'M',
          selector: 'identifier/value',
          labelKey: 'identifier/value',
          label: 'Hodnota',
          help: 'off'
        }
      }
    },
    recordInfo: {
      usage: 'M',
      label: 'Údaje o metadatovém záznamu',
      selector: 'recordInfo',
      labelKey: 'recordInfo',
      description: `údaje o metadatovém záznamu – jeho vzniku, změnách apod.`,
      fields: {
        descriptionStandard: {
          usage: 'MA',
          label: 'Standard metadat',
          cols: 2,
          selector: 'recordInfo/descriptionStandard',
          labelKey: 'recordInfo/descriptionStandard',
          description: `Popis standardu, ve kterém je přebíraný katalogizační záznam<br/>
            Pro záznamy v AACR2: Odpovídá hodnotě návěští záznamu MARC21, pozice 18 - hodnota „aacr“, tj. pro LDR/18 ="a"`,
          options: [
            ['aacr', 'aacr'],
            ['rda', 'rda']
          ]
        },
        recordContentSource: {
          usage: 'R',
          label: 'Content source',
          selector: 'recordInfo/recordContentSource',
          labelKey: 'recordInfo/recordContentSource',
          description: `Kód nebo jméno instituce, která záznam vytvořila nebo změnila`,
          fields: {
            value: {
              usage: 'R',
              label: 'Content source',
              cols: 2,
              selector: 'recordInfo/recordContentSource',
              labelKey: 'recordInfo/recordContentSource',
              help: 'off'
            },
            authority: {
              usage: 'R',
              label: 'Autorita',
              cols: 2,
              selector: 'recordInfo/recordContentSource/@authority',
              labelKey: 'recordInfo/recordContentSource/@authority',
              description: `authority – hodnota "marcorg"`,
              options: [
                ['marcorg', 'marcorg']
              ]
            }
          }
        },
        recordCreationDate: {
          usage: 'M',
          label: 'Datum vytvoření',
          selector: 'recordInfo/recordCreationDate',
          labelKey: 'recordInfo/recordCreationDate',
          description: `datum prvního vytvoření záznamu, na úroveň minut`,
          fields: {
            value: {
              usage: 'M',
              label: 'Datum vytvoření',
              cols: 2,
              selector: 'recordInfo/recordCreationDate',
              labelKey: 'recordInfo/recordCreationDate',
              help: 'off'
            },
            encoding: {
              usage: 'M',
              label: 'Kódování',
              cols: 2,
              selector: 'recordInfo/recordCreationDate/@encoding',
              labelKey: 'recordInfo/recordCreationDate/@encoding',
              description: `Záznam bude podle normy ISO 8601 na úroveň minut, hodnota atributu tedy "iso8601"`,
              options: [
                ['iso8601', 'iso8601']
              ]
            }
          }
        },
        recordChangeDate: {
          usage: 'MA',
          label: 'Datum změny',
          selector: 'recordInfo/recordChangeDate',
          labelKey: 'recordInfo/recordChangeDate',
          description: `datum změny záznamu `,
          fields: {
            value: {
              usage: 'MA',
              label: 'Datum změny',
              cols: 2,
              selector: 'recordInfo/recordChangeDate',
              labelKey: 'recordInfo/recordChangeDate',
              help: 'off'
            },
            encoding: {
              usage: 'M',
              label: 'Kódování',
              cols: 2,
              selector: 'recordInfo/recordChangeDate/@encoding',
              labelKey: 'recordInfo/recordChangeDate/@encoding',
              description: `Záznam bude podle normy ISO 8601 na úroveň minut, hodnota atributu tedy "iso8601"`,
              options: [
                ['iso8601', 'iso8601']
              ]
            }
          }
        },
        recordIdentifier: {
          usage: 'R',
          label: 'Identifikátor záznamu',
          selector: 'recordInfo/recordIdentifier',
          labelKey: 'recordInfo/recordIdentifier',
          description: `identifikátor záznamu v katalogu, přebírá se z pole 001`,
          fields: {
            value: {
              usage: 'MA',
              label: 'Identifikátor záznamu',
              cols: 2,
              selector: 'recordInfo/recordIdentifier',
              labelKey: 'recordInfo/recordIdentifier',
              help: 'off'
            },
            source: {
              usage: 'R',
              label: 'Zdroj',
              cols: 2,
              selector: 'recordInfo/recordIdentifier/@source',
              labelKey: 'recordInfo/recordIdentifier/@source',
              description: `hodnota se přebírá z katalogu pole 003 `
            }
          }
        },
        recordOrigin: {
          usage: 'R',
          label: 'Údaje o vzniku záznamu',
          cols: 2,
          selector: 'recordInfo/recordOrigin',
          labelKey: 'recordInfo/recordOrigin',
          description: `údaje o vzniku záznamu hodnoty: "machine generated" nebo "human prepared"`,
          options: [
            ['machine generated', 'machine generated'],
            ['human prepared', 'human prepared']
          ]
        },
        languageOfCataloging: {
          usage: 'R',
          label: 'Jazyk záznamu',
          selector: 'recordInfo/languageOfCataloging',
          labelKey: 'recordInfo/languageOfCataloging',
          description: `jazyk katalogového záznamu`,
          fields: {
            languageOfCataloging: {
              usage: 'R',
              label: 'Jazyk záznamu',
              cols: 2,
              selector: 'recordInfo/languageOfCataloging',
              labelKey: 'recordInfo/languageOfCataloging',
              help: 'off'
            },
            languageTerm: {
              usage: 'R',
              label: 'Zdroj',
              cols: 2,
              selector: 'recordInfo/languageOfCataloging/languageTerm',
              labelKey: 'recordInfo/languageOfCataloging/languageTerm',
              description: `přebírá se z katalogu - pole 40 $b`
            },
            authority: {
              usage: 'R',
              label: 'Autorita',
              cols: 2,
              selector: 'recordInfo/languageOfCataloging/languageTerm/@authority',
              labelKey: 'recordInfo/languageOfCataloging/languageTerm/@authority',
              description: `authority – hodnota "iso639-2b"`,
              options: [
                ['iso639-2b', 'iso639-2b']
              ]
            }
          }
        },
      }
    },
    relatedItem: {
      usage: 'MA',
      label: 'Recenze na',
      selector: 'relatedItem',
      labelKey: 'bdm/relatedItem',
      description: 'Recenze na:',
      fields: {
        part: {
          usage: 'MA',
          label: 'Rozsah článku',
          selector: 'relatedItem/part',
          labelKey: 'bdm/relatedItem/part',
          description: `Rozsah článku`,
          fields: {
            extent: {
              usage: 'MA',
              label: 'Rozsah',
              selector: 'relatedItem/part/extent',
              labelKey: 'bdm/relatedItem/part/extent',
              description: `Tento kontejner <part> slouží k zaznamenání rozsahu stran v reprezentaci.`,
              fields: {
                start: {
                  usage: 'MA',
                  label: 'Od strany',
                  cols: 2,
                  selector: 'relatedItem/part/extent/start',
                  labelKey: 'bdm/relatedItem/part/extent/start',
                  description: `První stránka článku.`
                },
                end: {
                  usage: 'MA',
                  label: 'Do strany',
                  cols: 2,
                  selector: 'relatedItem/part/extent/end',
                  labelKey: 'bdm/relatedItem/part/extent/end',
                  description: `Poslední stránka článku.`
                }
              }
            }
          }
        },
        titleInfo: {
          usage: 'M',
          label: 'Název recenzovaného díla',
          selector: 'relatedItem/titleInfo',
          labelKey: 'bdm/relatedItem/titleInfo',
          description: `Názvová informace vnitřní části.`,
          fields: {
            title: {
              usage: 'M',
              label: 'Název recenzovaného díla',
              selector: 'relatedItem/titleInfo/title',
              labelKey: 'bdm/relatedItem/titleInfo/title',
              description: `Název recenzovaného díla. Odpovídá poli 787$t.`
            }
          }
        },
        name: {
          usage: 'M',
          label: 'Autoři recenzovaného díla',
          selector: 'relatedItem/name',
          labelKey: 'bdm/relatedItem/name',
          description: `Autoři recenzovaného díla ve tvaru: \"Příjmení, Jméno\". Odpovídá poli 787$a`,
          fields: {
            type: {
              usage: 'R',
              label: 'Typ',
              selector: 'relatedItem/name/@type',
              labelKey: 'relatedItem/name/@type',
              cols: 2,
              description: `Použít jednu z hodnot:
          <ul>
            <li><strong>Osoba</strong> (personal)</li>
            <li><strong>Organizace</strong> (corporate)</li>
            <li><strong>Konference</strong> (conference)</li>
            <li><strong>Rodina</strong> (family)</li>
          </ul>`,
              options: [
                ['', '-'],
                ['personal', 'Osoba'],
                ['corporate', 'Organizace'],
                ['conference', 'Konference'],
                ['family', 'Rodina']
              ]
            },
            namePart: {
              usage: 'MA',
              label: 'Jméno',
              selector: 'name/namePart',
              labelKey: 'name/namePart',
              description: `Vyplnit údaje o autorovi.`,
              fields: {
                type: {
                  usage: 'R',
                  label: 'Typ',
                  selector: 'name/namePart/@type',
                  labelKey: 'name/namePart/@type',
                  cols: 2,
                  description: `Použít jednu z hodnot:
                <ul>
                    <li><strong>Křestní jméno</strong> (given)</li>
                    <li><strong>Příjmení</strong> (family)</li>
                    <li><strong>Datum</strong> (date)</li>
                    <li><strong>Ostatní související se jménem</strong> (termsOfAddress)</li>
                </ul>`,
                  options: [
                    ['', '-'],
                    ['given', 'Křestní jméno'],
                    ['family', 'Příjmení'],
                    ['date', 'Datum'],
                    ['termsOfAddress', 'Ostatní související se jménem'],
                  ]
                },
                value: {
                  label: 'Hodnota',
                  usage: 'M',
                  selector: 'name/namePart',
                  labelKey: 'name/namePart/value',
                  cols: 2,
                  help: 'off'
                }
              }
            },
          }
        },
        originInfo: {
          usage: 'M',
          label: 'Nakladatelské údaje recenzovaného díla',
          selector: 'relatedItem/originInfo',
          labelKey: 'relatedItem/originInfo',
          description: `Názvová informace vnitřní části.`,
          fields: {
            publisher: {
              usage: 'MA',
              label: 'Nakladatelské údaje',
              selector: 'relatedItem/originInfo/publisher',
              labelKey: 'relatedItem/originInfo/publisher',
              description: `Vydavatel recenzovaného díla ve tvaru: \"město : nakladatelství, rok vydání\". Odpovídá poli 787$d.`,
            },
            edition: {
              usage: 'R',
              label: 'Vydání',
              selector: 'relatedItem/originInfo/edition',
              labelKey: 'relatedItem/originInfo/edition',
              description: `Údaj o pořadí vydání, odpovídá poli 250 $a katalogizačního záznamu.`
            },
          }
        },
        physicalDescription: {
          usage: 'MA',
          label: 'Fyzický popis',
          selector: 'relatedItem/physicalDescription',
          labelKey: 'bdm/relatedItem/physicalDescription',
          description: `Obsahuje údaje o popisu zdroje/předlohy`,
          fields: {
            extent: {
              usage: 'RA',
              label: 'Rozsah',
              selector: 'relatedItem/physicalDescription/extent',
              labelKey: 'bdm/relatedItem/physicalDescription/extent',
              description: `Údaje o rozsahu (stran, svazků nebo rozměrů)`,
            },
          }
        },
        note: {
          usage: 'RA',
          label: 'Poznámka',
          selector: 'relatedItem/note',
          labelKey: 'bdm/relatedItem/note',
          description: `Obecná poznámka`,
          fields: {
            note: {
              usage: 'RA',
              selector: 'relatedItem/note/value',
              labelKey: 'bdm/relatedItem/note/value',
              label: 'Poznámka',
              help: 'off'
            }
          }
        },
        identifier: {
          usage: 'M',
          label: 'Identifikátory článku',
          selector: 'relatedItem/identifier',
          labelKey: 'relatedItem/identifier',
          description: `Údaje o identifikátorech.`,
          fields: {
            type: {
              usage: 'M',
              label: 'Typ',
              selector: 'relatedItem/identifier/@type',
              labelKey: 'relatedItem/identifier/@type',
              cols: 2,
              description: `Výběr typu identifikátoru článku.`,
              options: [
                ['doi', 'doi'],
                ['uuid', 'uuid'],
                ['isbn', 'isbn']
              ]
            },
            value: {
              usage: 'M',
              selector: 'relatedItem/identifier/value',
              labelKey: 'relatedItem/identifier/value',
              label: 'Hodnota',
              help: 'off'
            },
            validity: {
              usage: 'MA',
              label: 'Platnost',
              selector: 'relatedItem/identifier/@invalid',
              labelKey: 'relatedItem/identifier/@invalid',
              cols: 2,
              description: `Uvádějí se i neplatné resp. zrušené identifikátory.`
            },
          }
        },
      }
    }
  };
}
