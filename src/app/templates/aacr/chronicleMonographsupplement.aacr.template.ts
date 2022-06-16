export class ChronicleMonographsupplementAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Informace o názvu',
      selector: 'titleInfo',
      labelKey: 'titleInfo',
      description: `Název přílohy krameria`,
      fields: {
        title: {
          usage: 'M',
          label: 'Název',
          selector: 'titleInfo/title',
          labelKey: 'titleInfo/title',
          description: `Název přílohy kroniky.`
        },
        subTitle: {
          usage: 'MA',
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          labelKey: 'titleInfo/subTitle',
          description: `Podnázev přílohy kroniky.`
        },
        partNumber: {
          usage: 'R',
          label: 'Díl',
          selector: 'titleInfo/partNumber',
          labelKey: 'titleInfo/partNumber',
          cols: 2,
          description: `Číslo části<br/>
            V případě, že se jedná o vícesvazkovou kroniku je zde uvedeno číslo přílohy.`
        },
        partName: {
          usage: 'R',
          label: 'Část',
          selector: 'titleInfo/partName',
          labelKey: 'titleInfo/partName',
          cols: 2,
          description: `Název části<br/>
            V případě, že se jedná o vícesvazkovou kroniku je zde uveden název přílohy.`
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
          description: `Datum vydání kroniky.`
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
          label: 'Datum činnosti',
          selector: "name/namePart[@type='date']",
          labelKey: "name/namePart[@type='date']",
          cols: 2,
          description: `Životopisná data autora<br/>
          Pokud známe datum narození a úmrtí autora, vyplnit ve tvaru RRRR-RRRR.`
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
