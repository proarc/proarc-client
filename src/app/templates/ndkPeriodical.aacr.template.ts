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
          cols: 2,
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
            description: `Jméno entity, která dokument vydala, vytiskla nebo jinak vyprodukovala<br/>
            Odpovídá poli 260 $b katalogizačního záznamu v MARC21.<br/>
            Pokud má periodikum více vydavatelů, přebírají se za záznamu všichni (jsou v jednom poli 260).`,
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
          přebírat z katalogu; odpovídá hodnotě z katalogizačního záznamu, pole 264_0 $c pokud je LDR/06="d", "f", "t"`
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
              usage: "M",
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
          description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong><br/>
          Odpovídá hodnotě v $2`,
          options: [
            ['', '-'],
            ['czenas','czenas'],
            ['eczenas','eczenas'],
            ['mednas','mednas'],
            ['czmesh','czmesh'],
            ['msvkth','msvkth'],
            ['agrovoc','agrovoc'],
          ]
        },
        topic: {
          usage: "R",
          label: "Klíčové slovo/Předmětové heslo",
          selector: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah periodika<br/>
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
          description: `Poznámka o fyzickém stavu dokumentu<br/>
          zde se zapíší defekty zjištěné při digitalizaci pro úroveň titulu periodika (např. chybějící ročník)`
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
            ['udc','udc'],
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
    }
  }
}
