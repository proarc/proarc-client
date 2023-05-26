export class NdkeArticleRdaTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      labelKey: 'titleInfo',
      description: `Název vnitřní části<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má monografie více typů názvů, element se opakuje podle potřeby`,
      fields: {
        type: {
          usage: 'R',
          label: 'Typ',
          selector: 'titleInfo/@type',
          labelKey: 'titleInfo/@type',
          cols: 2,
          description: `Hlavní název bez typu - pole 245 a $a<br/>
          Možné hodnoty
          <ul>
            <li>Alternativní název (alternative) – pole 246</li>
            <li>Přeložený název (translated) – pole 242</li>
            <li>Jednotný název (uniform) – pole 130 resp. 240</li>
          </ul>`,
          options: [
            ['', '-'],
            ['translated', 'Přeložený název'],
            ['alternative', 'Alternativní název'],
            ['uniform', 'Jednotný název']
          ]
        },
        nonSort: {
          usage: 'R',
          label: 'Část vynechaná při hledání',
          selector: 'titleInfo/nonSort',
          labelKey: 'titleInfo/nonSort',
          cols: 2,
          description: `Část názvu, která má být vynechána při vyhledávána<br/>
          např.:
          <ul>
            <li><nonSort>The</nonSort></li>
            <li><title>Beatles</title></li>
          </ul>`,
        },
        title: {
          usage: 'M',
          label: 'Název',
          selector: 'titleInfo/title',
          labelKey: 'titleInfo/title',
          description: `Názvová informace – název vnitřní části</br>
          hodnoty převzít z katalogu<br/>
          pokud není titul, nutno vyplnit hodnotu <strong>untitled</strong>`
        },
        subTitle: {
          usage: 'MA',
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          labelKey: 'titleInfo/subTitle',
          description: `Podnázev vnitřní části`
        },
        partNumber: {
          usage: 'MA',
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          labelKey: 'titleInfo/partNumber',
          cols: 2,
          description: `V případě, že se jedná o vícesvazkovou monografii, je zde uvedeno číslo svazku`
        },
        partName: {
          usage: 'MA',
          label: 'Název části',
          selector: 'titleInfo/partName',
          labelKey: 'titleInfo/partName',
          cols: 2,
          description: `V případě, že se jedná o vícesvazkovou monografii, je zde uveden název svazku<br/>
          odpovídající pole a podpole podle typu, viz typ`
        }
      }
    },
    name: {
      usage: 'MA',
      label: 'Autor',
      selector: 'name',
      labelKey: 'name',
      description: `Údaje o odpovědnosti za článek<br/>
      POZOR – údaje o odpovědnosti nutno přebírat z polí 1XX a 7XX MARCu21<br/>
      pokud má monografie autora a ilustrátora, element <name> se opakuje s různými rolemi`,
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
        nameIdentifier: {
          usage: 'RA',
          label: 'Identifikátor autora',
          selector: 'name/nameIdentifier',
          labelKey: 'name/nameIdentifier',
          cols: 2,
          description: `Číslo národní autority`,
        },
        nameIdentifierOrcId: {
          usage: 'RA',
          label: 'ORC ID',
          selector: 'name/nameIdentifierOrcId',
          labelKey: 'name/nameIdentifierOrcId',
          cols: 2,
          description: `ORC ID`,
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
      usage: 'RA',
      label: 'Věcné třídění',
      selector: 'subject',
      labelKey: 'subject',
      description: `Údaje o věcném třídění<br/>
      Předpokládá se přebírání z katalogizačního záznamu`,
      fields: {
        authority: {
          usage: 'MA',
          label: 'Autorita',
          selector: 'subject/@authority',
          labelKey: 'subject/@authority',
          description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong>, <strong>Konspekt</strong><br/>
          Odpovídá hodnotě v $2`,
          options: [
            ['', '-'],
            ['czenas', 'czenas'],
            ['eczenas', 'eczenas'],
            ['mednas', 'mednas'],
            ['czmesh', 'czmesh'],
            ['msvkth', 'msvkth'],
            ['agrovoc', 'agrovoc'],
            ['Konspekt', 'Konspekt'],
          ]
        },
        topic: {
          usage: 'R',
          label: 'Klíčové slovo/Předmětové heslo',
          selector: 'subject/topic',
          labelKey: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah vnitřní části<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21`
        },
        geographic: {
          usage: 'O',
          label: 'Geografické věcné třídění',
          selector: 'subject/geographic',
          labelKey: 'subject/geographic',
          description: `Geografické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (geografický termín) nebo obsah pole 651 záznamu MARC21`
        },
        temporal: {
          usage: 'R',
          label: 'Chronologické věcné třídění',
          selector: 'subject/temporal',
          labelKey: 'subject/temporal',
          description: `Chronologické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (chronologický údaj) nebo obsah pole 648 záznamu MARC21`
        },
        name: {
          usage: 'R',
          label: 'Jméno použité jako věcné záhlaví',
          selector: 'subject/name',
          labelKey: 'subject/name',
          description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21`,
          fields: {
            type: {
              usage: 'M',
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
            nameIdentifier: {
              usage: 'MA',
              label: 'Identifikátor autora',
              selector: 'name/nameIdentifier',
              labelKey: 'name/nameIdentifier',
              cols: 2,
              description: `Číslo národní autority`,
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
        }
      }
    },
    language: {
      usage: 'R',
      label: 'Jazyk',
      selector: 'language',
      labelKey: 'language',
      description: `Údaje o jazyce dokumentu`,
      fields: {
        objectPart: {
          usage: 'R',
          label: 'Část',
          cols: 2,
          selector: 'language/@objectPart',
          labelKey: 'language/@objectPart',
          description: `Možnost vyjádřit jazyk konkrétní části svazku <br/>
          možné hodnoty<br/>
          <ul>
            <li><strong>Shrnutí</strong> (summary) – odpovídá poli 041 $b</li>
            <li><strong>Obsah</strong> (table of contents) - odpovídá poli 041 $f</li>
            <li><strong>Doprovodný materiál</strong> (accompanying material) - odpovídá poli 041 $g</li>
            <li><strong>Překlad</strong> (translation) - odpovídá poli 041 $h</li>
          </ul>`,
          options: [
            ['', '-'],
            ['summary', 'Shrnutí'],
            ['table of contents', 'Obsah'],
            ['accompanying material', 'Doprovodný materiál'],
            ['translation', 'Překlad']
          ]
        },
        language: {
          usage: 'R',
          label: 'Jazyk',
          cols: 2,
          selector: 'language/languageTerm',
          labelKey: 'language/languageTerm',
          description: `Přesné určení jazyka`
        }
      }
    },
    physicalDescription: {
      usage: 'R',
      label: 'Fyzický popis',
      selector: 'physicalDescription',
      labelKey: 'physicalDescription',
      description: `Obsahuje údaje o fyzickém popisu zdroje/předlohy`,
      fields: {
        digitalOrigin: {
          usage: 'MA',
          label: 'Zdroje digitálního dokumentu',
          selector: 'physicalDescription/digitalOrigin',
          labelKey: 'physicalDescription/digitalOrigin',
          description: `Indikátor zdroje digitálního dokumentu hodnota <strong>born digital</strong>`,
          options: [
            ['', '-'],
            ['born digital', 'born digital']
          ]
        },
        note: {
          usage: 'O',
          label: 'Poznámka',
          selector: 'physicalDescription/note',
          labelKey: 'physicalDescription/note',
          description: `V případě doskenu se POVINNĚ vyplní hodnota <strong>dosken</strong>`
        },
        form: {
          usage: 'RA',
          label: 'Forma',
          selector: 'physicalDescription/form',
          labelKey: 'physicalDescription/form',
          description: `Údaje o fyzické podobě dokumentu, např. print, electronic, microfilm apod.<br/>
          odpovídá hodnotě v poli 008/23
          `,
          fields: {
            authority: {
              usage: 'MA',
              label: 'Autorita',
              selector: 'physicalDescription/form/@authority',
              labelKey: 'physicalDescription/form/@authority',
              description: `Možné hodnoty
              <ul>
                <li><strong>marcform</strong></li>
                <li><strong>marccategory</strong></li>
                <li><strong>marcsmd</strong></li>
                <li><strong>gmd</strong></li>
                <li><strong>Konspekt</strong></li>
              </ul>`,
              options: [
                ['marcform', 'marcform'],
                ['marccategory', 'marccategory'],
                ['marcsmd', 'marcsmd'],
                ['gmd', 'gmd'],
                ['Konspekt', 'Konspekt']
              ]
            },
            value: {
              usage: 'RA',
              selector: 'physicalDescription/form/value',
              labelKey: 'physicalDescription/form/value',
              label: 'Hodnota',
              help: 'off'
            }
          }
        }
      }
    },
    genre: {
      usage: 'M',
      label: 'Žánr',
      selector: 'genre',
      labelKey: 'genre',
      description: `Bližší údaje o typu dokumentu`,
      fields: {
        value: {
          usage: 'M',
          selector: 'genre/value',
          labelKey: 'genre/value',
          cols: 2,
          label: 'Hodnota',
          help: 'off'
        },
        type: {
          usage: 'R',
          label: 'Typ',
          selector: 'genre/@type',
          labelKey: 'genre/@type',
          cols: 2,
          description: `Možnost vyplnit bližší určení typu oddílu (možnost použít DTD monografie, MonographComponentPart Types)`,
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
            ['unspecified', 'nespecifikován']
          ]
        }
      }
    },
    identifier: {
      usage: 'M',
      label: 'Identifikátor',
      selector: 'identifier',
      labelKey: 'identifier',
      description: `Údaje o identifikátorech, obsahuje unikátní
      identifikátory mezinárodní nebo lokální, které svazek monografie má.`,
      fields: {
        type: {
          usage: 'M',
          label: 'Typ',
          selector: 'identifier/@type',
          labelKey: 'identifier/@type',
          cols: 2,
          description: `Budou se povinně vyplňovat následující
          hodnoty, pokud existují:
            <ul>
              <li>
                <strong>UUID</strong> (uuid) <i>M</i><br/>
                vygeneruje dodavatel
              </li>
              <li>
                <strong>URN:NBN</strong> (urnnbn) <i>M</i><br/>
                pro URN:NBN, např. zápis ve tvaru urn:nbn:cz:nk-123456 pro projekt NDK
              </li>
              <li>
                <strong>čČNB</strong> (ccnb) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 015, $a, $z
              </li>
              <li>
                <strong>ISBN</strong> (isbn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 020, $a, $z
              </li>
              <li>
                <strong>ISMN</strong> (ismn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 024 (1. ind.="2"), $a, $z
              </li>
            </ul>
            Jiný interní identifikátor <i>R</i>, např. barcode, oclc, sysno, permalink`
        },
        validity: {
          usage: 'M',
          label: 'Platnost',
          selector: 'identifier/@invalid',
          labelKey: 'identifier/@invalid',
          cols: 2,
          description: `Uvádějí se i neplatné resp. zrušené identifikátory
          <ul>
            <li>
              <strong>Platný</strong> <code>identifier/[not(@invalid)]</code>
            </li>
            <li>
              <strong>Neplatný</strong> <code>identifier/[@invalid='yes']</code>
            </li>
          </ul>`
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
    note: {
      usage: 'O',
      label: 'Poznámka',
      selector: 'note',
      labelKey: 'note',
      description: `Obecná poznámka k titulu periodika jako celku<br/>
      Odpovídá hodnotám v poli 245, $c (statement of responsibility)
      a v polích 5XX (poznámky) katalogizačního záznamu`,
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
    abstract: {
      usage: 'RA',
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
          help: 'off'
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
          usage: 'MA',
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
    part: {
      usage: 'MA',
      label: 'Popis části',
      selector: 'part',
      labelKey: 'part',
      description: `Popis části, pokud je svazek části souboru,element může být využit jen na zaznamenání<caption>.`,
      fields: {
        extent: {
          usage: 'MA',
          label: 'Extent',
          selector: 'part/extent',
          labelKey: 'part/extent',
          description: `Tento kontejner <part> slouží k zaznamenání rozsahu stran v reprezentaci.`,
          fields: {
            start: {
              usage: 'MA',
              label: 'Od strany',
              cols: 2,
              selector: 'part/extent/start',
              labelKey: 'part/extent/start',
              description: `První stránka, na které vnitřní část začíná.`
            },
            end: {
              usage: 'MA',
              label: 'Do strany',
              cols: 2,
              selector: 'part/extent/end',
              labelKey: 'part/extent/end',
              description: `Poslední stránka, na které vnitřní část končí.`
            }
          }
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
              defaultValue: 'marcorg',
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
      usage: 'O',
      label: 'Recenze na',
      selector: 'relatedItem',
      labelKey: 'bdm/relatedItem',
      description: 'Recenze na:',
      fields: {
        titleInfo: {
          usage: 'MA',
          label: 'Název',
          selector: 'relatedItem/titleInfo',
          labelKey: 'relatedItem/titleInfo',
          description: `Název vnitřní části<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má monografie více typů názvů, element se opakuje podle potřeby`,
          fields: {
            type: {
              usage: 'R',
              label: 'Typ',
              selector: 'relatedItem/titleInfo/@type',
              labelKey: 'relatedItem/titleInfo/@type',
              cols: 2,
              description: `Hlavní název bez typu - pole 245 a $a<br/>
          Možné hodnoty
          <ul>
            <li>Alternativní název (alternative) – pole 246</li>
            <li>Přeložený název (translated) – pole 242</li>
            <li>Jednotný název (uniform) – pole 130 resp. 240</li>
          </ul>`,
              options: [
                ['', '-'],
                ['translated', 'Přeložený název'],
                ['alternative', 'Alternativní název'],
                ['uniform', 'Jednotný název']
              ]
            },
            nonSort: {
              usage: 'R',
              label: 'Část vynechaná při hledání',
              selector: 'relatedItem/titleInfo/nonSort',
              labelKey: 'relatedItem/titleInfo/nonSort',
              cols: 2,
              description: `Část názvu, která má být vynechána při vyhledávána<br/>
          např.:
          <ul>
            <li><nonSort>The</nonSort></li>
            <li><title>Beatles</title></li>
          </ul>`,
            },
            title: {
              usage: 'MA',
              label: 'Název',
              selector: 'relatedItem/titleInfo/title',
              labelKey: 'relatedItem/titleInfo/title',
              description: `Názvová informace – název vnitřní části</br>
          hodnoty převzít z katalogu<br/>
          pokud není titul, nutno vyplnit hodnotu <strong>untitled</strong>`
            },
            subTitle: {
              usage: 'MA',
              label: 'Podnázev',
              selector: 'relatedItem/titleInfo/subTitle',
              labelKey: 'relatedItem/titleInfo/subTitle',
              description: `Podnázev vnitřní části`
            },
            partNumber: {
              usage: 'MA',
              label: 'Číslo části',
              selector: 'relatedItem/titleInfo/partNumber',
              labelKey: 'relatedItem/titleInfo/partNumber',
              cols: 2,
              description: `V případě, že se jedná o vícesvazkovou monografii, je zde uvedeno číslo svazku`
            },
            partName: {
              usage: 'MA',
              label: 'Název části',
              selector: 'relatedItem/titleInfo/partName',
              labelKey: 'relatedItem/titleInfo/partName',
              cols: 2,
              description: `V případě, že se jedná o vícesvazkovou monografii, je zde uveden název svazku<br/>
          odpovídající pole a podpole podle typu, viz typ`
            }
          }
        },
        name: {
          usage: 'MA',
          label: 'Autor',
          selector: 'relatedItem/name',
          labelKey: 'relatedItem/name',
          description: `Údaje o odpovědnosti za článek<br/>
      POZOR – údaje o odpovědnosti nutno přebírat z polí 1XX a 7XX MARCu21<br/>
      pokud má monografie autora a ilustrátora, element <name> se opakuje s různými rolemi`,
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
            nameIdentifier: {
              usage: 'RA',
              label: 'Identifikátor autora',
              selector: 'relatedItem/name/nameIdentifier',
              labelKey: 'relatedItem/name/nameIdentifier',
              cols: 2,
              description: `Číslo národní autority`,
            },
            affiliation: {
              usage: 'O',
              label: 'Napojená instituce',
              selector: 'relatedItem/name/affiliation',
              labelKey: 'relatedItem/name/affiliation',
              description: `Umožňuje vepsat název instituce, se kterou je autor spojen<br/>
          např.: Slezská univerzita v Opavě, Ústav pro studium totalitních režimů, Katedra politologie při Filosofické fakultě University Palackého, apod.`
            },
            etal: {
              usage: 'O',
              label: 'Etal',
              selector: 'relatedItem/relatedItem/name/etal',
              labelKey: 'relatedItem/name/etal',
              cols: 2,
              description: `Element indikující, že existuje více autorů, než pouze ti, kteří byli uvedeni v <name> elementu.</br>
          V případě užití tohoto elementu je dále top element <name> neopakovatelný.</br>
          <etal> je nutné umístit do samostatného top elementu <name>, ve kterém se nesmí objevit subelementy <namePart> a <nameIdentifier>.`
            },
            role: {
              usage: 'MA',
              label: 'Role',
              selector: 'relatedItem/name/role/roleTerm',
              labelKey: 'relatedItem/name/role/roleTerm',
              expanded: true,
              description: `Specifikace role osoby nebo organizace<br/>
          Kód role z kontrolovaného slovníku rolí
          (<a href=\"http://www.loc.gov/marc/relators/relaterm.html\" target=\"_blank\">http://www.loc.gov/marc/relators/relaterm.html</a>)`,
              fields: {},
            }
          }
        },
        subject: {
          usage: 'RA',
          label: 'Věcné třídění',
          selector: 'relatedItem/subject',
          labelKey: 'relatedItem/subject',
          description: `Údaje o věcném třídění<br/>
      Předpokládá se přebírání z katalogizačního záznamu`,
          fields: {
            authority: {
              usage: 'MA',
              label: 'Autorita',
              selector: 'relatedItem/subject/@authority',
              labelKey: 'relatedItem/subject/@authority',
              description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong>, <strong>Konspekt</strong><br/>
          Odpovídá hodnotě v $2`,
              options: [
                ['', '-'],
                ['czenas', 'czenas'],
                ['eczenas', 'eczenas'],
                ['mednas', 'mednas'],
                ['czmesh', 'czmesh'],
                ['msvkth', 'msvkth'],
                ['agrovoc', 'agrovoc'],
                ['Konspekt', 'Konspekt'],
              ]
            },
            topic: {
              usage: 'R',
              label: 'Klíčové slovo/Předmětové heslo',
              selector: 'relatedItem/subject/topic',
              labelKey: 'relatedItem/subject/topic',
              description: `Libovolný výraz specifikující nebo charakterizující obsah vnitřní části<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21`
            },
            geographic: {
              usage: 'O',
              label: 'Geografické věcné třídění',
              selector: 'relatedItem/subject/geographic',
              labelKey: 'relatedItem/subject/geographic',
              description: `Geografické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (geografický termín) nebo obsah pole 651 záznamu MARC21`
            },
            temporal: {
              usage: 'R',
              label: 'Chronologické věcné třídění',
              selector: 'relatedItem/subject/temporal',
              labelKey: 'relatedItem/subject/temporal',
              description: `Chronologické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (chronologický údaj) nebo obsah pole 648 záznamu MARC21`
            },
            name: {
              usage: 'R',
              label: 'Jméno použité jako věcné záhlaví',
              selector: 'relatedItem/subject/name',
              labelKey: 'relatedItem/subject/name',
              description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21`,
              fields: {
                type: {
                  usage: 'M',
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
                nameIdentifier: {
                  usage: 'MA',
                  label: 'Identifikátor autora',
                  selector: 'name/nameIdentifier',
                  labelKey: 'name/nameIdentifier',
                  cols: 2,
                  description: `Číslo národní autority`,
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
            }
          }
        },
        language: {
          usage: 'R',
          label: 'Jazyk',
          selector: 'relatedItem/language',
          labelKey: 'relatedItem/language',
          description: `Údaje o jazyce dokumentu`,
          fields: {
            language: {
              usage: 'MA',
              label: 'Jazyk',
              selector: 'relatedItem/language/languageTerm',
              labelKey: 'relatedItem/language/languageTerm',
              description: `Přesné určení jazyka`
            }
          }
        },
        physicalDescription: {
          usage: 'R',
          label: 'Fyzický popis',
          selector: 'relatedItem/physicalDescription',
          labelKey: 'relatedItem/physicalDescription',
          description: `Obsahuje údaje o fyzickém popisu zdroje/předlohy`,
          fields: {
            digitalOrigin: {
              usage: 'MA',
              label: 'Zdroje digitálního dokumentu',
              selector: 'relatedItem/physicalDescription/digitalOrigin',
              labelKey: 'relatedItem/physicalDescription/digitalOrigin',
              description: `Indikátor zdroje digitálního dokumentu hodnota <strong>born digital</strong>`,
              options: [
                ['', '-'],
                ['born digital', 'born digital']
              ]
            },
            form: {
              usage: 'RA',
              label: 'Forma',
              selector: 'relatedItem/physicalDescription/form',
              labelKey: 'relatedItem/physicalDescription/form',
              description: `Údaje o fyzické podobě dokumentu, např. print, electronic, microfilm apod.<br/>
          odpovídá hodnotě v poli 008/23
          `,
              fields: {
                authority: {
                  usage: 'MA',
                  label: 'Autorita',
                  selector: 'relatedItem/physicalDescription/form/@authority',
                  labelKey: 'relatedItem/physicalDescription/form/@authority',
                  description: `Možné hodnoty
              <ul>
                <li><strong>marcform</strong></li>
                <li><strong>marccategory</strong></li>
                <li><strong>marcsmd</strong></li>
                <li><strong>gmd</strong></li>
                <li><strong>Konspekt</strong></li>
              </ul>`,
                  options: [
                    ['marcform', 'marcform'],
                    ['marccategory', 'marccategory'],
                    ['marcsmd', 'marcsmd'],
                    ['gmd', 'gmd'],
                    ['Konspekt', 'Konspekt']
                  ]
                },
                value: {
                  usage: 'RA',
                  selector: 'relatedItem/physicalDescription/form/value',
                  labelKey: 'relatedItem/physicalDescription/form/value',
                  label: 'Hodnota',
                  help: 'off'
                }
              }
            }
          }
        },
        genre: {
          usage: 'MA',
          label: 'Žánr',
          selector: 'relatedItem/genre',
          labelKey: 'relatedItem/genre',
          description: `Bližší údaje o typu dokumentu`,
          fields: {
            value: {
              usage: 'MA',
              selector: 'relatedItem/genre/value',
              labelKey: 'relatedItem/genre/value',
              cols: 2,
              label: 'Hodnota',
              help: 'off'
            },
            type: {
              usage: 'R',
              label: 'Typ',
              selector: 'relatedItem/genre/@type',
              labelKey: 'relatedItem/genre/@type',
              cols: 2,
              description: `Možnost vyplnit bližší určení typu oddílu (možnost použít DTD monografie, MonographComponentPart Types)`,
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
                ['unspecified', 'nespecifikován']
              ]
            }
          }
        },
        identifier: {
          usage: 'MA',
          label: 'Identifikátor',
          selector: 'relatedItem/identifier',
          labelKey: 'relatedItem/identifier',
          description: `Údaje o identifikátorech, obsahuje unikátní
      identifikátory mezinárodní nebo lokální, které svazek monografie má.`,
          fields: {
            type: {
              usage: 'MA',
              label: 'Typ',
              selector: 'relatedItem/identifier/@type',
              labelKey: 'relatedItem/identifier/@type',
              cols: 2,
              description: `Budou se povinně vyplňovat následující
          hodnoty, pokud existují:
            <ul>
              <li>
                <strong>UUID</strong> (uuid) <i>M</i><br/>
                vygeneruje dodavatel
              </li>
              <li>
                <strong>URN:NBN</strong> (urnnbn) <i>M</i><br/>
                pro URN:NBN, např. zápis ve tvaru urn:nbn:cz:nk-123456 pro projekt NDK
              </li>
              <li>
                <strong>čČNB</strong> (ccnb) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 015, $a, $z
              </li>
              <li>
                <strong>ISBN</strong> (isbn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 020, $a, $z
              </li>
              <li>
                <strong>ISMN</strong> (ismn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 024 (1. ind.="2"), $a, $z
              </li>
            </ul>
            Jiný interní identifikátor <i>R</i>, např. barcode, oclc, sysno, permalink`
            },
            validity: {
              usage: 'MA',
              label: 'Platnost',
              selector: 'relatedItem/identifier/@invalid',
              labelKey: 'relatedItem/identifier/@invalid',
              cols: 2,
              description: `Uvádějí se i neplatné resp. zrušené identifikátory
          <ul>
            <li>
              <strong>Platný</strong> <code>identifier/[not(@invalid)]</code>
            </li>
            <li>
              <strong>Neplatný</strong> <code>identifier/[@invalid='yes']</code>
            </li>
          </ul>`
            },
            value: {
              usage: 'MA',
              selector: 'relatedItem/identifier/value',
              labelKey: 'relatedItem/identifier/value',
              label: 'Hodnota',
              help: 'off'
            }
          }
        },
        note: {
          usage: 'O',
          label: 'Poznámka',
          selector: 'relatedItem/note',
          labelKey: 'relatedItem/note',
          description: `Obecná poznámka k titulu periodika jako celku<br/>
      Odpovídá hodnotám v poli 245, $c (statement of responsibility)
      a v polích 5XX (poznámky) katalogizačního záznamu`,
          fields: {
            note: {
              usage: 'RA',
              selector: 'relatedItem/note/value',
              labelKey: 'relatedItem/note/value',
              label: 'Poznámka',
              help: 'off'
            }
          }
        },
        abstract: {
          usage: 'RA',
          label: 'Abstrakt',
          selector: 'relatedItem/abstract',
          labelKey: 'relatedItem/abstract',
          description: `Shrnutí obsahu jako celku odpovídá poli 520 MARC21`,
          fields: {
            abstract: {
              usage: 'R',
              label: 'Abstrakt',
              selector: 'relatedItem/abstract',
              labelKey: 'relatedItem/abstract/value',
              help: 'off'
            }
          }
        },
        classification: {
          usage: 'R',
          label: 'Klasifikace',
          selector: 'relatedItem/classification',
          labelKey: 'relatedItem/classification',
          description: `Klasifikační údaje věcného třídění podle Mezinárodního desetinného třídění<br/>
      odpovídá poli 080 MARC21`,
          fields: {
            authority: {
              usage: 'MA',
              label: 'Autorita',
              selector: 'relatedItem/classification/@authority',
              labelKey: 'relatedItem/classification/@authority',
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
              usage: 'MA',
              label: 'Vydání',
              selector: 'relatedItem/classification/@edition',
              labelKey: 'relatedItem/classification/@edition',
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
              selector: 'relatedItem/classification/value',
              labelKey: 'relatedItem/classification/value',
              label: 'Hodnota',
              help: 'off'
            }
          }
        },
        location: {
          usage: 'MA',
          label: 'Uložení',
          selector: 'relatedItem/location',
          labelKey: 'relatedItem/location',
          description: `Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.`,
          fields: {
            url: {
              usage: 'MA',
              label: 'URL',
              selector: 'relatedItem/location/url',
              labelKey: 'relatedItem/location/url',
              description: `Pro uvedení lokace elektronického dokumentu`,
              fields: {
                value: {
                  usage: 'MA',
                  selector: 'relatedItem/location/url/value',
                  labelKey: 'relatedItem/location/url/value',
                  label: 'Hodnota',
                  help: 'off'
                },
                note: {
                  usage: 'R',
                  selector: 'relatedItem/location/url/@note',
                  labelKey: 'relatedItem/location/url/@note',
                  cols: 2,
                  label: 'Note',
                  help: 'off'
                },
                usage: {
                  usage: 'R',
                  cols: 2,
                  selector: 'relatedItem/location/url/@usage',
                  labelKey: 'relatedItem/location/url/@usage',
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
        part: {
          usage: 'MA',
          label: 'Popis části',
          selector: 'relatedItem/part',
          labelKey: 'relatedItem/part',
          description: `Popis části, pokud je svazek části souboru,element může být využit jen na zaznamenání<caption>.`,
          fields: {
            extent: {
              usage: 'MA',
              label: 'Extent',
              selector: 'relatedItem/part/extent',
              labelKey: 'relatedItem/part/extent',
              description: `Tento kontejner <part> slouží k zaznamenání rozsahu stran v reprezentaci.`,
              fields: {
                start: {
                  usage: 'MA',
                  label: 'Od strany',
                  cols: 2,
                  selector: 'relatedItem/part/extent/start',
                  labelKey: 'relatedItem/part/extent/start',
                  description: `První stránka, na které vnitřní část začíná.`
                },
                end: {
                  usage: 'MA',
                  label: 'Do strany',
                  cols: 2,
                  selector: 'relatedItem/part/extent/end',
                  labelKey: 'relatedItem/part/extent/end',
                  description: `Poslední stránka, na které vnitřní část končí.`
                }
              }
            }
          }
        },
      }
    }
  };
}
