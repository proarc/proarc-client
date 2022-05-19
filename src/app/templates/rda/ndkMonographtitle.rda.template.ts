export class NdkMonographTitleRdaTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      description: `Název titulu, souborný název<br/>
      Pro plnění použít katalogizační záznam<br/>`,
      fields: {
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
          description: `Názvová informace – název monografického dokumentu</br>
          hodnoty převzít z katalogu<br/>`
        },
        subTitle: {
          usage: "MA",
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          cols: 2,
          description: `Podnázev monografie`
        },
        partNumber: {
          usage: "R",
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          cols: 2,
          description: `Číslo svazku souborného záznamu, pokud existuje`
        },
        partName: {
          usage: "R",
          label: 'Název části',
          selector: 'titleInfo/partName',
          cols: 2,
          description: `Název svazku souborného záznamu, pokud existuje`
        }
      }
    },
    originInfo: {
      usage: "M",
      label: "Původ předlohy",
      selector: 'originInfo',
      description: `Informace o původu předlohy: odpovídá poli 264`,
      fields: {
        eventType: {
          usage: "M",
          label: "Typ",
          selector: 'originInfo/@eventType',
          cols: 2,
          description:`Hodnoty dle druhého indikátoru pole 264:
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
            ['','-'],
            ['production', 'Produkce'],
            ['publication', 'Publikace'],
            ['distribution', 'Distribuce'],
            ['manufacture', 'Výroba'],
            ['copyright', 'Copyright']
          ]
        },
        publisher: {
          usage: "MA",
          label: "Nakladatel",
          cols: 2,
          selector: 'originInfo/publisher',
          description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 264 $b katalogizačního záznamu v MARC21<br/>
            pokud má monografie více vydavatelů/distributorů/výrobců, přebírají se ze záznamu všichni (v jednom poli 264)`,
        },
        dateIssued: {
          usage: "O",
          label: "Datum vydání",
          selector: 'originInfo/dateIssued',
          cols: 2,
          description:`Datum vydání předlohy.<br/>
            Přebírat z katalogu.<br/>
            Odpovídá hodnotě z katalogizačního záznamu, pole 264_1 $c a pole 008/07-10<br/>
            Pro všechny ostatní výskyty v poli 264 $c:
            <ul>
              <li>264_0 <strong>Produkce</strong> (production)</li>
              <li>264_2 <strong>Distribuce</strong> (distribution)</li>
              <li>264_3 <strong>Výroba</strong> (manufacture)</li>
              <li>264_4 <strong>Copyright</strong> (copyright)</li>
            </ul>
            využít pole <strong>Datum - jiné</strong> s odpovídajícím polem <strong>type</strong> či pole <strong>copyrightDate</strong>`
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
        encoding: {
          usage: "O",
          label: "Kódování",
          selector: 'originInfo/dateIssued/@encoding',
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
          usage: "O",
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
        edition: {
          usage: "O",
          label: "Edice",
          selector: 'originInfo/edition',
          cols: 2,
          description:`Údaj o pořadí vydání, odpovídá poli 250 $a katalogizačního záznamu.`
        },
        issuance: {
          usage: "O",
          label: "Vydání",
          selector: 'originInfo/issuance',
          cols: 2,
          description:`Údaje o vydávání odpovídá hodnotě uvedené v návěští MARC21 na pozici 07<br/>
            Možné hodnoty
            <ul>
              <li>Monografické (monographic)</li>
              <li>Vícedílné (multipart monograph)</li>
              <li>Jednotkové (single unit)</li>
            </ul>`,
          options: [
            ['', '-'],
            ['monographic','Monografické'],
            ['single unit','Jednotkové'],
            ['multipart monograph','Vícedílné']
          ]
        },
        place: {
          usage: "O",
          label: "Místo",
          selector: 'originInfo/place/placeTerm',
          cols: 2,
          description:`Údaje o místě spojeném s vytvořením, vydáním, distribucí nebo výrobou popisovaného dokumentu<br/>
            odpovídá hodnotě 264 $a`
        },
        dateCreated: {
          usage: "O",
          label: "Datum vytvoření",
          selector: 'originInfo/dateCreated',
          cols: 3,
          description:`Datum vydání předlohy pro rukopisy
          přebírat z katalogu<br/>
          odpovídá hodnotě z katalogizačního záznamu, pole 264_0 $c pokud je LDR/06="d", "f", "t"`
        },
        dateOther: {
          usage: "O",
          label: "Datum - jiné",
          selector: 'originInfo/dateOther',
          cols: 3,
          description:`Datum vytvoření, distribuce, výroby předlohy<br/>
          Tento elemet se využije v případě výskytu $c v:
          <ul>
            <li>264_0 <strong>Produkce</strong> (production)</li>
            <li>264_2 <strong>Distribuce</strong> (distribution)</li>
            <li>264_3 <strong>Výroba</strong> (manufacture)</li>
          </ul>`
        },
        copyrightDate: {
          usage: "O",
          label: "Datum - copyright",
          selector: 'originInfo/copyrightDate',
          cols: 3,
          description:`Využije se pouze v případě výskytu pole 264 s druhým indikátorem 4 a podpolem $c<br/>
          <ul>
            <li>264_4 <strong>Copyright</strong> (copyright)</li>
          </ul>`
        }
      }
    },
    language: {
      usage: "O",
      label: "Jazyk",
      selector: 'language',
      description: `Údaje o jazyce dokumentu`,
      fields: {
        objectPart: {
          usage: "O",
          label: "Část",
          selector: 'language/@objectPart',
          description: `Možné hodnoty<br/>
          <ul>
            <li><strong>Překlad</strong> (translation) - odpovídá poli 041 $h</li>
          </ul>`,
          options: [
            ['', '-'],
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
      identifikátory mezinárodní nebo lokální, které svazek monografického dokumentu má.`,
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
                převzít z katalogizačního záznamu z pole 015, $a, $z - celého souboru
              </li>
              <li>
                <strong>ISBN</strong> (isbn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 020, $a, $z - celého souboru
              </li>
              <li>
                <strong>ISMN</strong> (ismn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 024 (1. ind.="2"), $a, $z - celého souboru
              </li>
            </ul>`
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
