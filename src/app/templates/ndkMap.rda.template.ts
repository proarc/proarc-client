export class NdkMapRdaTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      description: `Název kartografického dokumentu<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má kartografický dokument více typů názvů, element se opakuje podle potřeby s příslušným atributem`,
      fields: {
        type: {
          usage: "MA",
          label: 'Typ',
          selector: 'titleInfo/@type',
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
        title: {
          usage: "M",
          label: 'Název',
          selector: 'titleInfo/title',
          description: `Názvová informace – název kartografického dokumentu</br>
          hodnoty převzít z katalogu<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        subTitle: {
          usage: "MA",
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          cols: 2,
          description: `Podnázev kartografického dokumentu<br/>
          odpovídající pole a podpole podle typu, viz typ`
        },
        partNumber: {
          usage: "MA",
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          cols: 2,
          description: `Číslo části`
        },
        partName: {
          usage: "MA",
          label: 'Název části',
          selector: 'titleInfo/partName',
          cols: 2,
          description: `Název části<br/>
          odpovídající pole a podpole podle typu, viz typ`
        }
      }
    },
    name: {
      usage: "MA",
      label: "Autor",
      selector: 'name',
      description: `Údaje o odpovědnosti za svazek<br/>
      POZOR – údaje o odpovědnosti nutno přebírat z polí 1XX a 7XX MARCu21<br/>
      pokud má kartografický dokument iné původce než je autor, element <name> se opakuje s různými rolemi (kartograf, litograf apod.)`,
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
        role: {
          usage: "MA",
          label: "Role",
          selector: 'name/role/roleTerm',
          description: `Specifikace role osoby nebo organizace<br/>
          Kód role z kontrolovaného slovníku rolí 
          (<a href=\"http://www.loc.gov/marc/relators/relaterm.html\" target=\"_blank\">http://www.loc.gov/marc/relators/relaterm.html</a>)`,
          fields: {},
        }
      }
    },
    originInfo: {
      usage: "M",
      label: "Nakladatel",
      selector: 'originInfo',
      description: `Informace o původu předlohy: odpovídá poli 264`,
      fields: {
        publisher: {
            usage: "MA",
            label: "Nakladatel",
            selector: 'originInfo/publisher',
            description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 264 $b katalogizačního záznamu v MARC21<br/>
            pokud má dokument více vydavatelů/distributorů/výrobců, přebírají se ze záznamu všichni (v jednom poli 264)`,
        },
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
        dateIssued: {
            usage: "M",
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
            usage: "R",
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
        issuance: {
            usage: "M",
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
            usage: "MA",
            label: "Místo",
            selector: 'originInfo/place/placeTerm',
            cols: 1,
            description:`Údaje o místě spojeném s vytvořením, vydáním, distribucí nebo výrobou popisovaného dokumentu<br/>
            odpovídá hodnotě 264 $a`
        },
        dateOther: {
          usage: "R",
          label: "Datum - jiné",
          selector: 'originInfo/dateOther',
          cols: 2,
          description:`Datum vytvoření, distribuce, výroby předlohy<br/>
          Tento elemet se využije v případě výskytu $c v:
          <ul>
            <li>264_0 <strong>Produkce</strong> (production)</li>
            <li>264_2 <strong>Distribuce</strong> (distribution)</li>
            <li>264_3 <strong>Výroba</strong> (manufacture)</li>
          </ul>`
        },
        copyrightDate: {
          usage: "R",
          label: "Datum - copyright",
          selector: 'originInfo/copyrightDate',
          cols: 2,
          description:`Využije se pouze v případě výskytu pole 264 s druhým indikátorem 4 a podpolem $c<br/>
          <ul>
            <li>264_4 <strong>Copyright</strong> (copyright)</li>
          </ul>`
        }
      }
    },
    location: {
      usage: "MA",
      label: "Uložení",
      selector: 'location',
      description: `Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.`,
      fields: {
        physicalLocation: {
          usage: "M",
          label: "Místo uložení",
          selector: 'location/physicalLocation',
          description: `Údaje o instituci, kde je fyzicky uložen daný konkrétní popisovaný dokument, např. NK ČR nutno použít kontrolovaný slovník – sigly knihovnen (ABA001 atd.) odpovídá poli 910 $a v MARC21<br\>
          Pozn. u dokumentů v digitální podobě není možné vyplnit`,
        },
        shelfLocator: {
          usage: "M",
          label: "Signatura",
          selector: 'location/shelfLocator',
          description: `Signatura nebo lokační údaje o daném konkrétním dokumentu, který slouží jako předloha.`
        },
        url: {
          usage: "O",
          label: "URL",
          selector: 'location/url',
          description: `Pro uvedení lokace elektronického dokumentu`
        }
      }
    },
    subject: {
      usage: "R",
      label: "Věcné třídění",
      selector: 'subject',
      description: `Údaje o věcném třídění<br/>
      Předpokládá se přebírání z katalogizačního záznamu`,
      fields: {
        authority: {
          usage: "R",
          label: "Autorita",
          selector: 'subject/@authority',
          description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>Konspekt</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong><br/>
          Odpovídá hodnotě v $2`,
          options: [
            ['', '-'],
            ['czenas','czenas'],
            ['eczenas','eczenas'],
            ['mednas','mednas'],
            ['czmesh','czmesh'],
            ['msvkth','msvkth'],
            ['agrovoc','agrovoc'],
            ['Konspekt','Konspekt']
          ]          
        },
        topic: {
          usage: "R",
          label: "Klíčové slovo/Předmětové heslo",
          selector: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah svazku monografie<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21 nebo obsah pole 072 $x`
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
        },
        cartographics: {
          usage: "MA",
          label: "Kartografické údaje",
          selector: 'subject/cartographics',
          description: `přebírá se ze záznamu MARC 21 pole 034
          je žádoucí je vyplnit v případě, pokud se jedná o samostatnou mapu, pokud jde např. o atlas, vyplňuje se v nižší úrovni`,
          fields: {
            coordinates: {
              usage: "MA",
              label: "Souřadnice",
              selector: 'subject/cartographics/coordinates',
              description: `Obsah pole 034 $d, $e, $f, $g`
            },
            scale: {
              usage: "MA",
              label: "Měřítko",
              selector: 'subject/cartographics/scale',
              description: `Obsah pole 255 podpole a MARC21 záznamu`
            }
          }
        }
      }
    },
    language: {
      usage: "M",
      label: "Jazyk",
      selector: 'language',
      description: `Údaje o jazyce dokumentu`,
      fields: {
        objectPart: {
          usage: "MA",
          label: "Část",
          selector: 'language/@objectPart',
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
          usage: "M",
          label: "Jazyk",
          selector: 'language/languageTerm',
          description: `Přesné určení jazyka`
        }
      }
    },
    abstract: {
      usage: "R",
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
          description: `Údaje o fyzické podobě dokumentu, např. kartografický dokument, mapa apod.<br/>
          odpovídá hodnotě v poli 008/23<br/>
          Údaje o typu média a typu nosiče zdroje/předlohy odpovídá hodnotám z pole:
          <ul>
            <li>337 NEPOVINNÉ (hodnota např. "bez média" – viz <a href="https://www.nkp.cz/o-knihovne/odborne-cinnosti/zpracovani-fondu/katalogizacni-politika/typ-media_pole-337" target="_blank">kontrolovaný slovník</a> pole 337)</li>
            <li>338 POVINNÉ (hodnota např. "svazek" – viz <a href="https://www.nkp.cz/o-knihovne/odborne-cinnosti/zpracovani-fondu/katalogizacni-politika/typ-nosice-pole338-1" target="_blank">kontrolovaný slovník</a> pole 338)</li>
          </ul>
          `,
          fields: {
            authority: {
              usage: "M",
              label: "Autorita",
              selector: "physicalDescription/form/@authority",
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
              usage: "MA",
              label: "Typ",
              selector: "physicalDescription/form/@type",
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
      description: `Obecná poznámka ke svazku monografie jako celku<br/>
      Odpovídá hodnotám v poli 245, $c (statement of responsibility) 
      a v polích 5XX (poznámky) katalogizačního záznamu`,
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
      Hodnota <strong>cartographic</strong>`,
      fields: {
        authority: {
          usage: "MA",
          label: "Autorita",
          selector: "genre/@authority",
          options: [
            ['czenas', 'czenas'],
            ['eczenas', 'eczenas'],
            ['rdacontent', 'rdacontent']]
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
      description: `Údaje o identifikátorech, obsahuje unikátní identifikátory mezinárodní nebo lokální, které kartografický dokument obsahuje.`,
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
          label: "Edice",
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
          label: "Hodnota",
          help: "off"
        }
      }
    },
    typeOfResource: {
      usage: "R",
      label: "Typ zdroje",
      selector: "typeOfResource",
      description: `Pro kartografické dokumenty hodnota <strong>cartographic</strong><br/>
      mělo by se vyčítat z MARC21 katalogizačního záznamu z pozice 06 návěští (pro cartographic hodnoty e a f)`,
      fields: {
        value: {
          usage: "R",
          label: "Typ zdroje",
          help: "off",
          options: [
            ['','-'],
            ['cartographic','cartographic']
          ]
        }
      }
    }
  }
}