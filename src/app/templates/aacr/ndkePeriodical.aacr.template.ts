export class NdkePeriodicalAacrTemplate {

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
      usage: 'RA',
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
          usage: 'RA',
          label: 'Celé jméno',
          selector: 'name/namePart[not(@type)]',
          labelKey: 'name/namePart[not(@type)]',
          description: `Vyplnit pokud nelze rozlišit křestní jméno a příjmení.`
        },
        given: {
          usage: 'MA',
          label: 'Křestní',
          selector: 'name/namePart[@type=\'given\']',
          labelKey: 'name/namePart[@type=\'given\']',
          cols: 2,
          description: `Údaje o křestním jméně.<br/>
          V případě více křestních jmen se doporučuje
          uvést je společně ve stejném elementu , např. hodnota "Jan Amos"`
        },
        family: {
          usage: 'MA',
          label: 'Příjmení',
          selector: 'name/namePart[@type=\'family\']',
          labelKey: 'name/namePart[@type=\'family\']',
          cols: 2,
          description: `Údaje o příjmení.`
        },
        date: {
          usage: 'RA',
          label: 'Datum',
          selector: 'name/namePart[@type=\'date\']',
          labelKey: 'name/namePart[@type=\'date\']',
          cols: 2,
          description: `Životopisná data autora<br/>
          Pokud známe datum narození a úmrtí autora, vyplnit ve tvaru RRRR-RRRR.`
        },
        termsOfAddress: {
          usage: 'RA',
          label: 'Ostatní související se jménem',
          selector: 'name/namePart[@type=\'termsOfAddress\']',
          labelKey: 'name/namePart[@type=\'termsOfAddress\']',
          cols: 2,
          description: `Tituly a jiná slova nebo čísla související se jménem.`
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
            pokud má periodikum více vydavatelů, přebírají se ze záznamu všichni (v jednom poli 260)`,
        },
        dateIssued: {
          usage: 'M',
          label: 'Datum vydání',
          selector: 'originInfo/dateIssued',
          labelKey: 'originInfo/dateIssued',
          cols: 2,
          description: `Datum vydání předlohy, nutno zaznamenat rok/roky, v nichž časopis vycházel - formu zápisu přebírat z katalogu (např. 1900-1939)<br/>
            Odpovídá hodnotě z katalogizačního záznamu, pole 260 $c a pole 008/07-10`
        },
        qualifier: {
          usage: 'R',
          label: 'Upřesnění data',
          selector: 'originInfo/dateIssued/@qualifier',
          labelKey: 'originInfo/dateIssued/@qualifier',
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
          usage: 'R',
          label: 'Kódování',
          selector: 'originInfo/dateIssued/@encoding',
          labelKey: 'originInfo/dateIssued/@encoding',
          cols: 2,
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
          cols: 2,
          description: `Hodnoty "start" resp. "end" jen u údaje z pole 008, pro rozmezí dat`,
          options: [
            ['', '-'],
            ['start', 'start'],
            ['end', 'end']
          ]
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
          description: `Údaje o místě spojeném s vytvořením, vydáním, distribucí nebo výrobou popisovaného dokumentu<br/>
            odpovídá hodnotě 260 $a`
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
        url: {
          usage: 'O',
          label: 'URL',
          selector: 'location/url',
          labelKey: 'location/url',
          description: `Pro uvedení lokace elektronického dokumentu`
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
      usage: 'R',
      label: 'Jazyk',
      selector: 'language',
      labelKey: 'language',
      description: `Údaje o jazyce dokumentu`,
      fields: {
        language: {
          usage: 'M',
          label: 'Jazyk',
          selector: 'language/languageTerm',
          labelKey: 'language/languageTerm',
          description: `Přesné určení jazyka`
        }
      }
    },
    physicalDescription: {
      usage: 'MA',
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
            type: {
              usage: 'MA',
              label: 'Typ',
              selector: 'physicalDescription/form/@type',
              labelKey: 'physicalDescription/form/@type',
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
    genre: {
      usage: 'M',
      label: 'Žánr',
      selector: 'genre',
      labelKey: 'genre',
      description: `Bližší údaje o typu dokumentu<br/>
      Hodnota <strong>electronic_title</strong>`,
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
      selector: 'identifier',
      labelKey: 'identifier',
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
          </ul>`,
          options: [
            ['udc', 'udc']
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
    }
  };
}
