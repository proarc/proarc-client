export class OldprintGraphicsRdaTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      labelKey: 'titleInfo',
      description: `Název grafického dokumentu`,
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
          description: `Názvová informace – název grafického dokumentu`
        },
        subTitle: {
          usage: 'MA',
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          labelKey: 'titleInfo/subTitle',
          description: `Podnázev grafického dokumentu<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        partNumber: {
          usage: 'MA',
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          labelKey: 'titleInfo/partNumber',
          cols: 2,
          description: `Číslo části`
        },
        partName: {
          usage: 'MA',
          label: 'Název části',
          selector: 'titleInfo/partName',
          labelKey: 'titleInfo/partName',
          cols: 2,
          description: `Název části`
        }
      }
    },
    name: {
      usage: 'MA',
      label: 'Autor',
      selector: 'name',
      labelKey: 'name',
      description: `Údaje o odpovědnosti za grafický dokument<br/>
      POZOR – údaje o odpovědnosti nutno přebírat z polí 1XX a 7XX MARCu21<br/>
      pokud má grafický dokument jiné původce než je autor, element <name> se opakuje s různými rolemi.`,
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
          usage: 'M',
          label: 'Role',
          selector: 'name/role/roleTerm',
          labelKey: 'name/role/roleTerm',
          expanded: true,
          description: `Specifikace role osoby nebo organizace<br/>
          Kód role z kontrolovaného slovníku rolí
          (<a href=\"http://www.loc.gov/marc/relators/relaterm.html\" target=\"_blank\">http://www.loc.gov/marc/relators/relaterm.html</a>)`,
          fields: {},
        },
        nameIdentifier: {
          usage: 'RA',
          label: 'Identifikátor autora',
          selector: 'name/nameIdentifier',
          labelKey: 'name/nameIdentifier',
          cols: 2,
          description: `Číslo národní autority`,
        },
        etal: {
          usage: 'O',
          label: 'Etal',
          selector: 'name/etal',
          labelKey: 'name/etal',
          cols: 2,
          description: `Element indikující, že existuje více autorů, než pouze ti, kteří byli uvedeni v <name> elementu.</br>
          V případě užití tohoto elementu je dále top element <name> neopakovatelný.</br>
          <etal> je nutné umístit do samostatného top elementu <name>, ve kterém se nesmí objevit subelementy <namePart> a <nameIdentifier>.`
        }
      }
    },
    originInfo: {
      usage: 'M',
      label: 'Původ předlohy',
      selector: 'originInfo',
      labelKey: 'originInfo',
      description: `Informace o původu předlohy: odpovídá poli 264`,
      fields: {
        publisher: {
          usage: 'MA',
          label: 'Nakladatel',
          selector: 'originInfo/publisher',
          labelKey: 'originInfo/publisher',
          description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 264 $b katalogizačního záznamu v MARC21<br/>
            pokud má dokument více vydavatelů/distributorů/výrobců, přebírají se ze záznamu všichni (v jednom poli 264)`,
        },
        eventType: {
          usage: 'M',
          label: 'Typ',
          selector: 'originInfo/@eventType',
          labelKey: 'originInfo/@eventType',
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
          usage: 'M',
          label: 'Datum vydání',
          selector: 'originInfo/dateIssued',
          labelKey: 'originInfo/dateIssued',
          cols: 2,
          description: `Datum vydání předlohy.<br/>
            Přebírat z katalogu.<br/>
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
          description: `Datum vytvoření, distribuce, výroby předlohy<br/>
          Tento elemet se využije v případě výskytu $c v:
          <ul>
            <li>264_0 <strong>Produkce</strong> (production)</li>
            <li>264_2 <strong>Distribuce</strong> (distribution)</li>
            <li>264_3 <strong>Výroba</strong> (manufacture)</li>
          </ul>`
        },
        dateOther: {
          usage: 'R',
          label: 'Datum - jiné',
          selector: 'originInfo/dateOther',
          labelKey: 'originInfo/dateOther',
          cols: 2,
          description: `Datum vytvoření, distribuce, výroby přílohy (bude použito i při popisu tiskaře, viz poznámka u elementu
            <strong>Nakladatel</strong> nebo např. u popisu CD/DVD apod.)<br/>
            tento elemet se využije v případě výskytu $c v::
          <ul>
            <li>264_0 <strong>Produkce</strong> (production)</li>
            <li>264_2 <strong>Distribuce</strong> (distribution)</li>
            <li>264_3 <strong>Výroba</strong> (manufacture)</li>
          </ul>`
        },
        copyrightDate: {
          usage: 'R',
          label: 'Datum - copyright',
          selector: 'originInfo/copyrightDate',
          labelKey: 'originInfo/copyrightDate',
          cols: 2,
          description: `Využije se pouze v případě výskytu pole 264 s druhým indikátorem 4 a podpolem $c<br/>
          <ul>
            <li>264_4 <strong>Copyright</strong> (copyright)</li>
          </ul>`
        }
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
          description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong><br/>
          Odpovídá hodnotě v $2`,
          options: [
            ['', '-'],
            ['czenas', 'czenas'],
            ['eczenas', 'eczenas'],
            ['mednas', 'mednas'],
            ['czmesh', 'czmesh'],
            ['msvkth', 'msvkth'],
            ['agrovoc', 'agrovoc'],
            ['Konspekt', 'Konspekt']
          ]
        },
        topic: {
          usage: 'R',
          label: 'Klíčové slovo/Předmětové heslo',
          selector: 'subject/topic',
          labelKey: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah svazku monografie<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21`
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
          description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21`,
          fields: {
            type: {
              usage: 'M',
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
        }
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
          description: `Poznámka o fyzickém stavu dokumentu`,
        },
        form: {
          usage: 'M',
          label: 'Forma',
          selector: 'physicalDescription/form',
          labelKey: 'physicalDescription/form',
          description: `Údaje o fyzické podobě dokumentu odpovídá hodnotě v poli 008/23<br/>
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
    note: {
      usage: 'RA',
      label: 'Poznámka',
      selector: 'note',
      labelKey: 'note',
      description: `Obecná poznámka ke grafickému dokumentu jako celku<br/>
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
      description: `Bližší údaje o typu dokumentu`,
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
      description: `Údaje o identifikátorech, obsahuje unikátní identifikátory mezinárodní nebo lokální, které dokument obsahuje.`,
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
          cols: 2,
          selector: 'classification/@authority',
          labelKey: 'classification/@authority',
          description: `Vyplnit hodnotu <strong>udc</strong>`,
          options: [
            ['udc', 'udc'],
            ['Konspekt', 'Konspekt']
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
      description: `Pro grafické dokumenty hodnota <strong>graphics</strong><br/>`,
      fields: {
        value: {
          usage: 'R',
          selector: 'typeOfResource/value',
          labelKey: 'typeOfResource/value',
          label: 'Typ zdroje',
          help: 'off',
          options: [
            ['', '-'],
            ['graphics', 'graphics'],
            ['photo', 'photo'],
            ['notated music', 'notated music']
          ]
        }
      }
    },
    part: {
      usage: 'O',
      label: 'Popis části',
      selector: 'part',
      labelKey: 'part',
      description: `Popis části.`,
      fields: {
        type: {
          usage: 'O',
          label: 'Typ',
          selector: 'part/@type',
          labelKey: 'part/@type',
          description: `Hodnota bude vždy "volume" `,
          options: [
            ['volume', 'volume']
          ]
        },
        detail: {
          usage: 'RA',
          label: 'Detail',
          selector: 'part/detail',
          labelKey: 'part/detail',
          fields: {
            caption: {
              usage: 'RA',
              label: 'Typ',
              selector: 'part/detail/caption',
              labelKey: 'part/detail/caption',
              description: 'text před označením čísla, např. "č.", „část“, "No." apod.'
            }
          }
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
              defaultValue: 'marcorg',
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
