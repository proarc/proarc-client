export class NdkePeriodicalIssueRdaTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: "titleInfo",
      expanded: true,
      description: `Název titulu periodika, kterého je číslo součástí pro plnění použít katalogizační záznam nebo názvové autority`,
      fields: {
        title: {
          usage: "M",
          label: 'Název periodika',
          selector: "titleInfo/title",
          description: `Názvová informace – název titulu periodika<br/>
          hodnoty převzít z katalogu, katalogizačního záznamu titulu periodika nebo názvových autorit`
        },
        nonSort: {
          usage: "O",
          label: 'Část vynechaná při hledání',
          selector: "titleInfo/nonSort",
          cols: 2,
          description: `Část názvu, která má být vynechána při vyhledávána<br/>
          např.:
          <ul>
            <li><nonSort>The</nonSort></li>
            <li><title>Beatles</title></li>
          </ul>`,
        },
        subTitle: {
          usage: "O",
          label: 'Podnázev výtisku',
          selector: "titleInfo/subTitle",
          description: `Podnázev čísla periodika`
        },
        partName: {
          usage: "O",
          label: 'Název výtisku',
          selector: "titleInfo/partName",
          cols: 2,
          description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        partNumber: {
          usage: "M",
          label: 'Číslo výtisku',
          selector: "titleInfo/partNumber",
          cols: 2,
          description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik`
        }
      }
    },
    name: {
      usage: "MA",
      label: "Autor",
      selector: "name",
      description: `Údaje o odpovědnosti za číslo periodika<br/>
      použití u ročenek, specializovaných periodik, tematických čísel nebo zvláštních vydání`,
      fields: {
        type: {
          usage: "M",
          label: "Typ",
          selector: "name/@type",
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
          selector: "name/namePart[not(@type)]",
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
          label: "Ostatní související se jménem",
          selector: "name/namePart[@type='termsOfAddress']",
          cols: 2,
          description: `Tituly a jiná slova nebo čísla související se jménem.`
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
          selector: "name/role/roleTerm",
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
      label: "Původ předlohy",
      selector: "originInfo",
      expanded: true,
      description: `informace o původu předlohy – vyplňuje se ručně doporučené tam, kde lze vyplnit`,
      fields: {
        publisher: {
          usage: "MA",
          label: "Nakladatel",
          selector: "originInfo/publisher",
          description: `Jméno entity, která dokument vydala, vytiskla nebo jinak vyprodukovala<br/>
            vyplňuje se ručně podle předlohy`,
        },
        dateIssued: {
          usage: "MA",
          label: "Datum vydání",
          selector: "originInfo/dateIssued",
          description:`Datum vydání předlohy<br/>
            vyplňuje se ručně, dle předlohy`
        },
        qualifier: {
          usage: "O",
          label: "Upřesnění data",
          selector: "originInfo/dateIssued/@qualifier",
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
        point: {
          usage: "O",
          label: "Point",
          selector: "originInfo/dateIssued/@point",
          cols: 2,
          description: `Hodnoty "start" resp. "end" jen u údaje z pole 008, pro rozmezí dat`,
          options: [
            ['', '-'],
            ['start', 'start'],
            ['end', 'end']
          ]
        },
        place: {
          usage: "MA",
          label: "Místo",
          selector: "originInfo/place/placeTerm",
          cols: 1,
          description:`Údaje o místě spojeném s vydáním, výrobou nebo původem popisovaného dokumentu.`
        },
        dateCreated: {
          usage: "R",
          label: "Datum vytvoření",
          selector: "originInfo/dateCreated",
          cols: 2,
          description:`Datum vytvoření p5edlohy<br/>
          bude použito pouze při popisu tiskaře, viz poznámka u <strong>Nakladatel</strong> nebo např. u popisu CD/DVD apod.<br/>
          odpovídá hodnotě z katalogizačního záznamu, pole 264 $g`
        },
      }
    },
    location: {
      usage: "MA",
      label: "Uložení",
      selector: "location",
      description: `Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.`,
      fields: {
        url: {
          usage: "MA",
          label: "URL",
          selector: "location/url",
          description: `Pro uvedení lokace elektronického dokumentu`
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
          label: "Vydání",
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
          selector: "classification/value",
          label: "Hodnota",
          help: "off"
        }
      }
    },
    subject: {
      usage: "RA",
      label: "Věcné třídění",
      selector: "subject",
      description: `Údaje o věcném třídění<br/>
      Předpokládá se přebírání z katalogizačního záznamu<br/>
      použití u ročenek, specializovaných periodik, tematických čísel nebo zvláštních vydání`,
      fields: {
        authority: {
          usage: "MA",
          label: "Autorita",
          selector: "subject/@authority",
          description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong>, <strong>Konspekt</strong><br/>
          Odpovídá hodnotě v $2`,
          options: [
            ['', '-'],
            ['czenas','czenas'],
            ['eczenas','eczenas'],
            ['mednas','mednas'],
            ['czmesh','czmesh'],
            ['msvkth','msvkth'],
            ['agrovoc','agrovoc'],
            ['Konspekt','Konspekt'],
          ]
        },
        topic: {
          usage: "R",
          label: "Klíčové slovo/Předmětové heslo",
          selector: "subject/topic",
          description: `Libovolný výraz specifikující nebo charakterizující obsah periodika<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21`
        },
        temporal: {
          usage: "R",
          label: "Chronologické věcné třídění",
          selector: "subject/temporal",
          description: `Chronologické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (chronologický údaj) nebo obsah pole 648 záznamu MARC21`
        },
        geographic: {
          usage: "R",
          label: "Geografické věcné třídění",
          selector: "subject/geographic",
          description: `Geografické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (geografický termín) nebo obsah pole 651 záznamu MARC21`
        },
        name: {
          usage: "R",
          label: "Jméno použité jako věcné záhlaví",
          selector: "subject/name",
          description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21<br/>
          Struktura a atributy stejné jako pro údaje o původcích – viz element <name>`
        },
      }
    },
    language: {
      usage: "R",
      label: "Jazyk",
      selector: "language",
      description: `Údaje o jazyce dokumentu`,
      fields: {
        objectPart: {
          usage: "R",
          label: "Část",
          selector: "language/@objectPart",
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
          usage: "R",
          label: "Jazyk",
          selector: "language/languageTerm",
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
          description: `Poznámka o fyzickém stavu dokumentu`
        },
        digitalOrigin: {
          usage: "M",
          label: "Zdroje digitálního dokumentu",
          selector: "physicalDescription/digitalOrigin",
          description: `Indikátor zdroje digitálního dokumentu hodnota <strong>born digital</strong>`,
          options: [
            ['', '-'],
            ['born digital', 'born digital']
          ]
        },
      }
    },
    genre: {
      usage: "M",
      label: "Žánr",
      selector: "genre",
      description: `Bližší údaje o typu dokumentu<br/>
      Hodnota <strong>issue</strong>`,
      fields: {
        type: {
          usage: "M",
          label: "Typ",
          selector: "genre/@type",
          description:`Upřesnění typu čísla a jednotlivých vydání</br>
          použít jednu z hodnot:
          <ul>
            <li>Běžné vydání (normal)</li>
            <li>Ranní vydání (morning)</li>
            <li>Odpolední vydání (afternoon)</li>
            <li>Večerní vydání (evening)</li>
            <li>Opravné vydání (corrected)</li>
            <li>Zvláštní vydání (special)</li>
            <li>Příloha (supplement) - v případě, že se příloha periodického typu popisuje jako číslo</li>
            <li>Pořadní vydání (sequence_1 = první vydání toho dne, sequence_2 = druhé vydání atd.)</li>
          </ul>`,
          options: [
            ['normal', 'Běžné vydání'],
            ['morning', 'Ranní vydání'],
            ['afternoon', 'Odpolední vydání'],
            ['evening', 'Večerní vydání'],
            ['corrected', 'Opravné vydání'],
            ['special', 'Zvláštní vydání'],
            ['supplement', 'Příloha'],
            ['sequence_1', 'První vydání'],
            ['sequence_2', 'Druhé vydání'],
            ['sequence_3', 'Třetí vydání'],
            ['sequence_4', 'Čtvrté vydání'],
            ['sequence_5', 'Páté vydání'],
            ['sequence_6', 'Šesté vydání'],
            ['sequence_7', 'Sedmé vydání'],
            ['sequence_8', 'Osmé vydání'],
            ['sequence_9', 'Deváté vydání']
          ]
        },
        value: {
          usage: "M",
          selector: "genre/value",
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
      identifikátory mezinárodní nebo lokální, které číslo periodika obsahuje.`,
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
                <strong>ISBN</strong> (isbn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 020, $a, $z
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
          selector: "identifier/value",
          label: "Hodnota",
          help: "off"
        }
      }
    },
    recordInfo: {
      usage: "M",
      label: 'Údaje o metadatovém záznamu',
      selector: "recordInfo",
      description: `údaje o metadatovém záznamu – jeho vzniku, změnách apod.`,
      fields: {
        descriptionStandard: {
          usage: "MA",
          label: "Standard metadat",
          cols: 2,
          selector: "recordInfo/descriptionStandard",
          description: `Popis standardu, ve kterém je přebíraný katalogizační záznam<br/>
            Pro záznamy v AACR2: Odpovídá hodnotě návěští záznamu MARC21, pozice 18 - hodnota „aacr“, tj. pro LDR/18 ="a"`,
          options: [
            ['aacr', 'aacr'],
            ['rda', 'rda']
          ]
        },
        recordContentSource: {
          usage: "R",
          label: "Content source",
          selector: "recordInfo/recordContentSource",
          description: `Kód nebo jméno instituce, která záznam vytvořila nebo změnila`,
          fields: {
            value: {
              usage: "R",
              label: "Content source",
              cols: 2,
              selector: "recordInfo/recordContentSource",
              help: "off"
            },
            authority: {
              usage: "R",
              label: "Autorita",
              cols: 2,
              selector: "recordInfo/recordContentSource/@authority",
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
          selector: "recordInfo/recordCreationDate",
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
          selector: "recordInfo/recordChangeDate",
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
          selector: "recordInfo/recordIdentifier",
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
          selector: "recordInfo/recordOrigin",
          cols: 2,
          description: `údaje o vzniku záznamu hodnoty: "machine generated" nebo "human prepared"`,
          options: [
            ['machine generated', 'machine generated'],
            ['human prepared', 'human prepared']
          ]
        },
        languageOfCataloging: {
          usage: "R",
          label: "Jazyk záznamu",
          selector: "recordInfo/languageOfCataloging",
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
