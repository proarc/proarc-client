export class NdkeMonographVolumeAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      labelKey: 'titleInfo',
      description: `Název svazku monografie<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má monografie více typů názvů, element se opakuje podle potřeby`,
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
          description: `Názvová informace – název svazku monografie</br>
          hodnoty převzít z katalogu<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        subTitle: {
          usage: 'MA',
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          labelKey: 'titleInfo/subTitle',
          description: `Podnázev svazku monografie<br/>
          odpovídající pole a podpole podle typu, viz typ`
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
      description: `Údaje o odpovědnosti za svazek<br/>
      POZOR – údaje o odpovědnosti nutno přebírat z polí 1XX a 7XX MARCu21<br/>
      pokud má monografie autora a ilustrátora, element <name> se opakuje s různými rolemi`,
      fields: {
        type: {
          usage: 'MA',
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
          usage: 'MA',
          label: 'Celé jméno',
          selector: 'name/namePart[not(@type)]',
          labelKey: 'name/namePart[not(@type)]',
          description: `Vyplnit pokud nelze rozlišit křestní jméno a příjmení.`
        },
        given: {
          usage: 'M',
          label: 'Křestní',
          selector: "name/namePart[@type='given']",
          labelKey: "name/namePart[@type='given']",
          cols: 2,
          description: `Údaje o křestním jméně.<br/>
          V případě více křestních jmen se doporučuje
          uvést je společně ve stejném elementu , např. hodnota "Jan Amos"`
        },
        family: {
          usage: 'M',
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
        etal: {
          usage: 'O',
          label: 'Etal',
          selector: 'name/etal',
          labelKey: 'name/etal',
          cols: 2,
          description: `Element indikující, že existuje více autorů, než pouze ti, kteří byli uvedeni v <name> elementu.</br>`
        },
        nameIdentifier: {
          usage: 'RA',
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
      description: `Informace o původu předlohy: odpovídá poli 260`,
      fields: {
        publisher: {
          usage: 'MA',
          label: 'Nakladatel',
          selector: 'originInfo/publisher',
          labelKey: 'originInfo/publisher',
          description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 260 $b katalogizačního záznamu v MARC21<br/>
            pokud má monografie více vydavatelů/distributorů/výrobců, přebírají se ze záznamu všichni (v jednom poli 260)`,
        },
        dateIssued: {
          usage: 'MA',
          label: 'Datum vydání',
          selector: 'originInfo/dateIssued',
          labelKey: 'originInfo/dateIssued',
          cols: 2,
          description: `Datum vydání předlohy.<br/>
            Přebírat z katalogu.`,
          fields: {
            value: {
              usage: 'MA',
              selector: 'originInfo/dateIssued/value',
              labelKey: 'originInfo/dateIssued/value',
              label: 'Hodnota',
              help: 'off'
            },
            qualifier: {
              usage: 'O',
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
              usage: 'O',
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
        edition: {
          usage: 'R',
          label: 'Vydání',
          selector: 'originInfo/edition',
          labelKey: 'originInfo/edition',
          cols: 2,
          description: `Údaj o pořadí vydání, odpovídá poli 250 $a katalogizačního záznamu.`
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
          usage: 'MA',
          label: 'Místo',
          selector: 'originInfo/place/placeTerm',
          labelKey: 'originInfo/place/placeTerm',
          description: `Údaje o místě spojeném s vytvořením, vydáním, distribucí nebo výrobou popisovaného dokumentu<br/>
            odpovídá hodnotě 260 $a`
        },
      }
    },
    location: {
      usage: 'MA',
      label: 'Uložení',
      selector: 'location',
      labelKey: 'location',
      description: `Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.`,
      fields: {
        shelfLocator: {
          usage: 'RA',
          label: 'Signatura',
          selector: 'location/shelfLocator',
          labelKey: 'location/shelfLocator',
          description: `Signatura nebo lokační údaje o daném konkrétním dokumentu, který slouží jako předloha.`,
          fields: {
            value: {
              usage: 'RA',
              selector: 'location/shelfLocator/value',
              labelKey: 'location/shelfLocator/value',
              label: 'Hodnota',
              help: 'off'
            },
          }
        },
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
    subject: {
      usage: 'RA',
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
          description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong><br/>
          Odpovídá hodnotě v $2`,
          options: [
            ['', '-'],
            ['czenas', 'czenas'],
            ['eczenas', 'eczenas'],
            ['mednas', 'mednas'],
            ['czmesh', 'czmesh'],
            ['msvkth', 'msvkth'],
            ['agrovoc', 'agrovoc']
          ]
        },
        topic: {
          usage: 'O',
          label: 'Klíčové slovo/Předmětové heslo',
          selector: 'subject/topic',
          labelKey: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah svazku monografie<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21 nebo obsah pole 072 $x`
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
          usage: 'R',
          label: 'Část',
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
          usage: 'RA',
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
        digitalOrigin: {
          usage: 'M',
          label: 'Zdroje digitálního dokumentu',
          selector: 'physicalDescription/digitalOrigin',
          labelKey: 'physicalDescription/digitalOrigin',
          description: `Indikátor zdroje digitálního dokumentu hodnota <strong>born digital</strong>`,
          options: [
            ['', '-'],
            ['born digital', 'born digital']
          ]
        },
        form: {
          usage: 'MA',
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
              </ul>`,
              options: [
                ['marcform', 'marcform'],
                ['marccategory', 'marccategory'],
                ['marcsmd', 'marcsmd'],
                ['gmd', 'gmd'],
              ]
            },
            value: {
              usage: 'MA',
              selector: 'physicalDescription/form/value',
              labelKey: 'physicalDescription/form/value',
              label: 'Hodnota',
              help: 'off'
            }
          }
        },
        extent: {
          usage: 'RA',
          label: 'Rozsah',
          selector: 'physicalDescription/extent',
          labelKey: 'physicalDescription/extent',
          description: `Údaje o rozsahu (stran, svazků nebo rozměrů)<br/>
          odpovídá hodnotě v poli 300, $a, $b a $c<br/>
          počet stránek bude vyjádřen ve fyzické strukturální mapě`,
        },
      }
    },
    note: {
      usage: 'O',
      label: 'Poznámka',
      selector: 'note',
      labelKey: 'note',
      description: `Obecná poznámka ke svazku monografie jako celku<br/>
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
      Pro monografie hodnota <strong>electronic volume</strong>`,
      fields: {
        value: {
          usage: 'M',
          selector: 'genre/value',
          labelKey: 'genre/value',
          label: 'Hodnota',
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
      description: `Klasifikační údaje věcného třídění podle Mezinárodního desetinného třídění<br/>
      odpovídá poli 080 MARC21`,
      fields: {
        authority: {
          usage: 'M',
          label: 'Autorita',
          selector: 'classification/@authority',
          labelKey: 'classification/@authority',
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
        value: {
          usage: 'R',
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
      description: `Pro monografie hodnota <strong>text</strong><br/>
      mělo by se vyčítat z MARC21 katalogizačního
      záznamu, z pozice 06 návěští`,
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
          selector: 'recordInfo/recordOrigin',
          labelKey: 'recordInfo/recordOrigin',
          cols: 2,
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
          description: `Název svazku monografie<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má monografie více typů názvů, element se opakuje podle potřeby`,
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
              description: `Názvová informace – název svazku monografie</br>
          hodnoty převzít z katalogu<br/>
          odpovídající pole a podpole podle typu, viz typ`
            },
            subTitle: {
              usage: 'MA',
              label: 'Podnázev',
              selector: 'relatedItem/titleInfo/subTitle',
              labelKey: 'relatedItem/titleInfo/subTitle',
              description: `Podnázev svazku monografie<br/>
          odpovídající pole a podpole podle typu, viz typ`
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
          description: `Údaje o odpovědnosti za svazek<br/>
      POZOR – údaje o odpovědnosti nutno přebírat z polí 1XX a 7XX MARCu21<br/>
      pokud má monografie autora a ilustrátora, element <name> se opakuje s různými rolemi`,
          fields: {
            type: {
              usage: 'MA',
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
              usage: 'MA',
              label: 'Celé jméno',
              selector: 'relatedItem/name/namePart[not(@type)]',
              labelKey: 'relatedItem/name/namePart[not(@type)]',
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
            etal: {
              usage: 'O',
              label: 'Etal',
              selector: 'relatedItem/name/etal',
              labelKey: 'relatedItem/name/etal',
              cols: 2,
              description: `Element indikující, že existuje více autorů, než pouze ti, kteří byli uvedeni v <name> elementu.</br>`
            },
            nameIdentifier: {
              usage: 'RA',
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
          description: `Informace o původu předlohy: odpovídá poli 260`,
          fields: {
            publisher: {
              usage: 'MA',
              label: 'Nakladatel',
              selector: 'relatedItem/originInfo/publisher',
              labelKey: 'relatedItem/originInfo/publisher',
              description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 260 $b katalogizačního záznamu v MARC21<br/>
            pokud má monografie více vydavatelů/distributorů/výrobců, přebírají se ze záznamu všichni (v jednom poli 260)`,
            },
            dateIssued: {
              usage: 'MA',
              label: 'Datum vydání',
              selector: 'relatedItem/originInfo/dateIssued',
              labelKey: 'relatedItem/originInfo/dateIssued',
              cols: 2,
              description: `Datum vydání předlohy.<br/>
            Přebírat z katalogu.`,
              fields: {
                value: {
                  usage: 'MA',
                  selector: 'relatedItem/originInfo/dateIssued/value',
                  labelKey: 'relatedItem/originInfo/dateIssued/value',
                  label: 'Hodnota',
                  help: 'off'
                },
                qualifier: {
                  usage: 'O',
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
                  usage: 'O',
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
            edition: {
              usage: 'R',
              label: 'Vydání',
              selector: 'relatedItem/originInfo/edition',
              labelKey: 'relatedItem/originInfo/edition',
              cols: 2,
              description: `Údaj o pořadí vydání, odpovídá poli 250 $a katalogizačního záznamu.`
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
              usage: 'MA',
              label: 'Místo',
              selector: 'relatedItem/originInfo/place/placeTerm',
              labelKey: 'relatedItem/originInfo/place/placeTerm',
              description: `Údaje o místě spojeném s vytvořením, vydáním, distribucí nebo výrobou popisovaného dokumentu<br/>
            odpovídá hodnotě 260 $a`
            },
          }
        },
        location: {
          usage: 'MA',
          label: 'Uložení',
          selector: 'relatedItem/location',
          labelKey: 'relatedItem/location',
          description: `Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.`,
          fields: {
            shelfLocator: {
              usage: 'RA',
              label: 'Signatura',
              selector: 'relatedItem/location/shelfLocator',
              labelKey: 'relatedItem/location/shelfLocator',
              description: `Signatura nebo lokační údaje o daném konkrétním dokumentu, který slouží jako předloha.`,
              fields: {
                value: {
                  usage: 'RA',
                  selector: 'relatedItem/location/shelfLocator/value',
                  labelKey: 'relatedItem/location/shelfLocator/value',
                  label: 'Hodnota',
                  help: 'off'
                },
              }
            },
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
        subject: {
          usage: 'RA',
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
              description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong><br/>
          Odpovídá hodnotě v $2`,
              options: [
                ['', '-'],
                ['czenas', 'czenas'],
                ['eczenas', 'eczenas'],
                ['mednas', 'mednas'],
                ['czmesh', 'czmesh'],
                ['msvkth', 'msvkth'],
                ['agrovoc', 'agrovoc']
              ]
            },
            topic: {
              usage: 'O',
              label: 'Klíčové slovo/Předmětové heslo',
              selector: 'relatedItem/subject/topic',
              labelKey: 'relatedItem/subject/topic',
              description: `Libovolný výraz specifikující nebo charakterizující obsah svazku monografie<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21 nebo obsah pole 072 $x`
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
              usage: 'R',
              label: 'Část',
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
              usage: 'RA',
              label: 'Abstrakt',
              selector: 'relatedItem/abstract',
              labelKey: 'relatedItem/abstract/value',
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
                    ['gmd', 'gmd'],
                  ]
                },
                value: {
                  usage: 'MA',
                  selector: 'relatedItem/physicalDescription/form/value',
                  labelKey: 'relatedItem/physicalDescription/form/value',
                  label: 'Hodnota',
                  help: 'off'
                }
              }
            },
            extent: {
              usage: 'RA',
              label: 'Rozsah',
              selector: 'relatedItem/physicalDescription/extent',
              labelKey: 'relatedItem/physicalDescription/extent',
              description: `Údaje o rozsahu (stran, svazků nebo rozměrů)<br/>
          odpovídá hodnotě v poli 300, $a, $b a $c<br/>
          počet stránek bude vyjádřen ve fyzické strukturální mapě`,
            },
          }
        },
        note: {
          usage: 'O',
          label: 'Poznámka',
          selector: 'relatedItem/note',
          labelKey: 'relatedItem/note',
          description: `Obecná poznámka ke svazku monografie jako celku<br/>
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
      Pro monografie hodnota <strong>electronic volume</strong>`,
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
          description: `Klasifikační údaje věcného třídění podle Mezinárodního desetinného třídění<br/>
      odpovídá poli 080 MARC21`,
          fields: {
            authority: {
              usage: 'MA',
              label: 'Autorita',
              selector: 'relatedItem/classification/@authority',
              labelKey: 'relatedItem/classification/@authority',
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
            value: {
              usage: 'R',
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
          description: `Pro monografie hodnota <strong>text</strong><br/>
      mělo by se vyčítat z MARC21 katalogizačního
      záznamu, z pozice 06 návěští`,
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
