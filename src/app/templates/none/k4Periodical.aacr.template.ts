export class K4PeriodicalAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      labelKey: 'titleInfo',
      description: `Název periodika`,
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
          usage: 'M',
          label: 'Název',
          selector: 'titleInfo/title',
          labelKey: 'titleInfo/title',
          description: `Názvová informace – název periodika`
        },
        subTitle: {
          usage: 'MA',
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          labelKey: 'titleInfo/subTitle',
          description: `Podnázev periodika`
        },
      }
    },
    name: {
      usage: 'MA',
      label: 'Autor',
      selector: 'name',
      labelKey: 'name',
      description: `Údaje o odpovědnosti za periodikum`,
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
          description: `Jméno entity, která dokument vydala, vytiskla nebo jinak vyprodukovala<br/>
            Odpovídá poli 260 $b katalogizačního záznamu v MARC21.<br/>
            Pokud má monografie více vydavatelů, přebírají se za záznamu všichni (jsou v jednom poli 260).`,
        },
        dateIssued: {
          usage: 'M',
          label: 'Datum vydání',
          selector: 'originInfo/dateIssued',
          labelKey: 'originInfo/dateIssued',
          cols: 2,
          description: `Datum vydání předlohy.<br/>
            Přebírat z katalogu.<br/>
            Odpovídá hodnotě z katalogizačního záznamu, pole 260, $c a pole 008/07-10`,
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
          description: `Údaje o místě spojeném s vydáním, výrobou nebo původem popisovaného dokumentu.<br/>
            Odpovídá hodnotám z katalogizačního záznamu, pole 260, $a resp. pole 008/15-17`,
          fields: {
            authority: {
              usage: 'MA',
              label: 'Autorita',
              selector: 'originInfo/place/placeTerm/@authority',
              labelKey: 'originInfo/place/placeTerm/@authority',
              options: [
                ['marccountry', 'marccountry']]
            },
            type: {
              usage: 'M',
              label: 'Typ',
              selector: 'originInfo/place/placeTerm/@type',
              labelKey: 'originInfo/place/placeTerm/@type',
              options: [
                ['code', 'code'],
                ['text', 'text']]
            },
            value: {
              usage: 'M',
              label: 'Hodnota',
              help: 'off'
            }
          }
        },
        dateCreated: {
          usage: 'R',
          label: 'Datum vytvoření',
          selector: 'originInfo/dateCreated',
          labelKey: 'originInfo/dateCreated',
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
      }
    },
    language: {
      usage: 'M',
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
      }
    },
    note: {
      usage: 'RA',
      label: 'Poznámka',
      selector: 'note',
      labelKey: 'note',
      description: `Obecná poznámka k periodiku`,
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
      odpovídá poli 080 MARC21
      `,
      fields: {
        authority: {
          usage: 'M',
          label: 'Autorita',
          selector: 'classification/@authority',
          labelKey: 'classification/@authority',
          description: `Vyplnit hodnotu <strong>udc</strong>`,
          options: [
            ['udc', 'udc'],
            ['ddc', 'ddc'],
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
    }
  };
}
