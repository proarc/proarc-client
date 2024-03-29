export class ChronicleMonographtitleAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Informace o názvu',
      selector: 'titleInfo',
      labelKey: 'titleInfo',
      description: `Název titulu, souborný název`,
      fields: {
        title: {
          usage: 'M',
          label: 'Název',
          selector: 'titleInfo/title',
          labelKey: 'titleInfo/title',
          description: `Název svazku kroniky.`
        },
        subTitle: {
          usage: 'MA',
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          labelKey: 'titleInfo/subTitle',
          description: `Podnázev svazku kroniky.`
        },
        partNumber: {
          usage: 'R',
          label: 'Díl',
          selector: 'titleInfo/partNumber',
          labelKey: 'titleInfo/partNumber',
          cols: 2,
          description: `Číslo části<br/>
            V případě, že se jedná o vícesvazkovou kroniku je zde uvedeno číslo svazku.`
        },
        partName: {
          usage: 'R',
          label: 'Část',
          selector: 'titleInfo/partName',
          labelKey: 'titleInfo/partName',
          cols: 2,
          description: `Název části<br/>
            V případě, že se jedná o vícesvazkovou kroniku je zde uveden název svazku.`
        }
      }
    },
    originInfo: {
      usage: 'M',
      label: 'Informace o místě a data vzniku',
      selector: 'originInfo',
      labelKey: 'originInfo',
      description: `Informace o místě a datu vzniku kroniky.`,
      fields: {
        dateIssued: {
          usage: 'O',
          label: 'Datum vzniku',
          selector: 'originInfo/dateIssued',
          labelKey: 'originInfo/dateIssued',
          description: `Datum vydání kroniky.`,
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
              label: 'Odhad',
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
            point: {
              usage: 'O',
              label: 'Rozmezí',
              selector: 'originInfo/dateIssued/@point',
              labelKey: 'originInfo/dateIssued/@point',
              cols: 2,
              description: `Hodnoty „Od“ resp. „Do“ jen u údaje pro rozmezí dat.`,
              options: [
                ['', '-'],
                ['start', 'Od'],
                ['end', 'Do']
              ]
            },
          }
        },
        place: {
          usage: 'O',
          label: 'Místo vzniku',
          selector: 'originInfo/place/placeTerm',
          labelKey: 'originInfo/place/placeTerm',
          description: `Údaje o místě spojeném s vydáním, výrobou nebo původem popisovaného dokumentu.`
        },
      }
    },
    language: {
      usage: 'O',
      label: 'Jazyk',
      selector: 'language',
      labelKey: 'language',
      description: `Údaje o jazyce dokumentu. V případě vícenásobného výskytu nutno element &lt;language> opakovat`,
      fields: {
        language: {
          usage: 'M',
          label: 'Jazyk',
          selector: 'language/languageTerm',
          labelKey: 'language/languageTerm',
          description: `Přesné určení jazyka kódem.<br/>Nutno použít kontrolovaný slovník ISO 639-2.`
        }
      }
    },
    genre: {
      usage: 'M',
      label: 'Charakter kroniky',
      selector: 'genre',
      labelKey: 'genre',
      description: `Bližší údaje o typu dokumentu.<p>Pro svazek kroniky hodnota “kronika”.`,
      fields: {
        value: {
          usage: 'M',
          selector: 'genre/value',
          labelKey: 'genre/value',
          cols: 3,
          label: 'Evidenční jednotka',
          description: `Možnosti
                <ul>
                <li>Kronika (hodnota kronika)</li>
                <li>Úřední kniha (hodnota ukn)</li>
                <li>Rukopis (hodnota rkp)</li>
                </ul>`,
          options: [
            ['kronika', 'Kronika'],
            ['ukn', 'Úřední kniha'],
            ['rkp', 'Rukopis']
          ]
        },
        type: {
          usage: 'R',
          label: 'Typ obsahu',
          cols: 3,
          selector: 'genre/@type',
          labelKey: 'genre/@type',
          options: [
            ['skolniKronika', 'Školní kronika'],
            ['obecniKronika', 'Obecní kronika'],
            ['spolecenskaKronika', 'Společenská kronika (spolková)'],
            ['obcanske', 'Občanská'],
            ['osadni', 'Osadní (kronika místních částí)'],
            ['podnikova', 'Podnikové (firmy)'],
            ['vojenske', 'Vojenské a jiné (ZV, odborové, ...'],
            ['cirkevni', 'Církevní'],
            ['unspecified', 'Nespecifikováno']
          ]
        },
        lang: {
          usage: 'R',
          label: 'Čísla',
          cols: 3,
          selector: 'genre/@lang',
          labelKey: 'genre/@lang',
        }
      }
    },
    identifier: {
      usage: 'M',
      label: 'Identifikátor',
      selector: 'identifier',
      labelKey: 'identifier',
      description: `Údaje o identifikátorech.<br/>
        Obsahuje unikátní identifikátory mezinárodní nebo lokální.<br/>
        Uvádějí se i neplatné resp. zrušené identifikátory - atribut invalid=“yes“.`,
      fields: {
        type: {
          usage: 'M',
          label: 'Typ',
          selector: 'identifier/@type',
          labelKey: 'identifier/@type',
          cols: 2,
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
    location: {
      usage: 'MA',
      label: 'Umístění',
      selector: 'location',
      labelKey: 'location',
      description: `Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.`,
      fields: {
        physicalLocation: {
          usage: 'MA',
          label: 'Název archivu',
          selector: 'location/physicalLocation',
          labelKey: 'location/physicalLocation',
        },
      }
    },
    abstract: {
      usage: 'R',
      label: 'Obsah, regest',
      selector: 'abstract',
      labelKey: 'abstract',
      description: `Obsah, regest`,
      fields: {
        abstract: {
          usage: 'RA',
          label: 'Obsah, regest',
          selector: 'abstract',
          labelKey: 'abstract/value',
          help: 'off'
        }
      }
    },
    name: {
      usage: 'MA',
      label: 'Osoba, které se podílela na vzniku',
      selector: 'name',
      labelKey: 'name',
      description: `Údaje o odpovědnosti za kroniku`,
      fields: {
        namePart: {
          usage: 'MA',
          label: 'Jméno',
          selector: 'name/namePart',
          labelKey: 'name/namePart',
          description: `Vyplnit údaje o autorovi.`,
          fields: {
            type: {
              usage: 'R',
              label: 'Typ',
              selector: 'name/namePart/@type',
              labelKey: 'name/namePart/@type',
              cols: 2,
              description: `Použít jednu z hodnot:
                <ul>
                    <li><strong>Křestní jméno</strong> (given)</li>
                    <li><strong>Příjmení</strong> (family)</li>
                    <li><strong>Datum</strong> (date)</li>
                    <li><strong>Ostatní související se jménem</strong> (termsOfAddress)</li>
                </ul>`,
              options: [
                ['', '-'],
                ['given', 'Křestní jméno'],
                ['family', 'Příjmení'],
                ['date', 'Datum'],
                ['termsOfAddress', 'Ostatní související se jménem'],
              ]
            },
            value: {
              label: 'Hodnota',
              usage: 'M',
              selector: 'name/namePart',
              labelKey: 'name/namePart/value',
              cols: 2,
              help: 'off'
            }
          }
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
    note: {
      usage: 'RA',
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
        },
        type: {
          usage: 'R',
          label: 'Typ',
          selector: 'note/@type',
          labelKey: 'note/@type',
          options: [
            ['private', 'Nepublikovatelná'],
            ['public', 'Veřejná']
          ]
        }
      }
    },
  };
}
