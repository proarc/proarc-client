export class NdkArticleAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      description: `Název vnitřní části<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má monografie více typů názvů, element se opakuje podle potřeby`,
      fields: {
        nonSort: {
          usage: "O",
          label: 'Část vynechaná při hledání',
          selector: 'titleInfo/nonSort',
          cols: 2,
          description: `Část názvu, která má být vynechána při vyhledávána<br/>
          např.:
          <ul>
            <li><nonSort>The</nonSort></li>
            <li><title>Beatles</title></li>
          </ul>`,
        },
        title: {
          usage: "M",
          label: 'Název',
          selector: 'titleInfo/title',
          description: `Názvová informace – název vnitřní části</br>
          hodnoty převzít z katalogu<br/>
          pokud není titul, nutno vyplnit hodnotu <strong>untitled</strong>`
        },
        subTitle: {
          usage: "MA",
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          description: `Podnázev vnitřní části`
        },
        partNumber: {
          usage: "MA",
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          cols: 2,
          description: `V případě, že se jedná o vícesvazkovou monografii, je zde uvedeno číslo svazku`
        },
        partName: {
          usage: "MA",
          label: 'Název části',
          selector: 'titleInfo/partName',
          cols: 2,
          description: `V případě, že se jedná o vícesvazkovou monografii, je zde uveden název svazku<br/>
          odpovídající pole a podpole podle typu, viz typ`
        }
      }
    },
    name: {
      usage: "MA",
      label: "Autor",
      selector: 'name',
      description: `Údaje o odpovědnosti za svazek<br/>
      POZOR – údaje o odpovědnosti nutno přebírat z polí 1XX a 7XX MARCu21<br/>
      pokud má monografie autora a ilustrátora, element <name> se opakuje s různými rolemi`,
      fields: {
        type: {
          usage: "MA",
          label: "Typ",
          selector: 'name/@type',
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
        name: {
          usage: "MA",
          label: "Celé jméno",
          selector: 'name/namePart[not(@type)]',
          description: `Vyplnit pokud nelze rozlišit křestní jméno a příjmení.`
        },
        given: {
          usage: "MA",
          label: "Křestní",
          selector: "name/namePart[@type='given']",
          cols: 2,
          description: `Údaje o křestním jméně.<br/>
          V případě více křestních jmen se doporučuje
          uvést je společně ve stejném elementu , např. hodnota "Jan Amos"`
        },
        family: {
          usage: "MA",
          label: "Příjmení",
          selector: "name/namePart[@type='family']",
          cols: 2,
          description: `Údaje o příjmení.`
        },
        date: {
          usage: "RA",
          label: "Datum",
          selector: "name/namePart[@type='date']",
          cols: 2,
          description: `Životopisná data autora<br/>
          Pokud známe datum narození a úmrtí autora, vyplnit ve tvaru RRRR-RRRR.`
        },
        termsOfAddress: {
          usage: "RA",
          label: "Adresa",
          selector: "name/namePart[@type='termsOfAddress']",
          cols: 2,
          description: `Adresa.`
        },
        nameIdentifier: {
          usage: "MA",
          label: "Identifikátor autora",
          selector: "name/nameIdentifier",
          cols: 2,
          description: `Číslo národní autority`,
        },
        etal: {
          usage: "O",
          label: "Etal",
          selector: "name/etal",
          cols: 2,
          description: `Element indikující, že existuje více autorů, než pouze ti, kteří byli uvedeni v <name> elementu.</br>
          V případě užití tohoto elementu je dále top element <name> neopakovatelný.</br>
          <etal> je nutné umístit do samostatného top elementu <name>, ve kterém se nesmí objevit subelementy <namePart> a <nameIdentifier>.`
        },
        affiliation: {
          usage: "O",
          label: "Napojená instituce",
          selector: "name/affiliation",
          description: `Umožňuje vepsat název instituce, se kterou je autor spojen<br/>
          např.: Slezská univerzita v Opavě, Ústav pro studium totalitních režimů, Katedra politologie při Filosofické fakultě University Palackého, apod.`
        },
        role: {
          usage: "MA",
          label: "Role",
          selector: 'name/role/roleTerm',
          expanded: true,
          description: `Specifikace role osoby nebo organizace<br/>
          Kód role z kontrolovaného slovníku rolí
          (<a href=\"http://www.loc.gov/marc/relators/relaterm.html\" target=\"_blank\">http://www.loc.gov/marc/relators/relaterm.html</a>)`,
          fields: {},
        }
      }
    },
    subject: {
      usage: "R",
      label: "Věcné třídění",
      selector: 'subject',
      description: `Údaje o věcném třídění<br/>
      Předpokládá se přebírání z katalogizačního záznamu`,
      fields: {
        authority: {
          usage: "R",
          label: "Autorita",
          selector: 'subject/@authority',
          description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong><br/>
          Odpovídá hodnotě v $2`,
          options: [
            ['', '-'],
            ['czenas', 'czenas'],
            ['eczenas', 'eczenas'],
            ['mednas', 'mednas'],
            ['czmesh', 'czmesh'],
            ['msvkth', 'msvkth'],
            ['agrovoc', 'agrovoc'],
          ]
        },
        topic: {
          usage: "R",
          label: "Klíčové slovo/Předmětové heslo",
          selector: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah vnitřní části<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21`
        },
        geographic: {
          usage: "R",
          label: "Geografické věcné třídění",
          selector: 'subject/geographic',
          description: `Geografické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (geografický termín) nebo obsah pole 651 záznamu MARC21`
        },
        temporal: {
          usage: "R",
          label: "Chronologické věcné třídění",
          selector: 'subject/temporal',
          description: `Chronologické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (chronologický údaj) nebo obsah pole 648 záznamu MARC21`
        },
        name: {
          usage: "R",
          label: "Jméno použité jako věcné záhlaví",
          selector: 'subject/name',
          description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21<br/>
          Struktura a atributy stejné jako pro údaje o původcích – viz element <name>`
        },
      }
    },
    language: {
      usage: "MA",
      label: "Jazyk",
      selector: 'language',
      description: `Údaje o jazyce dokumentu`,
      fields: {
        language: {
          usage: "M",
          label: "Jazyk",
          selector: 'language/languageTerm',
          description: `Přesné určení jazyka`
        }
      }
    },
    physicalDescription: {
      usage: "R",
      label: "Fyzický popis",
      selector: "physicalDescription",
      description: `Obsahuje údaje o fyzickém popisu zdroje/předlohy`,
      fields: {
        form: {
          usage: "R",
          label: "Forma",
          selector: "physicalDescription/form",
          description: `Údaje o fyzické podobě dokumentu, např. print, electronic, microfilm apod.<br/>
          odpovídá hodnotě v poli 008/23
          `,
          fields: {
            authority: {
              usage: "M",
              label: "Autorita",
              selector: "physicalDescription/form/@authority",
              description: `Možné hodnoty
              <ul>
                <li><strong>marcform</strong></li>
                <li><strong>marccategory</strong></li>
                <li><strong>marcsmd</strong></li>
                <li><strong>gmd</strong></li>
              </ul>`,
              options: [
                ['marcform', 'marcform'],
                ['marccategory', 'marccategory'],
                ['marcsmd', 'marcsmd'],
                ['gmd', 'gmd']]
            },
            value: {
              usage: "M",
              label: "Hodnota",
              help: "off"
            }
          }
        }
      }
    },
    note: {
      usage: "RA",
      label: "Poznámka",
      selector: "note",
      description: `Obecná poznámka ke vnitřní části<br/>
      Odpovídá hodnotám v poli 245, $c (statement of responsibility)
      a v polích 5XX (poznámky) katalogizačního záznamu`,
      fields: {
        note: {
          usage: "RA",
          label: "Poznámka",
          help: "off"
        }
      }
    },
    abstract: {
      usage: "R",
      label: "Abstrakt",
      selector: "abstract",
      description: `Shrnutí obsahu jako celku odpovídá poli 520 MARC21`,
      fields: {
        abstract: {
          usage: "R",
          label: "Abstrakt",
          selector: "abstract",
          help: "off"
        }
      }
    },
    genre: {
      usage: "M",
      label: "Žánr",
      selector: "genre",
      description: `Bližší údaje o typu dokumentu<br/>
      Pro monografie hodnota <strong>volume</strong>`,
      fields: {
        value: {
          usage: "M",
          label: "Hodnota",
          help: "off"
        },
        type: {
          usage: "R",
          label: "Typ",
          selector: "genre/@type",
          cols: 2,
          description: `Možnost vyplnit bližší určení typu oddílu (možnost použít DTD monografie, MonographComponentPart Types)`,
          options: [
            ['news', 'news'],
            ['table of content', 'table of content'],
            ['advertisement', 'advertisement'],
            ['abstract', 'abstract'],
            ['introduction', 'introduction'],
            ['review', 'review'],
            ['dedication', 'dedication'],
            ['bibliography', 'bibliography'],
            ['editorsNote', 'editorsNote'],
            ['preface', 'preface'],
            ['mainarticle', 'mainarticle'],
            ['index', 'index'],
            ['unspecified', 'unspecified'],
          ]
        }
      }
    },
    identifier: {
      usage: "M",
      label: "Identifikátor",
      selector: "identifier",
      description: `Údaje o identifikátorech, obsahuje unikátní
      identifikátory mezinárodní nebo lokální, které svazek monografie má.`,
      fields: {
        type: {
          usage: "M",
          label: "Typ",
          selector: "identifier/@type",
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
          usage: "MA",
          label: "Platnost",
          selector: "dentifier/@invalid",
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
          usage: "M",
          label: "Hodnota",
          help: "off"
        }
      }
    },
    classification: {
      usage: "RA",
      label: "Klasifikace",
      selector: "identifier",
      description: `Klasifikační údaje věcného třídění podle Mezinárodního desetinného třídění<br/>
      odpovídá poli 080 MARC21
      `,
      fields: {
        authority: {
          usage: "M",
          label: "Autorita",
          selector: "classification/@authority",
          description: `Vyplnit hodnotu <strong>udc</strong>`,
          options: [
            ['udc', 'udc'],
          ]
        },
        value: {
          usage: "M",
          label: "Hodnota",
          help: "off"
        }
      }
    },
    part: {
      usage: "O",
      label: "Popis části",
      selector: 'part',
      description: `Popis části, pokud je svazek části souboru,element může být využit jen na zaznamenání<caption>.`,
      fields: {
        type: {
          usage: "O",
          label: "Typ",
          selector: "part/@type",
          description: `Hodnota bude vždy "volume" `,
          options: [
            ['volume', 'volume']
          ]
        },
        caption: {
          usage: "RA",
          label: "Caption",
          selector: "part/detail/caption",
          description: `text před označením čísla, např. "č.", „část“, "No." apod.`
        },
      }
    },
    recordInfo: {
      usage: "M",
      label: "Údaje o metadatovém záznamu",
      selector: 'recordInfo',
      description: `údaje o metadatovém záznamu – jeho vzniku, změnách apod.`,
      fields: {
        descriptionStandard: {
          usage: "MA",
          label: "Standard metadat",
          selector: 'recordInfo/descriptionStandard',
          description: `Popis standardu, ve kterém je přebíraný katalogizační záznam<br/>
            Pro záznamy v AACR2: Odpovídá hodnotě návěští záznamu MARC21, pozice 18 - hodnota „aacr“, tj. pro LDR/18 ="a"`,
          options: [
            ['aacr', 'aacr']
          ]
        },
        recordContectSource: {
          usage: "R",
          label: "Contect source",
          selector: 'recordInfo/recordContectSource',
          description: `Kód nebo jméno instituce, která záznam vytvořila nebo změnila`,
          fields: {
            recordContectSource: {
              usage: "R",
              label: "Contect source",
              selector: "recordInfo/recordContectSource",
              help: "off"
            },
            authority: {
              usage: "R",
              label: "Autorita",
              selector: "recordInfo/recordContectSource/@authority",
              description: `authority – hodnota "marcorg"`,
              options: [
                ['marcorg', 'marcorg']
              ]
            }
          }
        },
        recordCreationDate: {
          usage: "M",
          label: "Datum vytvoření",
          selector: 'recordInfo/recordCreationDate',
          description: `datum prvního vytvoření záznamu, na úroveň minut`,
          fields: {
            recordCreationDate: {
              usage: "M",
              label: "Datum vytvoření",
              selector: "recordInfo/recordCreationDate",
              help: "off"
            },
            encoding: {
              usage: "M",
              label: "Kódování",
              selector: "recordInfo/recordCreationDate/@encoding",
              description: `Záznam bude podle normy ISO 8601 na úroveň minut, hodnota atributu tedy "iso8601"`,
              options: [
                ['iso8601', 'iso8601']
              ]
            }
          }
        },
        recordChangeDate: {
          usage: "MA",
          label: "Datum změny",
          selector: 'recordInfo/recordChangeDate',
          description: `datum změny záznamu `,
          fields: {
            recordChangeDate: {
              usage: "MA",
              label: "Datum změny",
              selector: "recordInfo/recordChangeDate",
              help: "off"
            },
            encoding: {
              usage: "M",
              label: "Kódování",
              selector: "recordInfo/recordChangeDate/@encoding",
              description: `Záznam bude podle normy ISO 8601 na úroveň minut, hodnota atributu tedy "iso8601"`,
              options: [
                ['iso8601', 'iso8601']
              ]
            }
          }
        },
        recordIdentifier: {
          usage: "R",
          label: "Identifikátor záznamu",
          selector: 'recordInfo/recordIdentifier',
          description: `identifikátor záznamu v katalogu, přebírá se z pole 001`,
          fields: {
            recordIdentifier: {
              usage: "MA",
              label: "Identifikátor záznamu",
              selector: "recordInfo/recordIdentifier",
              help: "off"
            },
            source: {
              usage: "R",
              label: "Zdroj",
              selector: "recordInfo/recordIdentifier/@source",
              description: `hodnota se přebírá z katalogu pole 003 `
            }
          }
        },
        recordOrigin: {
          usage: "R",
          label: "Údaje o vzniku záznamu",
          selector: 'recordInfo/recordOrigin',
          description: `údaje o vzniku záznamu hodnoty: "machine generated" nebo "human prepared"`,
          options: [
            ['machine generated', 'machine generated'],
            ['human prepared', 'human prepared']
          ]
        },
        languageOfCataloging: {
          usage: "R",
          label: "Jazyk záznamu",
          selector: 'recordInfo/languageOfCataloging',
          description: `jazyk katalogového záznamu`,
          fields: {
            languageOfCataloging: {
              usage: "R",
              label: "Jazyk záznamu",
              selector: "recordInfo/languageOfCataloging",
              help: "off"
            },
            languageTerm: {
              usage: "R",
              label: "Zdroj",
              selector: "recordInfo/languageOfCataloging/languageTerm",
              description: `přebírá se z katalogu - pole 40 $b`
            },
            authority: {
              usage: "R",
              label: "Autorita",
              selector: "recordInfo/languageOfCataloging/languageTerm/@authority",
              description: `authority – hodnota "iso639-2b"`,
              options: [
                ['iso639-2b', 'iso639-2b']
              ]
            }
          }
        },
      }
    }
  }
}