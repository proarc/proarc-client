export class NdkPeriodicalAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      labelKey: 'titleInfo',
      description: `Název titulu periodika<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má periodikum více typů názvů, element se opakuje podle potřeby`,
      fields: {
        type: {
          usage: 'MA',
          label: 'Typ',
          selector: 'titleInfo/@type',
          labelKey: 'titleInfo/@type',
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
          usage: 'O',
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
          description: `Názvová informace – název titulu periodika</br>
          hodnoty převzít z katalogu<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        subTitle: {
          usage: 'MA',
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          labelKey: 'titleInfo/subTitle',
          description: `Podnázev titulu periodika<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        partNumber: {
          usage: 'MA',
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          labelKey: 'titleInfo/partNumber',
          cols: 2,
          description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik`
        },
        partName: {
          usage: 'R',
          label: 'Název části',
          selector: 'titleInfo/partName',
          labelKey: 'titleInfo/partName',
          cols: 2,
          description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik<br/>
          odpovídající pole a podpole podle typu, viz typ`
        }
      }
    },
    name: {
      usage: 'R',
      label: 'Autor',
      selector: 'name',
      labelKey: 'name',
      description: `Údaje o odpovědnosti za titul periodika`,
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
        name: {
          usage: 'R',
          label: 'Celé jméno',
          selector: 'name/namePart[not(@type)]',
          labelKey: 'name/namePart[not(@type)]',
          description: `Vyplnit pokud nelze rozlišit křestní jméno a příjmení.`
        },
        given: {
          usage: 'MA',
          label: 'Křestní',
          selector: "name/namePart[@type='given']",
          labelKey: "name/namePart[@type='given']",
          cols: 2,
          description: `Údaje o křestním jméně.<br/>
          V případě více křestních jmen se doporučuje
          uvést je společně ve stejném elementu , např. hodnota "Jan Amos"`
        },
        family: {
          usage: 'MA',
          label: 'Příjmení',
          selector: "name/namePart[@type='family']",
          labelKey: "name/namePart[@type='family']",
          cols: 2,
          description: `Údaje o příjmení.`
        },
        date: {
          usage: 'RA',
          label: 'Datum',
          selector: "name/namePart[@type='date']",
          labelKey: "name/namePart[@type='date']",
          cols: 2,
          description: `Životopisná data autora<br/>
          Pokud známe datum narození a úmrtí autora, vyplnit ve tvaru RRRR-RRRR.`
        },
        termsOfAddress: {
          usage: 'RA',
          label: 'Ostatní související se jménem',
          selector: "name/namePart[@type='termsOfAddress']",
          labelKey: "name/namePart[@type='termsOfAddress']",
          cols: 2,
          description: `Tituly a jiná slova nebo čísla související se jménem.`
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
    },
    originInfo: {
      usage: 'M',
      label: 'Původ předlohy',
      selector: 'originInfo',
      labelKey: 'originInfo',
      description: `Informace o původu předlohy`,
      fields: {
        publisher: {
          usage: 'MA',
          label: 'Nakladatel',
          selector: 'originInfo/publisher',
          labelKey: 'originInfo/publisher',
          description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 260 $b katalogizačního záznamu v MARC21<br/>
            pokud má periodikum více vydavatelů, přebírají se ze záznamu všichni (v jednom poli 260)`,
        },
        dateIssued: {
          usage: 'M',
          label: 'Datum vydání',
          selector: 'originInfo/dateIssued',
          labelKey: 'originInfo/dateIssued',
          cols: 2,
          description: `Datum vydání předlohy, nutno zaznamenat rok/roky, v nichž časopis vycházel - formu zápisu přebírat z katalogu (např. 1900-1939)<br/>
            dpovídá hodnotě z katalogizačního záznamu, pole 260 $c a polí 008/07-10 a 008/11-14`,
          fields: {
            value: {
              usage: 'MA',
              selector: 'originInfo/dateIssued/value',
              labelKey: 'originInfo/dateIssued/value',
              label: 'Hodnota',
              help: 'off'
            },
            qualifier: {
              usage: 'R',
              label: 'Upřesnění data',
              selector: 'originInfo/dateIssued/@qualifier',
              labelKey: 'originInfo/dateIssued/@qualifier',
              cols: 3,
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
              usage: 'R',
              label: 'Kódování',
              selector: 'originInfo/dateIssued/@encoding',
              labelKey: 'originInfo/dateIssued/@encoding',
              cols: 3,
              description: `Hodnota "marc" jen u údaje z pole 008`,
              options: [
                ['', '-'],
                ['marc', 'MARC'],
                ['iso8601', 'ISO 8601'],
                ['edtf', 'EDTF'],
                ['temper', 'temper'],
                ['w3cdtf', 'W3CDTF']
              ]
            },
            point: {
              usage: 'MA',
              label: 'Point',
              selector: 'originInfo/dateIssued/@point',
              labelKey: 'originInfo/dateIssued/@point',
              cols: 3,
              description: `Hodnoty "start" resp. "end" jen u údaje z pole 008, pro rozmezí dat`,
              options: [
                ['', '-'],
                ['start', 'start'],
                ['end', 'end']
              ]
            },
          }
        },
        issuance: {
          usage: 'M',
          label: 'Vydání',
          selector: 'originInfo/issuance',
          labelKey: 'originInfo/issuance',
          cols: 2,
          description: `Údaje o vydávání odpovídá hodnotě uvedené v návěští MARC21 na pozici 07<br/>
          Možné hodnoty
          <ul>
            <li>Na pokračování (continuing)</li>
            <li>Sériové (serial)</li>
            <li>Integrační zdroj (integrating resource)</li>
          </ul>`,
          options: [
            ['', '-'],
            ['continuing', 'Na pokračování'],
            ['serial', 'Sériové'],
            ['integrating resource', 'Integrační zdroj']
          ]
        },
        place: {
          usage: 'MA',
          label: 'Místo',
          selector: 'originInfo/place/placeTerm',
          labelKey: 'originInfo/place/placeTerm',
          cols: 1,
          description: `Údaje o místě spojeném s vydáním, výrobou nebo původem popisovaného dokumentu.<br/>
            Odpovídá hodnotám z katalogizačního záznamu, pole 260, $a resp. pole 008/15-17`
        },
        dateCreated: {
          usage: 'R',
          label: 'Datum vytvoření',
          selector: 'originInfo/dateCreated',
          labelKey: 'originInfo/dateCreated',
          cols: 2,
          description: `Datum vydání předlohy pro rukopisy.<br/>
          přebírat z katalogu; odpovídá hodnotě z katalogizačního záznamu, pole 260 $c pokud je LDR/06="d", "f", "t"`
        },
        frequency: {
          usage: 'R',
          label: 'Frekvence',
          selector: 'originInfo/frequency',
          labelKey: 'originInfo/frequency',
          description: `údaje o pravidelnosti vydávání
          odpovídá údaji MARC21 v poli 310 nebo pozici 18 v poli 008`,
          fields: {
            authority: {
              usage: 'R',
              label: 'Autorita',
              selector: 'originInfo/frequency/@authority',
              labelKey: 'originInfo/frequency/@authority',
              options: [['marcfrequency', 'marcfrequency']]
            },
            value: {
              label: 'Hodnota',
              usage: 'R',
              selector: 'originInfo/frequency',
              labelKey: 'originInfo/frequency',
              help: 'off'
            }
          }
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
        physicalLocation: {
          usage: 'M',
          label: 'Místo uložení',
          selector: 'location/physicalLocation',
          labelKey: 'location/physicalLocation',
          description: `Údaje o instituci, kde je fyzicky uložen daný konkrétní popisovaný dokument, např. NK ČR nutno použít kontrolovaný slovník – sigly knihovnen (ABA001 atd.) odpovídá poli 910 $a v MARC21<br\>
          Pozn. u dokumentů v digitální podobě není možné vyplnit`,
        },
        shelfLocator: {
          usage: 'M',
          label: 'Signatura',
          selector: 'location/shelfLocator',
          labelKey: 'location/shelfLocator',
          description: `Signatura nebo lokační údaje o daném konkrétním dokumentu, který slouží jako předloha.`,
          fields: {
            value: {
              usage: 'M',
              selector: 'location/shelfLocator/value',
              labelKey: 'location/shelfLocator/value',
              label: 'Hodnota',
              help: 'off'
            },
          }
        },
        url: {
          usage: 'O',
          label: 'URL',
          selector: 'location/url',
          labelKey: 'location/url',
          description: `Pro uvedení lokace elektronického dokumentu`,
          fields: {
            value: {
              usage: 'O',
              selector: 'location/url/value',
              labelKey: 'location/url/value',
              label: 'Hodnota',
              help: 'off'
            },
            note: {
              usage: 'O',
              selector: 'location/url/@note',
              labelKey: 'location/url/@note',
              cols: 2,
              label: 'Note',
              help: 'off'
            },
            usage: {
              usage: 'O',
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
    subject: {
      usage: 'R',
      label: 'Věcné třídění',
      selector: 'subject',
      labelKey: 'subject',
      description: `Údaje o věcném třídění<br/>
      Předpokládá se přebírání z katalogizačního záznamu`,
      fields: {
        authority: {
          usage: 'R',
          label: 'Autorita',
          selector: 'subject/@authority',
          labelKey: 'subject/@authority',
          description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>czmesh</strong>, <strong>mednas</strong><br/>
          Odpovídá hodnotě v $2`,
          options: [
            ['', '-'],
            ['czenas', 'czenas'],
            ['eczenas', 'eczenas'],
            ['mednas', 'mednas'],
            ['czmesh', 'czmesh']
          ]
        },
        topic: {
          usage: 'R',
          label: 'Klíčové slovo/Předmětové heslo',
          selector: 'subject/topic',
          labelKey: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah periodika<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21 nebo obsah pole 072 $x`
        },
        geographic: {
          usage: 'R',
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
          description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21<br/>
          Struktura a atributy stejné jako pro údaje o původcích – viz element <name>`
        },
      }
    },
    language: {
      usage: 'M',
      label: 'Jazyk',
      selector: 'language',
      labelKey: 'language',
      description: `Údaje o jazyce dokumentu`,
      fields: {
        objectPart: {
          usage: 'MA',
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
          usage: 'M',
          label: 'Jazyk',
          selector: 'language/languageTerm',
          labelKey: 'language/languageTerm',
          cols: 2,
          description: `Přesné určení jazyka`
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
          usage: 'R',
          label: 'Abstrakt',
          selector: 'abstract',
          labelKey: 'abstract/value',
          help: 'off'
        }
      }
    },
    physicalDescription: {
      usage: 'M',
      label: 'Fyzický popis',
      selector: 'physicalDescription',
      labelKey: 'physicalDescription',
      description: `Obsahuje údaje o fyzickém popisu zdroje/předlohy`,
      fields: {
        extent: {
          usage: 'RA',
          label: 'Rozsah',
          selector: 'physicalDescription/extent',
          labelKey: 'physicalDescription/extent',
          description: `Údaje o rozsahu (stran, svazků nebo rozměrů)<br/>
          odpovídá hodnotě v poli 300, $a, $b a $c<br/>
          počet stránek bude vyjádřen ve fyzické strukturální mapě`,
        },
        note: {
          usage: 'RA',
          label: 'Poznámka',
          selector: 'physicalDescription/note',
          labelKey: 'physicalDescription/note',
          description: `Poznámka o fyzickém stavu dokumentu<br/>
          zde se zapíší defekty zjištěné při digitalizaci pro úroveň titulu periodika (např. chybějící ročník)`
        },
        form: {
          usage: 'M',
          label: 'Forma',
          selector: 'physicalDescription/form',
          labelKey: 'physicalDescription/form',
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
              usage: 'M',
              label: 'Autorita',
              selector: 'physicalDescription/form/@authority',
              labelKey: 'physicalDescription/form/@authority',
              cols: 2,
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
              usage: 'M',
              selector: 'physicalDescription/form/value',
              labelKey: 'physicalDescription/form/value',
              label: 'Hodnota',
              help: 'off'
            }
          }
        }
      }
    },
    note: {
      usage: 'RA',
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
    genre: {
      usage: 'M',
      label: 'Žánr',
      selector: 'genre',
      labelKey: 'genre',
      description: `Bližší údaje o typu dokumentu<br/>
      Hodnota <strong>title</strong>`,
      fields: {
        value: {
          usage: 'M',
          label: 'Hodnota',
          selector: 'genre/value',
          labelKey: 'genre/value',
          help: 'off'
        }
      }
    },
    identifier: {
      usage: 'M',
      label: 'Identifikátor',
      selector: 'identifier',
      labelKey: 'identifier',
      description: `Údaje o identifikátorech, obsahuje unikátní
      identifikátory mezinárodní nebo lokální, které periodikum má.`,
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
          usage: 'MA',
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
    classification: {
      usage: 'R',
      label: 'Klasifikace',
      selector: 'classification',
      labelKey: 'classification',
      description: `Klasifikační údaje věcného třídění podle Mezinárodního desetinného třídění.<br/>
      Odpovídá poli 080 MARC21.`,
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
          </ul>`,
          options: [
            ['udc', 'udc']
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
          usage: 'M',
          selector: 'classification/value',
          labelKey: 'classification/value',
          label: 'Hodnota',
          help: 'off'
        }
      }
    },
    typeOfResource: {
      usage: 'R',
      label: 'Typ zdroje',
      selector: 'typeOfResource',
      labelKey: 'typeOfResource',
      description: `Pro titul periodika hodnota <strong>text</strong><br/>
      mělo by se vyčítat z MARC21 katalogizačního záznamu, z pozice 06 návěští`,
      fields: {
        value: {
          usage: 'R',
          selector: 'typeOfResource/value',
          labelKey: 'typeOfResource/value',
          label: 'Typ zdroje',
          help: 'off',
          options: [
            ['', '-'],
            ['text', 'text']
          ]
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
      label: 'Informace o dalších dokumentech',
      selector: 'relatedItem',
      labelKey: 'relatedItem',
      description: 'Informace o dalších dokumentech/částech/zdrojích, které jsou ve. vztahu k popisovanému dokumentu;.',
      fields: {
        type: {
          usage: 'R',
          label: 'Typ',
          selector: 'relatedItem/@type',
          labelKey: 'relatedItem/@type',
          description: `Type spolu s otherType popisují vztah položky, popsané v <relatedItem> a dokumentu, který je předmětem MODS záznamu`,
          options: [
            ['', '-'],
            ['series', 'Series'],
            ['original', 'original'],
            ['isReferencedBy', 'isReferencedBy']
          ]
        },
        otherType: {
          usage: 'O',
          label: 'Other type',
          selector: 'relatedItem/@otherType',
          labelKey: 'relatedItem/@otherType',
          cols: 2,
        },
        otherTypeURI: {
          usage: 'O',
          label: 'Other Type URI',
          selector: 'relatedItem/@otherTypeURI',
          labelKey: 'relatedItem/@otherTypeURI',
          description: 'Odkaz na zdroj položky v <relatedItem>, který se vztahuje k popisovanému',
          cols: 2,
        },
        otherTypeAuth: {
          usage: 'O',
          label: 'Other Type Auth',
          selector: 'relatedItem/@otherTypeAuth',
          labelKey: 'relatedItem/@otherTypeAuth',
          description: 'Autoritní záznam příbuzné položky',
          cols: 2,
        },
        otherTypeAuthURI: {
          usage: 'O',
          label: 'Other Type Auth URI',
          selector: 'relatedItem/@otherTypeAuthURI',
          labelKey: 'relatedItem/@otherTypeAuthURI',
          description: 'Odkaz na autoritní záznam příbuzné položky',
          cols: 2,
        },
        titleInfo: {
          usage: 'MA',
          label: 'Název',
          selector: 'relatedItem/titleInfo',
          labelKey: 'relatedItem/titleInfo',
          description: `Název titulu periodika<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má periodikum více typů názvů, element se opakuje podle potřeby`,
          fields: {
            type: {
              usage: 'MA',
              label: 'Typ',
              selector: 'relatedItem/titleInfo/@type',
              labelKey: 'relatedItem/titleInfo/@type',
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
              usage: 'O',
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
              description: `Názvová informace – název titulu periodika</br>
          hodnoty převzít z katalogu<br/>
          odpovídající pole a podpole podle typu, viz typ`
            },
            subTitle: {
              usage: 'MA',
              label: 'Podnázev',
              selector: 'relatedItem/titleInfo/subTitle',
              labelKey: 'relatedItem/titleInfo/subTitle',
              description: `Podnázev titulu periodika<br/>
          odpovídající pole a podpole podle typu, viz typ`
            },
            partNumber: {
              usage: 'MA',
              label: 'Číslo části',
              selector: 'relatedItem/titleInfo/partNumber',
              labelKey: 'relatedItem/titleInfo/partNumber',
              cols: 2,
              description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik`
            },
            partName: {
              usage: 'R',
              label: 'Název části',
              selector: 'relatedItem/titleInfo/partName',
              labelKey: 'relatedItem/titleInfo/partName',
              cols: 2,
              description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik<br/>
          odpovídající pole a podpole podle typu, viz typ`
            }
          }
        },
        name: {
          usage: 'R',
          label: 'Autor',
          selector: 'relatedItem/name',
          labelKey: 'relatedItem/name',
          description: `Údaje o odpovědnosti za titul periodika`,
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
            name: {
              usage: 'R',
              label: 'Celé jméno',
              selector: 'relatedItem/name/namePart[not(@type)]',
              labelKey: 'relatedItem/name/namePart[not(@type)]',
              description: `Vyplnit pokud nelze rozlišit křestní jméno a příjmení.`
            },
            given: {
              usage: 'MA',
              label: 'Křestní',
              selector: "relatedItem/name/namePart[@type='given']",
              labelKey: "relatedItem/name/namePart[@type='given']",
              cols: 2,
              description: `Údaje o křestním jméně.<br/>
          V případě více křestních jmen se doporučuje
          uvést je společně ve stejném elementu , např. hodnota "Jan Amos"`
            },
            family: {
              usage: 'MA',
              label: 'Příjmení',
              selector: "relatedItem/name/namePart[@type='family']",
              labelKey: "relatedItem/name/namePart[@type='family']",
              cols: 2,
              description: `Údaje o příjmení.`
            },
            date: {
              usage: 'RA',
              label: 'Datum',
              selector: "relatedItem/name/namePart[@type='date']",
              labelKey: "relatedItem/name/namePart[@type='date']",
              cols: 2,
              description: `Životopisná data autora<br/>
          Pokud známe datum narození a úmrtí autora, vyplnit ve tvaru RRRR-RRRR.`
            },
            termsOfAddress: {
              usage: 'RA',
              label: 'Ostatní související se jménem',
              selector: "relatedItem/name/namePart[@type='termsOfAddress']",
              labelKey: "relatedItem/name/namePart[@type='termsOfAddress']",
              cols: 2,
              description: `Tituly a jiná slova nebo čísla související se jménem.`
            },
            nameIdentifier: {
              usage: 'MA',
              label: 'Identifikátor autora',
              selector: 'relatedItem/name/nameIdentifier',
              labelKey: 'relatedItem/name/nameIdentifier',
              cols: 2,
              description: `Číslo národní autority`,
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
        originInfo: {
          usage: 'MA',
          label: 'Původ předlohy',
          selector: 'relatedItem/originInfo',
          labelKey: 'relatedItem/originInfo',
          description: `Informace o původu předlohy: odpovídá poli 264`,
          fields: {
            publisher: {
              usage: 'MA',
              label: 'Nakladatel',
              selector: 'relatedItem/originInfo/publisher',
              labelKey: 'relatedItem/originInfo/publisher',
              description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 264 $b katalogizačního záznamu v MARC21<br/>
            pokud má periodikum více vydavatelů, přebírají se ze záznamu všichni (v jednom poli 264)`,
            },
            eventType: {
              usage: 'MA',
              label: 'Typ',
              selector: 'relatedItem/originInfo/@eventType',
              labelKey: 'relatedItem/originInfo/@eventType',
              cols: 2,
              description: `Hodnoty dle druhého indikátoru pole 264:
          <ul>
            <li>
              264_0 <strong>Produkce</strong> (production) <i>R</i><br/>
              Hodnota 0 se uvádí, jestliže pole obsahuje <strong>údaje o vytvoření</strong> zdroje v nezveřejněné podobě.
            </li>
            <li>
              264_1 <strong>Publikace</strong> (publication) <i>R</i><br/>
              Hodnota 1 se uvádí, jestliže pole obsahuje <strong>údaje o nakladateli</strong> zdroje
            </li>
            <li>
              264_2 <strong>Distribuce</strong> (distribution) <i>R</i><br/>
              Hodnota 2 se uvádí, jestliže pole obsahuje <strong>údaje o distribuci</strong> zdroje
            </li>
            <li>
              264_3 <strong>Výroba</strong> (manufacture) <i>R</i><br/>
              Hodnota 3 se uvádí, jestliže pole obsahuje <strong>údaje o tisku</strong>, výrobě zdroje ve zveřejněné podobě.
            </li>
            <li>
              264_4 <strong>Copyright</strong> (copyright) <i>R</i><br/>
              Hodnota 4 se uvádí, jestliže pole obsahuje <strong>údaje o ochraně podle autorského práva</strong>
            </li>
          </ul>
          <p>Element <originInfo> je opakovatelný. Alespoň v
          jednom případě musí být vyplněna hodnota
          eventType="production" nebo
          eventType="publication".
          </p>
          <p>Údaje o distribuci, výrobě a copyrightu jsou u
          tištěných monografií přesunuty z minimálního
          záznamu do doporučeného.<br/>
          </p>
          <p>Hodnota eventType musí být vyplněna na
          základě katalogizačního záznamu. Pravidlo pro
          převod je závazné, povinnost R značí, že musí
          být vybrána jedna z doporučených hodnot na
          základě katalogizačního záznamu.
          </p>`,
              options: [
                ['', '-'],
                ['production', 'Produkce'],
                ['publication', 'Publikace'],
                ['distribution', 'Distribuce'],
                ['manufacture', 'Výroba'],
                ['copyright', 'Copyright']
              ]
            },
            dateIssued: {
              usage: 'MA',
              label: 'Datum vydání',
              selector: 'relatedItem/originInfo/dateIssued',
              labelKey: 'relatedItem/originInfo/dateIssued',
              cols: 2,
              description: `Datum vydání předlohy, nutno zaznamenat rok/roky, v nichž časopis vycházel - formu zápisu přebírat z katalogu (např. 1900-1939)<br/>
            Odpovídá hodnotě z katalogizačního záznamu, pole 264_1 $c a pole 008/07-10<br/>
            Pro všechny ostatní výskyty v poli 264 $c:
            <ul>
              <li>264_0 <strong>Produkce</strong> (production)</li>
              <li>264_2 <strong>Distribuce</strong> (distribution)</li>
              <li>264_3 <strong>Výroba</strong> (manufacture)</li>
              <li>264_4 <strong>Copyright</strong> (copyright)</li>
            </ul>
            využít pole <strong>Datum - jiné</strong> s odpovídajícím polem <strong>type</strong> či pole <strong>copyrightDate</strong>`,
              fields: {
                value: {
                  usage: 'MA',
                  selector: 'relatedItem/originInfo/dateIssued/value',
                  labelKey: 'relatedItem/originInfo/dateIssued/value',
                  label: 'Hodnota',
                  help: 'off'
                },
                qualifier: {
                  usage: 'R',
                  label: 'Upřesnění data',
                  selector: 'relatedItem/originInfo/dateIssued/@qualifier',
                  labelKey: 'relatedItem/originInfo/dateIssued/@qualifier',
                  cols: 3,
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
                  usage: 'R',
                  label: 'Kódování',
                  selector: 'relatedItem/originInfo/dateIssued/@encoding',
                  labelKey: 'relatedItem/originInfo/dateIssued/@encoding',
                  cols: 3,
                  description: `Hodnota "marc" jen u údaje z pole 008`,
                  options: [
                    ['', '-'],
                    ['marc', 'MARC'],
                    ['iso8601', 'ISO 8601'],
                    ['edtf', 'EDTF'],
                    ['temper', 'temper'],
                    ['w3cdtf', 'W3CDTF']
                  ]
                },
                point: {
                  usage: 'MA',
                  label: 'Point',
                  selector: 'relatedItem/originInfo/dateIssued/@point',
                  labelKey: 'relatedItem/originInfo/dateIssued/@point',
                  cols: 3,
                  description: `Hodnoty "start" resp. "end" jen u údaje z pole 008, pro rozmezí dat`,
                  options: [
                    ['', '-'],
                    ['start', 'start'],
                    ['end', 'end']
                  ]
                },
              }
            },
            issuance: {
              usage: 'MA',
              label: 'Vydání',
              selector: 'relatedItem/originInfo/issuance',
              labelKey: 'relatedItem/originInfo/issuance',
              cols: 2,
              description: `Údaje o vydávání odpovídá hodnotě uvedené v návěští MARC21 na pozici 07<br/>
          Možné hodnoty
          <ul>
            <li>Na pokračování (continuing)</li>
            <li>Sériové (serial)</li>
            <li>Integrační zdroj (integrating resource)</li>
          </ul>`,
              options: [
                ['', '-'],
                ['continuing', 'Na pokračování'],
                ['serial', 'Sériové'],
                ['integrating resource', 'Integrační zdroj']
              ]
            },
            place: {
              usage: 'MA',
              label: 'Místo',
              selector: 'relatedItem/originInfo/place/placeTerm',
              labelKey: 'relatedItem/originInfo/place/placeTerm',
              cols: 1,
              description: `Údaje o místě spojeném s vytvořením, vydáním, distribucí nebo výrobou popisovaného dokumentu<br/>
            odpovídá hodnotě 264 $a`
            },
            dateCreated: {
              usage: 'R',
              label: 'Datum vytvoření',
              selector: 'relatedItem/originInfo/dateCreated',
              labelKey: 'relatedItem/originInfo/dateCreated',
              cols: 3,
              description: `Datum vydání předlohy pro rukopisy
          přebírat z katalogu<br/>
          odpovídá hodnotě z katalogizačního záznamu, pole 264_0 $c pokud je LDR/06="d", "f", "t"`
            },
            dateOther: {
              usage: 'R',
              label: 'Datum - jiné',
              selector: 'relatedItem/originInfo/dateOther',
              labelKey: 'relatedItem/originInfo/dateOther',
              cols: 3,
              description: `Datum vytvoření, distribuce, výroby předlohy<br/>
          Tento elemet se využije v případě výskytu $c v:
          <ul>
            <li>264_0 <strong>Produkce</strong> (production)</li>
            <li>264_2 <strong>Distribuce</strong> (distribution)</li>
            <li>264_3 <strong>Výroba</strong> (manufacture)</li>
          </ul>`
            },
            copyrightDate: {
              usage: 'R',
              label: 'Datum - copyright',
              selector: 'relatedItem/originInfo/copyrightDate',
              labelKey: 'relatedItem/originInfo/copyrightDate',
              cols: 3,
              description: `Využije se pouze v případě výskytu pole 264 s druhým indikátorem 4 a podpolem $c<br/>
          <ul>
            <li>264_4 <strong>Copyright</strong> (copyright)</li>
          </ul>`
            },
            frequency: {
              usage: 'R',
              label: 'Frekvence',
              selector: 'relatedItem/originInfo/frequency',
              labelKey: 'relatedItem/originInfo/frequency',
              description: `údaje o pravidelnosti vydávání
          odpovídá údaji MARC21 v poli 310 nebo pozici 18 v poli 008`,
              fields: {
                authority: {
                  usage: 'R',
                  label: 'Autorita',
                  selector: 'relatedItem/originInfo/frequency/@authority',
                  labelKey: 'relatedItem/originInfo/frequency/@authority',
                  options: [['marcfrequency', 'marcfrequency']]
                },
                value: {
                  label: 'Hodnota',
                  usage: 'MA',
                  selector: 'relatedItem/originInfo/frequency',
                  labelKey: 'relatedItem/originInfo/frequency',
                  help: 'off'
                }
              }
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
            physicalLocation: {
              usage: 'MA',
              label: 'Místo uložení',
              selector: 'relatedItem/location/physicalLocation',
              labelKey: 'relatedItem/location/physicalLocation',
              description: `Údaje o instituci, kde je fyzicky uložen daný konkrétní popisovaný dokument, např. NK ČR nutno použít kontrolovaný slovník – sigly knihovnen (ABA001 atd.) odpovídá poli 910 $a v MARC21<br\>
          Pozn. u dokumentů v digitální podobě není možné vyplnit`,
            },
            shelfLocator: {
              usage: 'MA',
              label: 'Signatura',
              selector: 'relatedItem/location/shelfLocator',
              labelKey: 'relatedItem/location/shelfLocator',
              description: `Signatura nebo lokační údaje o daném konkrétním dokumentu, který slouží jako předloha.`,
              fields: {
                value: {
                  usage: 'MA',
                  selector: 'relatedItem/location/shelfLocator/value',
                  labelKey: 'relatedItem/location/shelfLocator/value',
                  label: 'Hodnota',
                  help: 'off'
                },
              }
            },
            url: {
              usage: 'O',
              label: 'URL',
              selector: 'relatedItem/location/url',
              labelKey: 'relatedItem/location/url',
              description: `Pro uvedení lokace elektronického dokumentu`,
              fields: {
                value: {
                  usage: 'O',
                  selector: 'relatedItem/location/url/value',
                  labelKey: 'relatedItem/location/url/value',
                  label: 'Hodnota',
                  help: 'off'
                },
                note: {
                  usage: 'O',
                  selector: 'relatedItem/location/url/@note',
                  labelKey: 'relatedItem/location/url/@note',
                  cols: 2,
                  label: 'Note',
                  help: 'off'
                },
                usage: {
                  usage: 'O',
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
            }
          }
        },
        subject: {
          usage: 'R',
          label: 'Věcné třídění',
          selector: 'relatedItem/subject',
          labelKey: 'relatedItem/subject',
          description: `Údaje o věcném třídění<br/>
      Předpokládá se přebírání z katalogizačního záznamu`,
          fields: {
            authority: {
              usage: 'R',
              label: 'Autorita',
              selector: 'relatedItem/subject/@authority',
              labelKey: 'relatedItem/subject/@authority',
              description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>Konspekt</strong>, <strong>czmesh</strong>, <strong>mednas</strong><br/>
          Odpovídá hodnotě v $2`,
              options: [
                ['', '-'],
                ['czenas', 'czenas'],
                ['eczenas', 'eczenas'],
                ['mednas', 'mednas'],
                ['czmesh', 'czmesh'],
                ['Konspekt', 'Konspekt']
              ]
            },
            topic: {
              usage: 'R',
              label: 'Klíčové slovo/Předmětové heslo',
              selector: 'relatedItem/subject/topic',
              labelKey: 'relatedItem/subject/topic',
              description: `Libovolný výraz specifikující nebo charakterizující obsah periodika<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21 nebo obsah pole 072 $x`
            },
            geographic: {
              usage: 'R',
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
              description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21<br/>
          Struktura a atributy stejné jako pro údaje o původcích – viz element <name>`
            },
          }
        },
        language: {
          usage: 'MA',
          label: 'Jazyk',
          selector: 'relatedItem/language',
          labelKey: 'relatedItem/language',
          description: `Údaje o jazyce dokumentu`,
          fields: {
            objectPart: {
              usage: 'MA',
              label: 'Část',
              cols: 2,
              selector: 'relatedItem/language/@objectPart',
              labelKey: 'relatedItem/language/@objectPart',
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
              usage: 'MA',
              label: 'Jazyk',
              selector: 'relatedItem/language/languageTerm',
              labelKey: 'relatedItem/language/languageTerm',
              cols: 2,
              description: `Přesné určení jazyka`
            }
          }
        },
        abstract: {
          usage: 'R',
          label: 'Abstrakt',
          selector: 'relatedItem/abstract',
          labelKey: 'relatedItem/abstract',
          description: `Shrnutí obsahu jako celku odpovídá poli 520 MARC21`,
          fields: {
            abstract: {
              usage: 'R',
              label: 'Abstrakt',
              selector: 'relatedItem/abstract',
              labelKey: 'relatedItem/abstract',
              help: 'off'
            }
          }
        },
        physicalDescription: {
          usage: 'MA',
          label: 'Fyzický popis',
          selector: 'relatedItem/physicalDescription',
          labelKey: 'relatedItem/physicalDescription',
          description: `Obsahuje údaje o fyzickém popisu zdroje/předlohy`,
          fields: {
            extent: {
              usage: 'RA',
              label: 'Rozsah',
              selector: 'relatedItem/physicalDescription/extent',
              labelKey: 'relatedItem/physicalDescription/extent',
              description: `Údaje o rozsahu (stran, svazků nebo rozměrů)<br/>
          odpovídá hodnotě v poli 300, $a, $b a $c<br/>
          počet stránek bude vyjádřen ve fyzické strukturální mapě`,
            },
            note: {
              usage: 'RA',
              label: 'Poznámka',
              selector: 'relatedItem/physicalDescription/note',
              labelKey: 'relatedItem/physicalDescription/note',
              description: `Poznámka o fyzickém stavu dokumentu<br/>
          zde se zapíší defekty zjištěné při digitalizaci pro úroveň titulu periodika (např. chybějící ročník)`
            },
            form: {
              usage: 'MA',
              label: 'Forma',
              selector: 'relatedItem/physicalDescription/form',
              labelKey: 'relatedItem/physicalDescription/form',
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
                  usage: 'MA',
                  label: 'Autorita',
                  selector: 'relatedItem/physicalDescription/form/@authority',
                  labelKey: 'relatedItem/physicalDescription/form/@authority',
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
                  usage: 'MA',
                  label: 'Typ',
                  selector: 'relatedItem/physicalDescription/form/@type',
                  labelKey: 'relatedItem/physicalDescription/form/@type',
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
                  usage: 'MA',
                  label: 'Hodnota',
                  help: 'off'
                }
              }
            }
          }
        },
        note: {
          usage: 'RA',
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
        genre: {
          usage: 'MA',
          label: 'Žánr',
          selector: 'relatedItem/genre',
          labelKey: 'relatedItem/genre',
          description: `Bližší údaje o typu dokumentu<br/>
      Hodnota <strong>title</strong>`,
          fields: {
            value: {
              usage: 'MA',
              selector: 'relatedItem/genre/value',
              labelKey: 'relatedItem/genre/value',
              label: 'Hodnota',
              help: 'off'
            }
          }
        },
        classification: {
          usage: 'R',
          label: 'Klasifikace',
          selector: 'relatedItem/classification',
          labelKey: 'relatedItem/classification',
          description: `Klasifikační údaje věcného třídění podle Konspektu.<br/>
      Odpovídá poli 072 $a MARC21`,
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
              usage: 'MA',
              selector: 'relatedItem/classification/value',
              labelKey: 'relatedItem/classification/value',
              label: 'Hodnota',
              help: 'off'
            }
          }
        },
        typeOfResource: {
          usage: 'R',
          label: 'Typ zdroje',
          selector: 'relatedItem/typeOfResource',
          labelKey: 'relatedItem/typeOfResource',
          description: `Pro titul periodika hodnota <strong>text</strong><br/>
      mělo by se vyčítat z MARC21 katalogizačního záznamu, z pozice 06 návěští`,
          fields: {
            value: {
              usage: 'R',
              selector: 'relatedItem/typeOfResource/value',
              labelKey: 'relatedItem/typeOfResource/value',
              label: 'Typ zdroje',
              help: 'off',
              options: [
                ['', '-'],
                ['text', 'text']
              ]
            }
          }
        },
      }
    }
  };
}
