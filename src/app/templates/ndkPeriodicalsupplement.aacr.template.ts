export class NdkPeriodicalSupplementAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      description: `Názvová informace přílohy<br/>
      Pro plnění použít katalogizační záznam`,
      fields: {
        title: {
          usage: "M",
          label: 'Název',
          selector: 'titleInfo/title',
          description: `Názvová informace – název titulu periodika, nebo název přílohy, pokud je známý`
        },
        partNumber: {
          usage: "MA",
          label: 'Číslo přílohy',
          selector: 'titleInfo/partNumber',
          cols: 2,
          description: `Číslo přílohy, pokud nějaké má doporučené pokud lze vyplnit`
        },
        partName: {
          usage: "MA",
          label: 'Název přílohy',
          selector: 'titleInfo/partName',
          cols: 2,
          description: `Vyplnit pouze v případě, pokud dané číslo přílohy má ještě vlastní název`
        }
      }
    },
    name: {
      usage: "MA",
      label: "Autor",
      selector: 'name',
      description: `Údaje o odpovědnosti za přílohu<br/>
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
            ['personal','Osoba'],
            ['corporate','Organizace'],
            ['conference','Konference'],
            ['family','Rodina']
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
    originInfo: {
      usage: "MA",
      label: "Nakladatel",
      selector: 'originInfo',
      description: `Informace o původu předlohy<br/>
      informace o původu přílohy
      plnit pokud se liší od údajů v popisu čísla periodika
      (platí i pro jednotlivé sub-elementy)<br/>
      Poznámka:<br/>
      Jeden nebo více výskytů elementů se předpokládá
      pro vydavatele, další výskyt v případě nutnosti
      popsat tiskaře.<br/>
      Pokud je nutno vyjádřit tiskaře
      (pole 260 $f a $e a $g v MARC21), je nutno
      element <originInfo> opakovat s atributem
      transliteration="printer" a elementy <place>,
      <publisher>, <dateCreated>, které budou
      obsahovat údaje o tiskaři.`,
      fields: {
        publisher: {
            usage: "MA",
            label: "Nakladatel",
            selector: 'originInfo/publisher',
            description: `Jméno entity, která dokument vydala, vytiskla nebo jinak vyprodukovala<br/>
            Odpovídá poli 260 $b katalogizačního záznamu v MARC21`
        },
        dateIssued: {
            usage: "MA",
            label: "Datum vydání",
            selector: 'originInfo/dateIssued',
            cols: 2,
            description:`Satum vydání přílohy, dle toho jaké údaje jsou k dispozici<br/>
            možno použít hodnotu z katalogizačního záznamu, pole 260, $c`
        },
        qualifier: {
            usage: "O",
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
        place: {
            usage: "MA",
            label: "Místo",
            selector: 'originInfo/place/placeTerm',
            cols: 2,
            description:`Údaje o místě spojeném s vydáním, výrobou nebo původem přílohy`
        },
        dateCreated: {
          usage: "R",
          label: "Datum vytvoření",
          selector: 'originInfo/dateCreated',
          cols: 2,
          description:`Datum vytvoření přílohy<br/>
          bude použito pouze při popisu tiskaře, viz poznámka u <strong>Nakladatel</strong> nebo např. u popisu CD/DVD apod.<br/>
          odpovídá hodnotě z katalogizačního záznamu, pole 260 $g`
        },
        frequency: {
          usage: "RA",
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
    subject: {
      usage: "R",
      label: "Věcné třídění",
      selector: 'subject',
      description: `Údaje o věcném třídění`,
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
          usage: "MA",
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
        }
      }
    },
    language: {
      usage: "M",
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
    abstract: {
      usage: "RA",
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
              usage: "MA",
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
      description: `Obecná poznámka k dokumentu<br/>
      odpovídá poli 500 v MARC21`,
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
      hodnota <strong>supplement</strong>`,
      fields: {
        type: {
          usage: "M",
          label: "Typ",
          selector: "genre/@type",
          description:`Bližší údaje o typu přílohy</br>
          hodnoty:
          <ul>
            <li>Příloha k ročníku, např. obsah celého ročníku (volume_supplement)</li>
            <li>příloha k číslu (issue_supplement)</li>
          </ul>`,
          options: [
            ['volume_supplement', 'příloha k ročníku'],
            ['issue_supplement', 'příloha k číslu']
          ]
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
                <strong>URN:NBN</strong> (urnnbn) <i>MA</i><br/>
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
              <li>
                <strong>ISSN</strong> (issn) <i>MA</i><br/>
                převzít z katalogizačního záznam NK ČR 
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
      description: `Popis charakteristiky typu nebo obsahu přílohy jedna z hodnot:<br/>
      <ul>
        <li>text (např. pro přílohu typu časopis, kniha, brožura apod.)</li>
        <li>cartographic (pro mapy)</li>
        <li>notated music</li>
        <li>sound recording-musical (pro hudební CD/DVD)</li>
        <li>sound recording-nonmusical</li>
        <li>sound recording</li>
        <li>still image (fotografie, plakáty apod.)</li>
        <li>moving image (pro filmová DVD)</li>
        <li>three dimensional object</li>
        <li>software, multimedia (pro CD/DVD se SW)</li>
        <li>mixed material</li>
      </ul>`,
      fields: {
        value: {
          usage: "R",
          label: "Typ zdroje",
          help: "off",
          options: [
            ['','-'],
            ['text','text'],
            ['cartographic','cartographic'],
            ['notated music','notated music'],
            ['sound recording-musical','sound recording-musical'],
            ['sound recording-nonmusical','sound recording-nonmusical'],
            ['sound recording','sound recording'],
            ['still image','still image'],
            ['moving image','moving image'],
            ['three dimensional object','three dimensional object'],
            ['software, multimedia','software, multimedia'],
            ['mixed material','mixed material']
          ]
        }
      }
    }
  }
}