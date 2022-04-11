export class NdkMonographVolumeAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      description: `Název svazku monografie<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má monografie více typů názvů, element se opakuje podle potřeby`,
      fields: {
        type: {
          usage: "MA",
          label: 'Typ',
          selector: 'titleInfo/@type',
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
            ['abbreviated', 'Zkrácený název'],
            ['translated', 'Přeložený název'],
            ['alternative', 'Alternativní název'],
            ['uniform', 'Jednotný název']
          ]
        },
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
          description: `Názvová informace – název svazku monografie</br>
          hodnoty převzít z katalogu<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        subTitle: {
          usage: "MA",
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          cols: 2,
          description: `Podnázev svazku monografie<br/>
          odpovídající pole a podpole podle typu, viz typ`
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
        nameIdentifier: {
          usage: "MA",
          label: "Identifikátor autora",
          selector: "name/nameIdentifier",
          cols: 2,
          description: `Číslo národní autority`,
        },
        etal: {
          usage: "MA",
          label: "Etal",
          selector: "name/etal",
          cols: 2,
          description: `Element indikující, že existuje více autorů, než pouze ti, kteří byli uvedeni v <name> elementu.</br>
          V případě užití tohoto elementu je dále top element <name> neopakovatelný.</br>
          <etal> je nutné umístit do samostatného top elementu <name>, ve kterém se nesmí objevit subelementy <namePart> a <nameIdentifier>.`
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
    originInfo: {
      usage: "M",
      label: "Nakladatel",
      selector: 'originInfo',
      description: `Informace o původu předlohy`,
      fields: {
        publisher: {
          usage: "MA",
          label: "Nakladatel",
          selector: 'originInfo/publisher',
          description: `Jméno entity, která dokument vydala, vytiskla nebo jinak vyprodukovala<br/>
            Odpovídá poli 260 $b katalogizačního záznamu v MARC21.<br/>
            Pokud má monografie více vydavatelů, přebírají se za záznamu všichni (jsou v jednom poli 260).`,
        },
        dateIssued: {
          usage: "M",
          label: "Datum vydání",
          selector: 'originInfo/dateIssued',
          cols: 2,
          description: `Datum vydání předlohy.<br/>
            Přebírat z katalogu.<br/>
            Odpovídá hodnotě z katalogizačního záznamu, pole 260, $c a pole 008/07-10`,
        },
        qualifier: {
          usage: "R",
          label: "Upřesnění data",
          selector: 'originInfo/dateIssued/@qualifier',
          cols: 2,
          description: `Možnost dalšího upřesnění. Možné hodnoty
            <ul>
              <li>Přibližné (approximate)</li>
              <li>Odvozené (inferred)</li>
              <li>Sporné (questionable)</li>
            </ul>`,
          options: [
            ['', '-'],
            ['approximate', 'Datum je přibližné'],
            ['inferred', 'Datum je odvozené'],
            ['questionable', 'Datum je sporné']
          ]
        },
        encoding: {
          usage: "R",
          label: "Kódování",
          selector: 'originInfo/dateIssued/@encoding',
          cols: 2,
          description: `Hodnota "marc" jen u údaje z pole 008`,
          options: [
            ['', '-'],
            ['marc', 'marc']
          ]
        },
        point: {
          usage: "MA",
          label: "Point",
          selector: 'originInfo/dateIssued/@point',
          cols: 2,
          description: `Hodnoty "start" resp. "end" jen u údaje z pole 008, pro rozmezí dat`,
          options: [
            ['', '-'],
            ['start', 'start'],
            ['end', 'end']
          ]
        },
        edition: {
          usage: "R",
          label: "Edice",
          selector: 'originInfo/edition',
          cols: 2,
          description: `Údaj o pořadí vydání, odpovídá poli 250 $a katalogizačního záznamu.`
        },
        issuance: {
          usage: "M",
          label: "Vydání",
          selector: 'originInfo/issuance',
          cols: 2,
          description: `Údaje o vydávání odpovídá hodnotě uvedené v návěští MARC21 na pozici 07<br/>
            Možné hodnoty
            <ul>
              <li>Monografické (monographic)</li>
              <li>Vícedílné (multipart monograph)</li>
              <li>Jednotkové (single unit)</li>
            </ul>`,
          options: [
            ['', '-'],
            ['monographic', 'Monografické'],
            ['single unit', 'Jednotkové'],
            ['multipart monograph', 'Vícedílné']
          ]
        },
        place: {
          usage: "MA",
          label: "Místo",
          selector: 'originInfo/place/placeTerm',
          cols: 2,
          description: `Údaje o místě spojeném s vydáním, výrobou nebo původem popisovaného dokumentu.<br/>
            Odpovídá hodnotám z katalogizačního záznamu, pole 260, $a resp. pole 008/15-17`,
          fields: {
            authority: {
              usage: "MA",
              label: "Autorita",
              selector: "originInfo/place/placeTerm/@authority",
              options: [
                ['marccountry', 'marccountry']]
            },
            type: {
              usage: "M",
              label: "Typ",
              selector: "originInfo/place/placeTerm/@type",
              options: [
                ['code', 'code'],
                ['text', 'text']]
            },
            value: {
              usage: "M",
              label: "Hodnota",
              help: "off"
            }
          }
        },
        dateCreated: {
          usage: "R",
          label: "Datum vytvoření",
          selector: 'originInfo/dateCreated',
          cols: 2,
          description: `Datum vydání předlohy pro rukopisy.<br/>
          přebírat z katalogu; odpovídá hodnotě z katalogizačního záznamu, pole 264_0 $c pokud je LDR/06="d", "f", "t"`
        },
      }
    },
    location: {
      usage: "MA",
      label: "Uložení",
      selector: 'location',
      description: `Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.`,
      fields: {
        physicalLocation: {
          usage: "M",
          label: "Místo uložení",
          selector: 'location/physicalLocation',
          description: `Údaje o instituci, kde je fyzicky uložen daný konkrétní popisovaný dokument, např. NK ČR nutno použít kontrolovaný slovník – sigly knihovnen (ABA001 atd.) odpovídá poli 910 $a v MARC21<br\>
          Pozn. u dokumentů v digitální podobě není možné vyplnit`,
        },
        shelfLocator: {
          usage: "M",
          label: "Signatura",
          selector: 'location/shelfLocator',
          description: `Signatura nebo lokační údaje o daném konkrétním dokumentu, který slouží jako předloha.`
        },
        url: {
          usage: "O",
          label: "URL",
          selector: 'location/url',
          description: `Pro uvedení lokace elektronického dokumentu`
        },
        note: {
          usage: "O",
          label: "Poznámka",
          selector: 'location/url/@note',
          description: `Pro poznámku o typu URL (na plný text, abstrakt apod.)`,
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
          description: `Libovolný výraz specifikující nebo charakterizující obsah svazku monografie<br/>
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
          label: "Jméno použité jako všcné záhlaví",
          selector: 'subject/name',
          description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21<br/>
          Struktura a atributy stejné jako pro údaje o původcích – viz element <name>`
        }
      }
    },
    language: {
      usage: "M",
      label: "Jazyk",
      selector: 'language',
      description: `Údaje o jazyce dokumentu`,
      fields: {
        objectPart: {
          usage: "MA",
          label: "Část",
          selector: 'language/@objectPart',
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
          usage: "M",
          label: "Jazyk",
          selector: 'language/languageTerm',
          description: `Přesné určení jazyka`
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
          usage: "RA",
          label: "Abstrakt",
          selector: "abstract",
          help: "off"
        }
      }
    },
    physicalDescription: {
      usage: "M",
      label: "Fyzický popis",
      selector: "physicalDescription",
      description: `Obsahuje údaje o fyzickém popisu zdroje/předlohy`,
      fields: {
        extent: {
          usage: "RA",
          label: "Rozsah",
          selector: "physicalDescription/extent",
          description: `Údaje o rozsahu (stran, svazků nebo rozměrů)<br/>
          odpovídá hodnotě v poli 300, $a, $b a $c<br/>
          počet stránek bude vyjádřen ve fyzické strukturální mapě`,
        },
        note: {
          usage: "RA",
          label: "Poznámka",
          selector: "physicalDescription/note",
          description: `Poznámka o fyzickém stavu dokumentu`,
        },
        form: {
          usage: "M",
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
      description: `Obecná poznámka ke svazku monografie jako celku<br/>
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
    genre: {
      usage: "M",
      label: "Žánr",
      selector: "genre",
      description: `Bližší údaje o typu dokumentu<br/>
      Pro monografie hodnota <strong>volume</strong>`,
      fields: {
        authority: {
          usage: "MA",
          label: "Autorita",
          selector: "genre/@authority",
          options: [
            ['czenas', 'czenas'],
            ['eczenas', 'eczenas'],
            ['rdacontent', 'rdacontent']]
        },
        value: {
          usage: "M",
          label: "Hodnota",
          help: "off"
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
      usage: "R",
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
    typeOfResource: {
      usage: "R",
      label: "Typ zdroje",
      selector: "typeOfResource",
      description: `Pro monografie hodnota <strong>text</strong><br/>
      mělo by se vyčítat z MARC21 katalogizačního záznamu, z pozice 06 návěští`,
      fields: {
        value: {
          usage: "R",
          label: "Typ zdroje",
          help: "off",
          options: [
            ['', '-'],
            ['text', 'text']
          ]
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
