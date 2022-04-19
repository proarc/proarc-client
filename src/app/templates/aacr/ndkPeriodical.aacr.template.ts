export class NdkPeriodicalAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      description: `Název titulu periodika<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má periodikum více typů názvů, element se opakuje podle potřeby`,
      fields: {
        type: {
          usage: "MA",
          label: 'Typ',
          selector: 'titleInfo/@type',
          cols: 2,
          description: `Hlavní název bez typu - pole 245 a $a<br/>
          Možné hodnoty
          <ul>
            <li>Zkrácený název (abbreviated) - pole 210</li>
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
          description: `Názvová informace – název titulu periodika</br>
          hodnoty převzít z katalogu<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        subTitle: {
          usage: "MA",
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          description: `Podnázev titulu periodika<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        partNumber: {
          usage: "MA",
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          cols: 2,
          description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik`
        },
        partName: {
          usage: "R",
          label: 'Název části',
          selector: 'titleInfo/partName',
          cols: 2,
          description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik<br/>
          odpovídající pole a podpole podle typu, viz typ`
        }
      }
    },
    name: {
      usage: "R",
      label: "Autor",
      selector: 'name',
      description: `Údaje o odpovědnosti za titul periodika`,
      fields: {
        type: {
          usage: "R",
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
            ['personal','Osoba'],
            ['corporate','Organizace'],
            ['conference','Konference'],
            ['family','Rodina']
          ]
        },
        name: {
          usage: "R",
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
      label: "Původ předlohy",
      selector: 'originInfo',
      description: `Informace o původu předlohy`,
      fields: {
        publisher: {
          usage: "MA",
          label: "Nakladatel",
          selector: 'originInfo/publisher',
          description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 264 $b katalogizačního záznamu v MARC21<br/>
            pokud má periodikum více vydavatelů, přebírají se ze záznamu všichni (v jednom poli 260)`,
        },
        dateIssued: {
            usage: "M",
            label: "Datum vydání",
            selector: 'originInfo/dateIssued',
            cols: 2,
            description:`Datum vydání předlohy, nutno zaznamenat rok/roky, v nichž časopis vycházel - formu zápisu přebírat z katalogu (např. 1900-1939)<br/>
            dpovídá hodnotě z katalogizačního záznamu, pole 260 $c a polí 008/07-10 a 008/11-14`
        },
        qualifier: {
          usage: "R",
          label: "Upřesnění data",
          selector: 'originInfo/dateIssued/@qualifier',
          cols: 2,
          description:`Možnost dalšího upřesnění. Možné hodnoty
            <ul>
              <li>Přibližné (approximate)</li>
              <li>Odvozené (inferred)</li>
              <li>Sporné (questionable)</li>
            </ul>`,
          options: [
            ['','-'],
            ['approximate','Datum je přibližné'],
            ['inferred','Datum je odvozené'],
            ['questionable','Datum je sporné']
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
        issuance: {
          usage: "M",
          label: "Vydání",
          selector: 'originInfo/issuance',
          cols: 2,
          description:`Údaje o vydávání odpovídá hodnotě uvedené v návěští MARC21 na pozici 07<br/>
          Možné hodnoty
          <ul>
            <li>Na pokračování (continuing)</li>
            <li>Sériové (serial)</li>
            <li>Integrační zdroj (integrating resource)</li>
          </ul>`,
          options: [
            ['', '-'],
            ['continuing','Na pokračování'],
            ['serial','Sériové'],
            ['integrating resource','Integrační zdroj']
          ]
        },
        place: {
            usage: "MA",
            label: "Místo",
            selector: 'originInfo/place/placeTerm',
            cols: 1,
            description:`Údaje o místě spojeném s vydáním, výrobou nebo původem popisovaného dokumentu.<br/>
            Odpovídá hodnotám z katalogizačního záznamu, pole 260, $a resp. pole 008/15-17`
        },
        dateCreated: {
          usage: "R",
          label: "Datum vytvoření",
          selector: 'originInfo/dateCreated',
          cols: 2,
          description:`Datum vydání předlohy pro rukopisy.<br/>
          přebírat z katalogu; odpovídá hodnotě z katalogizačního záznamu, pole 260 $c pokud je LDR/06="d", "f", "t"`
        },
        frequency: {
          usage: "R",
          label: "Frekvence",
          selector: 'originInfo/frequency',
          description: `údaje o pravidelnosti vydávání
          odpovídá údaji MARC21 v poli 310 nebo pozici 18 v poli 008`,
          fields: {
            authority: {
              usage: "R",
              label: "Autorita",
              selector: 'originInfo/frequency/@authority',
              options: [["marcfrequency", "marcfrequency"]]
            },
            value: {
              label: "Hodnota",
              usage: "R",
              selector: 'originInfo/frequency',
              help: 'off'
            }
          }
        }
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
          description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>Konspekt</strong>, <strong>czmesh</strong>, <strong>mednas</strong><br/>
          Odpovídá hodnotě v $2`,
          options: [
            ['', '-'],
            ['czenas','czenas'],
            ['eczenas','eczenas'],
            ['mednas','mednas'],
            ['czmesh','czmesh'],
            ['Konspekt','Konspekt']
          ]
        },
        topic: {
          usage: "R",
          label: "Klíčové slovo/Předmětové heslo",
          selector: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah periodika<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21 nebo obsah pole 072 $x`
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
      usage: "M",
      label: "Jazyk",
      selector: 'language',
      description: `Údaje o jazyce dokumentu`,
      fields: {
        objectPart: {
          usage: "MA",
          label: "Část",
          cols: 2,
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
          cols: 2,
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
          usage: "R",
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
          description: `Poznámka o fyzickém stavu dokumentu<br/>
          zde se zapíší defekty zjištěné při digitalizaci pro úroveň titulu periodika (např. chybějící ročník)`
        },
        form: {
          usage: "M",
          label: "Forma",
          selector: "physicalDescription/form",
          description: `Údaje o fyzické podobě dokumentu, např. print, electronic, microfilm apod.<br/>
          odpovídá hodnotě v poli 008/23<br/>
          Údaje o typu média a typu nosiče zdroje/předlohy odpovídá hodnotám z pole:
          <ul>
            <li>337 NEPOVINNÉ (hodnota např. "bez média" – viz <a href="https://www.nkp.cz/o-knihovne/odborne-cinnosti/zpracovani-fondu/katalogizacni-politika/typ-media_pole-337" target="_blank">kontrolovaný slovník</a> pole 337)</li>
            <li>338 POVINNÉ (hodnota např. "svazek" – viz <a href="https://www.nkp.cz/o-knihovne/odborne-cinnosti/zpracovani-fondu/katalogizacni-politika/typ-nosice-pole338-1" target="_blank">kontrolovaný slovník</a> pole 338)</li>
          </ul>
          `,
          fields: {
            authority: {
              usage: "M",
              label: "Autorita",
              selector: "physicalDescription/form/@authority",
              cols: 2,
              description: `Možné hodnoty
              <ul>
                <li><strong>marcform</strong></li>
                <li><strong>marccategory</strong></li>
                <li><strong>marcsmd</strong></li>
                <li><strong>gmd</strong></li>
                <li><strong>rdamedia</strong> (pro pole 337)</li>
                <li><strong>rdacarrier</strong> (pro pole 338)</li>
              </ul>`,
              options: [
                ['marcform', 'marcform'],
                ['marccategory', 'marccategory'],
                ['marcsmd', 'marcsmd'],
                ['gmd', 'gmd'],
                ['rdamedia', 'rdamedia'],
                ['rdacarrier', 'rdacarrier']]
            },
            type: {
              usage: "MA",
              label: "Typ",
              selector: "physicalDescription/form/@type",
              cols: 2,
              description: `Možné hodnoty
              <ul>
                <li><strong>media</strong> pro pole 337</li>
                <li><strong>carrier</strong> pro pole 338</li>
              </ul>`,
              options: [
                ['media', 'media'],
                ['carrier', 'carrier']]
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
      description: `Obecná poznámka k titulu periodika jako celku<br/>
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
      Hodnota <strong>title</strong>`,
      fields: {
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
      identifikátory mezinárodní nebo lokální, které periodikum má.`,
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
                <strong>čČNB</strong> (ccnb) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 015, $a, $z
              </li>
              <li>
                <strong>ISBN</strong> (isbn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 020, $a, $z
              </li>
              <li>
                <strong>ISSN</strong> (issn) <i>MA</i><br/>
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
      description: `Klasifikační údaje věcného třídění podle Konspektu.<br/>
      Odpovídá poli 072 $a MARC21`,
      fields: {
        authority: {
          usage: "M",
          label: "Autorita",
          selector: "classification/@authority",
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
            ['udc','udc'],
            ['Konspekt','Konspekt']
          ]
        },
        edition: {
          usage: "M",
          label: "Edice",
          selector: "classification/@edition",
          cols: 2,
          description: `
          <ul>
            <li>
              vyplnit hodnotu <strong>Konspekt</strong> (v případě 072 $a)
            </li>
          </ul>`,
          options: [
            ['Konspekt','Konspekt']
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
      description: `Pro titul periodika hodnota <strong>text</strong><br/>
      mělo by se vyčítat z MARC21 katalogizačního záznamu, z pozice 06 návěští`,
      fields: {
        value: {
          usage: "R",
          label: "Typ zdroje",
          help: "off",
          options: [
            ['','-'],
            ['text','text']
          ]
        }
      }
    },
    recordInfo: {
      usage: "M",
      label: 'Údaje o metadatovém záznamu',
      selector: 'recordInfo',
      description: `údaje o metadatovém záznamu – jeho vzniku, změnách apod.`,
      fields: {
        descriptionStandard: {
          usage: "MA",
          label: "Standard metadat",
          cols: 2,
          selector: 'recordInfo/descriptionStandard',
          description: `Popis standardu, ve kterém je přebíraný katalogizační záznam<br/>
            Pro záznamy v AACR2: Odpovídá hodnotě návěští záznamu MARC21, pozice 18 - hodnota „aacr“, tj. pro LDR/18 ="a"`,
          options: [
            ['aacr', 'aacr'],
            ['rda', 'rda']
          ]
        },
        recordContectSource: {
          usage: "R",
          label: "Contect source",
          selector: 'recordInfo/recordContectSource',
          description: `Kód nebo jméno instituce, která záznam vytvořila nebo změnila`,
          fields: {
            value: {
              usage: "R",
              label: "Contect source",
              cols: 2,
              selector: "recordInfo/recordContectSource",
              help: "off"
            },
            authority: {
              usage: "R",
              label: "Autorita",
              cols: 2,
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
            value: {
              usage: "M",
              label: "Datum vytvoření",
              cols: 2,
              selector: "recordInfo/recordCreationDate",
              help: "off"
            },
            encoding: {
              usage: "M",
              label: "Kódování",
              cols: 2,
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
            value: {
              usage: "MA",
              label: "Datum změny",
              cols: 2,
              selector: "recordInfo/recordChangeDate",
              help: "off"
            },
            encoding: {
              usage: "M",
              label: "Kódování",
              cols: 2,
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
            value: {
              usage: "MA",
              label: "Identifikátor záznamu",
              cols: 2,
              selector: "recordInfo/recordIdentifier",
              help: "off"
            },
            source: {
              usage: "R",
              label: "Zdroj",
              cols: 2,
              selector: "recordInfo/recordIdentifier/@source",
              description: `hodnota se přebírá z katalogu pole 003 `
            }
          }
        },
        recordOrigin: {
          usage: "R",
          label: "Údaje o vzniku záznamu",
          cols: 2,
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
              cols: 2,
              selector: "recordInfo/languageOfCataloging",
              help: "off"
            },
            languageTerm: {
              usage: "R",
              label: "Zdroj",
              cols: 2,
              selector: "recordInfo/languageOfCataloging/languageTerm",
              description: `přebírá se z katalogu - pole 40 $b`
            },
            authority: {
              usage: "R",
              label: "Autorita",
              cols: 2,
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
