export class BdmArticleTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Názvové údaje',
      selector: 'titleInfo',
      description: `Názvová informace vnitřní části.`,
      fields: {
        type: {
          usage: "MA",
          label: 'Typ',
          selector: 'titleInfo/@type',
          cols: 3,
          options: [
            ['', '-'],
            ['translated', 'Přeložený název'],
            ['alternative', 'Variantní název']
          ]
        },
        lang: {
          usage: "O",
          label: "Jazyk",
          selector: "titleInfo/lang",
          cols: 3
        },
        nonSort: {
          usage: "O",
          label: 'Člen, jímž začíná název',
          selector: 'titleInfo/nonSort',
          cols: 3,
          description: `Člen, jímž začíná název`,
        },
        title: {
          usage: "M",
          label: 'Název',
          selector: 'titleInfo/title',
          description: `Vlastní název článku.
            <p>Pokud není titul, nutno vyplnit hodnotu „untitled“`
        },
        subTitle: {
          usage: "MA",
          label: 'Podnázev článku',
          selector: 'titleInfo/subTitle',
          description: `Podnázev článku. Za podnázev lze považovat i perex.`
        },
        partNumber: {
          usage: "MA",
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          cols: 2,
          description: `Číslo článku. Např. článek na pokračování.`
        },
        partName: {
          usage: "MA",
          label: 'Název části',
          selector: 'titleInfo/partName',
          cols: 2,
          description: `Název pokračování článku.`
        }
      }
    },
    name: {
      usage: "MA",
      label: "Autoři",
      selector: 'name',
      description: `Údaje o odpovědnosti za článek.`,
      fields: {
        type: {
          usage: "R",
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
        termsOfAddress: {
          usage: "RA",
          label: "Ostatní související se jménem",
          selector: "name/namePart[@type='termsOfAddress']",
          cols: 2,
          description: `Tituly a jiná slova nebo čísla související se jménem.`
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
      label: "Klíčová slova",
      selector: 'subject',
      description: `Údaje o věcném třídění`,
      fields: {
        topic: {
          usage: "R",
          label: "Klíčové slovo/Předmětové heslo",
          selector: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah článku.<br\>
           Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21.`,
        },
        lang: {
          usage: "M",
          label: "Jazyk",
          selector: "subject/@lang"
        }
      }
    },
    language: {
      usage: "M",
      label: "Jazyk",
      selector: 'language',
      description: `Údaje o jazyce dokumentu; v případě vícenásobného výskytu nutno element &lt;language> opakovat`,
      fields: {
        language: {
          usage: "M",
          label: "Jazyk článku",
          selector: 'language/languageTerm',
          description: `Přesné určení jazyka článku`
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
          description: "Shrnutí obsahu článku.",
          help: "off"
        },
        lang: {
          usage: "RA",
          label: "Jazyk abstraktu",
          selector: "abstract/@lang",
          description: "Jazyk abstraktu",
          help: "off"
        }
      }
    },
    part: {
      usage: "MA",
      label: "Rozsah článku",
      selector: 'part',
      description: `Rozsah článku`,
      fields: {
        extent: {
          usage: "MA",
          label: "Rozsah",
          selector: 'part/extent',
          description: `Tento kontejner <part> slouží k zaznamenání rozsahu stran v reprezentaci.`,
          fields: {
            start: {
              usage: "MA",
              label: "Od strany",
              cols: 2,
              selector: 'part/extent/start',
              description: `První stránka článku.`
            },
            end: {
              usage: "MA",
              label: "Do strany",
              cols: 2,
              selector: 'part/extent/end',
              description: `Poslední stránka článku.`
            }
          }
        }
      }
    },
    physicalDescription: {
      usage: "M",
      label: "Fyzický popis",
      selector: "physicalDescription",
      description: `Obsahuje údaje o fyzickém popisu článku.`,
      fields: {
        form: {
          usage: "M",
          label: "Typ média",
          selector: "physicalDescription/form",
          description: `Údaje o fyzické podobě dokumentu, např. print, electronic, microfilm apod."
                            + "Odpovídá hodnotě v poli 008/23`,
          fields: {
            value: {
              usage: "M",
              label: "Hodnota",
              help: "off",
              options: [
                ['bez média', 'bez média'],
                ['jiný', 'jiný'],
                ['počítač', 'počítač']
              ]
            }
          }
        }
      }
    },
    note: {
      usage: "R",
      label: "Poznámka",
      selector: "note",
      description: `Obecná poznámka k vnitřní části.<br\>
 Do poznámky by se měla dávat šifra autora vnitřní části, která se vyskytuje pod vnitřní částí.`,
      fields: {
        note: {
          usage: "RA",
          label: "Poznámka",
          help: "off"
        }
      }
    },
    genre: {
      usage: "R",
      label: "Typ obsahu",
      selector: "genre",
      fields: {
        value: {
          usage: "M",
          label: "Hodnota",
          cols: 2,
          help: "off"
        },
        type: {
          usage: "R",
          label: "Typ obsahu",
          cols: 2,
          selector: "genre/@type",
          options: [
            ['abstract', 'abstrakt'],
            ['directory', 'adresář'],
            ['annotations', 'anotace'],
            ['bibliography', 'bibliografie'],
            ['main article', 'hlavní článek'],
            ['biographical portrait', 'medailonek'],
            ['obituary', 'nekrolog'],
            ['cover', 'obálka'],
            ['table of content', 'obsah'],
            ['peer-reviewed', 'recenzováno'],
            ['preface', 'předmluva'],
            ['review', 'recenze'],
            ['index', 'rejstřík'],
            ['advertisement', 'reklama'],
            ['interview', 'rozhovor'],
            ['colophon', 'tiráž'],
            ['title page', 'titulní list'],
            ['introduction', 'úvod'],
            ['editorsNote', 'úvodník'],
            ['dedication', 'věnování'],
            ['news', 'zpráva'],
            ['unspecified', 'nespecifikován']]
        }
      }
    },
    identifier: {
      usage: "M",
      label: "Identifikátory článku",
      selector: "identifier",
      description: `Údaje o identifikátorech článku.`,
      fields: {
        type: {
          usage: "M",
          label: "Typ",
          selector: "identifier/@type",
          cols: 2,
          description: `Výběr typu identifikátoru článku.`,
          options: [
            ['doi', 'doi'],
            ['uuid', 'uuid']
          ]
        },
        value: {
          usage: "M",
          label: "Hodnota",
          help: "off"
        }
      }
    },
    relatedItem: {
      usage: "MA",
      label: "Recenze na",
      selector: "relatedItem",
      description: "Recenze na:",
      fields: {
        part: {
          usage: "MA",
          label: "Rozsah článku",
          selector: 'relatedItem/part',
          description: `Rozsah článku`,
          fields: {
            extent: {
              usage: "MA",
              label: "Rozsah",
              selector: 'relatedItem/part/extent',
              description: `Tento kontejner <part> slouží k zaznamenání rozsahu stran v reprezentaci.`,
              fields: {
                start: {
                  usage: "MA",
                  label: "Od strany",
                  cols: 2,
                  selector: 'relatedItem/part/extent/start',
                  description: `První stránka článku.`
                },
                end: {
                  usage: "MA",
                  label: "Do strany",
                  cols: 2,
                  selector: 'relatedItem/part/extent/end',
                  description: `Poslední stránka článku.`
                }
              }
            }
          }
        },
        titleInfo: {
          usage: 'M',
          label: 'Název recenzovaného díla',
          selector: 'relatedItem/titleInfo',
          description: `Názvová informace vnitřní části.`,
          fields: {
            title: {
              usage: "M",
              label: 'Název recenzovaného díla',
              selector: 'relatedItem/titleInfo/title',
              description: `Název recenzovaného díla. Odpovídá poli 787$t.`
            }
          }
        },
        name: {
          usage: "M",
          label: "Autoři recenzovaného díla",
          selector: 'relatedItem/name',
          description: `Autoři recenzovaného díla ve tvaru: \"Příjmení, Jméno\". Odpovídá poli 787$a`,
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
              usage: "MA",
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
            }
          }
        },
        originInfo: {
          usage: 'M',
          label: 'Nakladatelské údaje recenzovaného díla',
          selector: 'relatedItem/originInfo',
          description: `Názvová informace vnitřní části.`,
          fields: {
            publisher: {
              usage: "MA",
              label: "Nakladatelské údaje",
              selector: 'relatedItem/originInfo/publisher',
              description: `Vydavatel recenzovaného díla ve tvaru: \"město : nakladatelství, rok vydání\". Odpovídá poli 787$d.`,
            },
          }
        }
      }
    }
  }
}