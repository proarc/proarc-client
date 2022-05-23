export class NdkPictureAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      description: `Název vnitřní části<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má monografie více typů názvů, element se opakuje podle potřeby`,
      fields: {
        type: {
          usage: "MA",
          label: 'Typ',
          selector: 'titleInfo/@type',
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
          description: `Názvová informace – název vnitřní části</br>
          hodnoty převzít z katalogu<br/>
          pokud není titul, nutno vyplnit hodnotu <strong>untitled</strong>`
        },
        subTitle: {
          usage: "MA",
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          description: `Podnázev vnitřní části`
        },
        partNumber: {
          usage: "MA",
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          cols: 2,
          description: `V případě, že se jedná o vícesvazkovou monografii, je zde uvedeno číslo svazku`
        },
        partName: {
          usage: "MA",
          label: 'Název části',
          selector: 'titleInfo/partName',
          cols: 2,
          description: `V případě, že se jedná o vícesvazkovou monografii, je zde uveden název svazku<br/>
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
      pokud má monografie autora a ilustrátora, element <name> se opakuje s různými rolemi`,
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
            ['personal', 'Osoba'],
            ['corporate', 'Organizace'],
            ['conference', 'Konference'],
            ['family', 'Rodina']
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
        etal: {
          usage: "MA",
          label: "Etal",
          selector: "name/etal",
          cols: 2,
          description: `Element indikující, že existuje více autorů, než pouze ti, kteří byli uvedeni v <name> elementu.</br>
          V případě užití tohoto elementu je dále top element <name> neopakovatelný.</br>
          <etal> je nutné umístit do samostatného top elementu <name>, ve kterém se nesmí objevit subelementy <namePart> a <nameIdentifier>.`
        },
        role: {
          usage: "MA",
          label: "Role",
          selector: 'name/role/roleTerm',
          expanded: true,
          description: `Specifikace role osoby nebo organizace<br/>
          Kód role z kontrolovaného slovníku rolí
          (<a href=\"http://www.loc.gov/marc/relators/relaterm.html\" target=\"_blank\">http://www.loc.gov/marc/relators/relaterm.html</a>)`,
          fields: {},
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
          ]
        },
        topic: {
          usage: "R",
          label: "Klíčové slovo/Předmětové heslo",
          selector: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah vnitřní části<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21`
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
        name: {
          usage: "R",
          label: "Jméno použité jako věcné záhlaví",
          selector: 'subject/name',
          description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21<br/>
          Struktura a atributy stejné jako pro údaje o původcích – viz element <name>`
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
      usage: "MA",
      label: "Jazyk",
      selector: 'language',
      description: `Údaje o jazyce dokumentu`,
      fields: {
        language: {
          usage: "M",
          label: "Jazyk",
          selector: 'language/languageTerm',
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
        form: {
          usage: "R",
          label: "Forma",
          selector: "physicalDescription/form",
          description: `Údaje o fyzické podobě dokumentu, např. print, electronic, microfilm apod.<br/>
          odpovídá hodnotě v poli 008/23
          `,
          fields: {
            authority: {
              usage: "M",
              label: "Autorita",
              selector: "physicalDescription/form/@authority",
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
      description: `Obecná poznámka ke vnitřní části<br/>
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
      Pro monografie hodnota <strong>volume</strong>`,
      fields: {
        value: {
          usage: "M",
          label: "Hodnota",
          help: "off"
        },
        type: {
          usage: "R",
          label: "Typ",
          selector: "genre/@type",
          cols: 2,
          description: `Možnost vyplnit bližší určení typu oddílu (možnost použít DTD monografie, MonographComponentPart Types)`,
          options: [
            ['table', 'table'],
            ['illustration', 'illustration'],
            ['chart', 'chart'],
            ['photograph', 'photograph'],
            ['graphic', 'graphic'],
            ['map', 'map'],
            ['advertisement', 'advertisement'],
            ['cover', 'cover'],
            ['unspecified', 'unspecified']
          ]
        }
      }
    },
    identifier: {
      usage: "M",
      label: "Identifikátor",
      selector: "identifier",
      description: `Údaje o identifikátorech, obsahuje unikátní
      identifikátory mezinárodní nebo lokální, které svazek monografie má.`,
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
              <li>
                <strong>ISMN</strong> (ismn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 024 (1. ind.="2"), $a, $z
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
      usage: "RA",
      label: "Klasifikace",
      selector: "identifier",
      description: `Klasifikační údaje věcného třídění podle Mezinárodního desetinného třídění<br/>
      odpovídá poli 080 MARC21
      `,
      fields: {
        authority: {
          usage: "M",
          label: "Autorita",
          selector: "classification/@authority",
          description: `Vyplnit hodnotu <strong>udc</strong>`,
          options: [
            ['udc', 'udc'],
          ]
        },
        value: {
          usage: "M",
          label: "Hodnota",
          help: "off"
        }
      }
    },
    part: {
      usage: "O",
      label: "Popis části",
      selector: 'part',
      description: `Popis části, pokud je svazek části souboru,element může být využit jen na zaznamenání<caption>.`,
      fields: {
        type: {
          usage: "O",
          label: "Typ",
          selector: "part/@type",
          description: `Hodnota bude vždy "volume" `,
          options: [
            ['volume', 'volume']
          ]
        },
        caption: {
          usage: "RA",
          label: "Caption",
          selector: "part/detail/caption",
          description: `text před označením čísla, např. "č.", „část“, "No." apod.`
        },
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
          cols: 2,
          label: "Standard metadat",
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
          selector: 'recordInfo/recordOrigin',
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
    },
    relatedItem: {
      usage: "MA",
      label: "Informace o dalších dokumentech",
      selector: "relatedItem",
      description: "Informace o dalších dokumentech/částech/zdrojích, které jsou ve. vztahu k popisovanému dokumentu;.",
      fields: {
        type: {
          usage: "R",
          label: 'Typ',
          selector: 'relatedItem/@type',
          description: `Type spolu s otherType popisují vztah položky, popsané v <relatedItem> a dokumentu, který je předmětem MODS záznamu`,
          options: [
            ['', '-'],
            ['series', 'Series'],
            ['original', 'original'],
            ['isReferencedBy', 'isReferencedBy']
          ]
        },
        otherType: {
          usage: "O",
          label: 'Other type',
          selector: 'relatedItem/@otherType',
          cols: 2,
        },
        otherTypeURI: {
          usage: "O",
          label: 'Other Type URI',
          selector: 'relatedItem/@otherTypeURI',
          description: 'Odkaz na zdroj položky v <relatedItem>, který se vztahuje k popisovanému',
          cols: 2,
        },
        otherTypeAuth: {
          usage: "O",
          label: 'Other Type Auth',
          selector: 'relatedItem/@otherTypeAuth',
          description: 'Autoritní záznam příbuzné položky',
          cols: 2,
        },
        otherTypeAuthURI: {
          usage: "O",
          label: 'Other Type Auth URI',
          selector: 'relatedItem/@otherTypeAuthURI',
          description: 'Odkaz na autoritní záznam příbuzné položky',
          cols: 2,
        },
        titleInfo: {
          usage: "MA",
          label: 'Název',
          selector: 'relatedItem/titleInfo',
          description: `Název titulu periodika<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má periodikum více typů názvů, element se opakuje podle potřeby`,
          fields: {
            type: {
              usage: "MA",
              label: 'Typ',
              selector: 'relatedItem/titleInfo/@type',
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
              usage: "O",
              label: 'Část vynechaná při hledání',
              selector: 'relatedItem/titleInfo/nonSort',
              cols: 2,
              description: `Část názvu, která má být vynechána při vyhledávána<br/>
          např.:
          <ul>
            <li><nonSort>The</nonSort></li>
            <li><title>Beatles</title></li>
          </ul>`,
            },
            title: {
              usage: "MA",
              label: 'Název',
              selector: 'relatedItem/titleInfo/title',
              description: `Názvová informace – název titulu periodika</br>
          hodnoty převzít z katalogu<br/>
          odpovídající pole a podpole podle typu, viz typ`
            },
            subTitle: {
              usage: "MA",
              label: 'Podnázev',
              selector: 'relatedItem/titleInfo/subTitle',
              description: `Podnázev titulu periodika<br/>
          odpovídající pole a podpole podle typu, viz typ`
            },
            partNumber: {
              usage: "MA",
              label: 'Číslo části',
              selector: 'relatedItem/titleInfo/partNumber',
              cols: 2,
              description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik`
            },
            partName: {
              usage: "R",
              label: 'Název části',
              selector: 'relatedItem/titleInfo/partName',
              cols: 2,
              description: `Např. určité části/edice, k použití u ročenek a specializovaných periodik<br/>
          odpovídající pole a podpole podle typu, viz typ`
            }
          }
        },
        name: {
          usage: "R",
          label: "Autor",
          selector: 'relatedItem/name',
          description: `Údaje o odpovědnosti za titul periodika`,
          fields: {
            type: {
              usage: "R",
              label: "Typ",
              selector: 'relatedItem/name/@type',
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
              selector: 'relatedItem/name/namePart[not(@type)]',
              description: `Vyplnit pokud nelze rozlišit křestní jméno a příjmení.`
            },
            given: {
              usage: "MA",
              label: "Křestní",
              selector: "relatedItem/name/namePart[@type='given']",
              cols: 2,
              description: `Údaje o křestním jméně.<br/>
          V případě více křestních jmen se doporučuje
          uvést je společně ve stejném elementu , např. hodnota "Jan Amos"`
            },
            family: {
              usage: "MA",
              label: "Příjmení",
              selector: "relatedItem/name/namePart[@type='family']",
              cols: 2,
              description: `Údaje o příjmení.`
            },
            date: {
              usage: "RA",
              label: "Datum",
              selector: "relatedItem/name/namePart[@type='date']",
              cols: 2,
              description: `Životopisná data autora<br/>
          Pokud známe datum narození a úmrtí autora, vyplnit ve tvaru RRRR-RRRR.`
            },
            termsOfAddress: {
              usage: "RA",
              label: "Ostatní související se jménem",
              selector: "relatedItem/name/namePart[@type='termsOfAddress']",
              cols: 2,
              description: `Tituly a jiná slova nebo čísla související se jménem.`
            },
            nameIdentifier: {
              usage: "MA",
              label: "Identifikátor autora",
              selector: "relatedItem/name/nameIdentifier",
              cols: 2,
              description: `Číslo národní autority`,
            },
            role: {
              usage: "MA",
              label: "Role",
              selector: 'relatedItem/name/role/roleTerm',
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
          selector: 'relatedItem/originInfo',
          description: `Informace o původu předlohy: odpovídá poli 264`,
          fields: {
            publisher: {
              usage: "MA",
              label: "Nakladatel",
              selector: 'relatedItem/originInfo/publisher',
              description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 264 $b katalogizačního záznamu v MARC21<br/>
            pokud má periodikum více vydavatelů, přebírají se ze záznamu všichni (v jednom poli 264)`,
            },
            eventType: {
              usage: "MA",
              label: "Typ",
              selector: 'relatedItem/originInfo/@eventType',
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
              usage: "MA",
              label: "Datum vydání",
              selector: 'relatedItem/originInfo/dateIssued',
              cols: 2,
              description:`Datum vydání předlohy, nutno zaznamenat rok/roky, v nichž časopis vycházel - formu zápisu přebírat z katalogu (např. 1900-1939)<br/>
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
              selector: 'relatedItem/originInfo/dateIssued/@qualifier',
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
              usage: "R",
              label: "Kódování",
              selector: 'relatedItem/originInfo/dateIssued/@encoding',
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
              usage: "MA",
              label: "Point",
              selector: 'relatedItem/originInfo/dateIssued/@point',
              cols: 2,
              description: `Hodnoty "start" resp. "end" jen u údaje z pole 008, pro rozmezí dat`,
              options: [
                ['', '-'],
                ['start', 'start'],
                ['end', 'end']
              ]
            },
            issuance: {
              usage: "MA",
              label: "Vydání",
              selector: 'relatedItem/originInfo/issuance',
              cols: 2,
              description:`Údaje o vydávání odpovídá hodnotě uvedené v návěští MARC21 na pozici 07<br/>
          Možné hodnoty
          <ul>
            <li>Na pokračování (continuing)</li>
            <li>Sériové (serial)</li>
            <li>Integrační zdroj (integrating resource)</li>
          </ul>`,
              options: [
                ['', '-'],
                ['continuing','Na pokračování'],
                ['serial','Sériové'],
                ['integrating resource','Integrační zdroj']
              ]
            },
            place: {
              usage: "MA",
              label: "Místo",
              selector: 'relatedItem/originInfo/place/placeTerm',
              cols: 1,
              description:`Údaje o místě spojeném s vytvořením, vydáním, distribucí nebo výrobou popisovaného dokumentu<br/>
            odpovídá hodnotě 264 $a`
            },
            dateCreated: {
              usage: "R",
              label: "Datum vytvoření",
              selector: 'relatedItem/originInfo/dateCreated',
              cols: 3,
              description:`Datum vydání předlohy pro rukopisy
          přebírat z katalogu<br/>
          odpovídá hodnotě z katalogizačního záznamu, pole 264_0 $c pokud je LDR/06="d", "f", "t"`
            },
            dateOther: {
              usage: "R",
              label: "Datum - jiné",
              selector: 'relatedItem/originInfo/dateOther',
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
              usage: "R",
              label: "Datum - copyright",
              selector: 'relatedItem/originInfo/copyrightDate',
              cols: 3,
              description:`Využije se pouze v případě výskytu pole 264 s druhým indikátorem 4 a podpolem $c<br/>
          <ul>
            <li>264_4 <strong>Copyright</strong> (copyright)</li>
          </ul>`
            },
            frequency: {
              usage: "R",
              label: "Frekvence",
              selector: 'relatedItem/originInfo/frequency',
              description: `údaje o pravidelnosti vydávání
          odpovídá údaji MARC21 v poli 310 nebo pozici 18 v poli 008`,
              fields: {
                authority: {
                  usage: "R",
                  label: "Autorita",
                  selector: 'relatedItem/originInfo/frequency/@authority',
                  options: [["marcfrequency", "marcfrequency"]]
                },
                value: {
                  label: "Hodnota",
                  usage: "MA",
                  selector: 'relatedItem/originInfo/frequency',
                  help: 'off'
                }
              }
            }
          }
        },
        location: {
          usage: "MA",
          label: "Uložení",
          selector: 'relatedItem/location',
          description: `Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.`,
          fields: {
            physicalLocation: {
              usage: "MA",
              label: "Místo uložení",
              selector: 'relatedItem/location/physicalLocation',
              description: `Údaje o instituci, kde je fyzicky uložen daný konkrétní popisovaný dokument, např. NK ČR nutno použít kontrolovaný slovník – sigly knihovnen (ABA001 atd.) odpovídá poli 910 $a v MARC21<br\>
          Pozn. u dokumentů v digitální podobě není možné vyplnit`,
            },
            shelfLocator: {
              usage: "MA",
              label: "Signatura",
              selector: 'relatedItem/location/shelfLocator',
              description: `Signatura nebo lokační údaje o daném konkrétním dokumentu, který slouží jako předloha.`
            },
            url: {
              usage: "O",
              label: "URL",
              selector: 'relatedItem/location/url',
              description: `Pro uvedení lokace elektronického dokumentu`
            }
          }
        },
        subject: {
          usage: "R",
          label: "Věcné třídění",
          selector: 'relatedItem/subject',
          description: `Údaje o věcném třídění<br/>
      Předpokládá se přebírání z katalogizačního záznamu`,
          fields: {
            authority: {
              usage: "R",
              label: "Autorita",
              selector: 'relatedItem/subject/@authority',
              description: `Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>Konspekt</strong>, <strong>czmesh</strong>, <strong>mednas</strong><br/>
          Odpovídá hodnotě v $2`,
              options: [
                ['', '-'],
                ['czenas','czenas'],
                ['eczenas','eczenas'],
                ['mednas','mednas'],
                ['czmesh','czmesh'],
                ['Konspekt','Konspekt']
              ]
            },
            topic: {
              usage: "R",
              label: "Klíčové slovo/Předmětové heslo",
              selector: 'relatedItem/subject/topic',
              description: `Libovolný výraz specifikující nebo charakterizující obsah periodika<br/>
          Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21 nebo obsah pole 072 $x`
            },
            geographic: {
              usage: "R",
              label: "Geografické věcné třídění",
              selector: 'relatedItem/subject/geographic',
              description: `Geografické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (geografický termín) nebo obsah pole 651 záznamu MARC21`
            },
            temporal: {
              usage: "R",
              label: "Chronologické věcné třídění",
              selector: 'relatedItem/subject/temporal',
              description: `Chronologické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (chronologický údaj) nebo obsah pole 648 záznamu MARC21`
            },
            name: {
              usage: "R",
              label: "Jméno použité jako věcné záhlaví",
              selector: 'relatedItem/subject/name',
              description: `Jméno použité jako věcné záhlaví. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (jméno osobní) nebo obsah pole 600 záznamu MARC21<br/>
          Struktura a atributy stejné jako pro údaje o původcích – viz element <name>`
            },
          }
        },
        language: {
          usage: "MA",
          label: "Jazyk",
          selector: 'relatedItem/language',
          description: `Údaje o jazyce dokumentu`,
          fields: {
            objectPart: {
              usage: "MA",
              label: "Část",
              cols: 2,
              selector: 'relatedItem/language/@objectPart',
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
              usage: "MA",
              label: "Jazyk",
              selector: 'relatedItem/language/languageTerm',
              cols: 2,
              description: `Přesné určení jazyka`
            }
          }
        },
        abstract: {
          usage: "R",
          label: "Abstrakt",
          selector: "relatedItem/abstract",
          description: `Shrnutí obsahu jako celku odpovídá poli 520 MARC21`,
          fields: {
            abstract: {
              usage: "R",
              label: "Abstrakt",
              selector: "relatedItem/abstract",
              help: "off"
            }
          }
        },
        physicalDescription: {
          usage: "MA",
          label: "Fyzický popis",
          selector: "relatedItem/physicalDescription",
          description: `Obsahuje údaje o fyzickém popisu zdroje/předlohy`,
          fields: {
            extent: {
              usage: "RA",
              label: "Rozsah",
              selector: "relatedItem/physicalDescription/extent",
              description: `Údaje o rozsahu (stran, svazků nebo rozměrů)<br/>
          odpovídá hodnotě v poli 300, $a, $b a $c<br/>
          počet stránek bude vyjádřen ve fyzické strukturální mapě`,
            },
            note: {
              usage: "RA",
              label: "Poznámka",
              selector: "relatedItem/physicalDescription/note",
              description: `Poznámka o fyzickém stavu dokumentu<br/>
          zde se zapíší defekty zjištěné při digitalizaci pro úroveň titulu periodika (např. chybějící ročník)`
            },
            form: {
              usage: "MA",
              label: "Forma",
              selector: "relatedItem/physicalDescription/form",
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
                  usage: "MA",
                  label: "Autorita",
                  selector: "relatedItem/physicalDescription/form/@authority",
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
                  selector: "relatedItem/physicalDescription/form/@type",
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
                  usage: "MA",
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
          selector: "relatedItem/note",
          description: `Obecná poznámka k titulu periodika jako celku<br/>
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
          usage: "MA",
          label: "Žánr",
          selector: "relatedItem/genre",
          description: `Bližší údaje o typu dokumentu<br/>
      Hodnota <strong>title</strong>`,
          fields: {
            value: {
              usage: "MA",
              label: "Hodnota",
              help: "off"
            }
          }
        },
        classification: {
          usage: "R",
          label: "Klasifikace",
          selector: "relatedItem/classification",
          description: `Klasifikační údaje věcného třídění podle Konspektu.<br/>
      Odpovídá poli 072 $a MARC21`,
          fields: {
            authority: {
              usage: "MA",
              label: "Autorita",
              selector: "relatedItem/classification/@authority",
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
              usage: "MA",
              label: "Edice",
              selector: "relatedItem/classification/@edition",
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
              usage: "MA",
              label: "Hodnota",
              help: "off"
            }
          }
        },
        typeOfResource: {
          usage: "R",
          label: "Typ zdroje",
          selector: "relatedItem/typeOfResource",
          description: `Pro titul periodika hodnota <strong>text</strong><br/>
      mělo by se vyčítat z MARC21 katalogizačního záznamu, z pozice 06 návěští`,
          fields: {
            value: {
              usage: "R",
              label: "Typ zdroje",
              help: "off",
              options: [
                ['','-'],
                ['text','text']
              ]
            }
          }
        },
      }
    }
  }
}
