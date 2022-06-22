export class BdmArticleTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Názvové údaje',
      selector: 'titleInfo',
      labelKey: 'titleInfo',
      description: `Názvová informace vnitřní části.`,
      fields: {
        type: {
          usage: 'MA',
          label: 'Typ',
          selector: 'titleInfo/@type',
          labelKey: 'titleInfo/@type',
          cols: 3,
          options: [
            ['', '-'],
            ['translated', 'Přeložený název'],
            ['alternative', 'Variantní název']
          ]
        },
        lang: {
          usage: 'O',
          label: 'Jazyk',
          selector: 'titleInfo/lang',
          labelKey: 'titleInfo/@lang',
          cols: 3
        },
        nonSort: {
          usage: 'O',
          label: 'Člen, jímž začíná název',
          selector: 'bdm/titleInfo/nonSort',
          labelKey: 'titleInfo/nonSort',
          cols: 3,
          description: `Člen, jímž začíná název`,
        },
        title: {
          usage: 'M',
          label: 'Název',
          selector: 'titleInfo/title',
          labelKey: 'titleInfo/title',
          description: `Vlastní název článku.
            <p>Pokud není titul, nutno vyplnit hodnotu „untitled“`
        },
        subTitle: {
          usage: 'MA',
          label: 'Podnázev článku',
          selector: 'titleInfo/subTitle',
          labelKey: 'titleInfo/subTitle',
          description: `Podnázev článku. Za podnázev lze považovat i perex.`
        },
        partNumber: {
          usage: 'MA',
          label: 'Číslo části',
          selector: 'titleInfo/partNumber',
          labelKey: 'titleInfo/partNumber',
          cols: 2,
          description: `Číslo článku. Např. článek na pokračování.`
        },
        partName: {
          usage: 'MA',
          label: 'Název části',
          selector: 'titleInfo/partName',
          labelKey: 'titleInfo/partName',
          cols: 2,
          description: `Název pokračování článku.`
        }
      }
    },
    name: {
      usage: 'MA',
      label: 'Autoři',
      selector: 'name',
      labelKey: 'bdm/name',
      description: `Údaje o odpovědnosti za článek.`,
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
        nameIdentifier: {
          usage: 'O',
          label: 'Identifikátor autora (ORCID ID)',
          selector: 'name/nameIdentifier',
          labelKey: 'bdm/name/nameIdentifier',
          description: `Číslo národní autority`,
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
    subject: {
      usage: 'R',
      label: 'Klíčová slova',
      selector: 'subject',
      labelKey: 'bdm/subject',
      description: `Údaje o věcném třídění`,
      fields: {
        topic: {
          usage: 'R',
          label: 'Klíčové slovo/Předmětové heslo',
          selector: 'subject/topic',
          labelKey: 'subject/topic',
          description: `Libovolný výraz specifikující nebo charakterizující obsah článku.<br\>
           Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21.`,
        },
        lang: {
          usage: 'M',
          label: 'Jazyk',
          selector: 'subject/@lang',
          labelKey: 'subject/@lang',
        }
      }
    },
    language: {
      usage: 'M',
      label: 'Jazyk',
      selector: 'language',
      labelKey: 'language',
      description: `Údaje o jazyce dokumentu; v případě vícenásobného výskytu nutno element &lt;language> opakovat`,
      fields: {
        language: {
          usage: 'M',
          label: 'Jazyk článku',
          selector: 'language/languageTerm',
          labelKey: 'language/languageTerm',
          description: `Přesné určení jazyka článku`
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
          description: 'Shrnutí obsahu článku.',
          help: 'off'
        },
        lang: {
          usage: 'RA',
          label: 'Jazyk abstraktu',
          selector: 'abstract/@lang',
          labelKey: 'abstract/@lang',
          description: 'Jazyk abstraktu',
          help: 'off'
        }
      }
    },
    part: {
      usage: 'MA',
      label: 'Rozsah článku',
      selector: 'part',
      labelKey: 'bdm/part',
      description: `Rozsah článku`,
      fields: {
        extent: {
          usage: 'MA',
          label: 'Rozsah',
          selector: 'part/extent',
          labelKey: 'part/extent',
          description: `Tento kontejner <part> slouží k zaznamenání rozsahu stran v reprezentaci.`,
          fields: {
            start: {
              usage: 'MA',
              label: 'Od strany',
              cols: 2,
              selector: 'part/extent/start',
              labelKey: 'bdm/part/extent/start',
              description: `První stránka článku.`
            },
            end: {
              usage: 'MA',
              label: 'Do strany',
              cols: 2,
              selector: 'part/extent/end',
              labelKey: 'bdm/part/extent/end',
              description: `Poslední stránka článku.`
            }
          }
        }
      }
    },
    physicalDescription: {
      usage: 'M',
      label: 'Fyzický popis',
      selector: 'physicalDescription',
      labelKey: 'physicalDescription',
      description: `Obsahuje údaje o fyzickém popisu článku.`,
      fields: {
        form: {
          usage: 'M',
          label: 'Typ média',
          selector: 'physicalDescription/form',
          labelKey: 'physicalDescription/form',
          description: `Údaje o fyzické podobě dokumentu, např. print, electronic, microfilm apod."
                            + "Odpovídá hodnotě v poli 008/23`,
          fields: {
            value: {
              usage: 'M',
              label: 'Hodnota',
              labelKey: 'physicalDescription/form/value',
              help: 'off',
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
      usage: 'R',
      label: 'Poznámka',
      selector: 'note',
      labelKey: 'note',
      description: `Obecná poznámka k vnitřní části.<br\>
 Do poznámky by se měla dávat šifra autora vnitřní části, která se vyskytuje pod vnitřní částí.`,
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
      usage: 'R',
      label: 'Typ obsahu',
      selector: 'genre',
      labelKey: 'genre',
      fields: {
        value: {
          usage: 'M',
          selector: 'genre/value',
          labelKey: 'genre/value',
          label: 'Hodnota',
          cols: 2,
          help: 'off'
        },
        type: {
          usage: 'R',
          label: 'Typ obsahu',
          cols: 2,
          selector: 'genre/@type',
          labelKey: 'bdm/genre/@type',
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
      usage: 'M',
      label: 'Identifikátory článku',
      selector: 'identifier',
      labelKey: 'identifier',
      description: `Údaje o identifikátorech článku.`,
      fields: {
        type: {
          usage: 'M',
          label: 'Typ',
          selector: 'identifier/@type',
          labelKey: 'identifier/@type',
          cols: 2,
          description: `Výběr typu identifikátoru článku.`,
          options: [
            ['doi', 'doi'],
            ['uuid', 'uuid']
          ]
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
    relatedItem: {
      usage: 'MA',
      label: 'Recenze na',
      selector: 'relatedItem',
      labelKey: 'bdm/relatedItem',
      description: 'Recenze na:',
      fields: {
        part: {
          usage: 'MA',
          label: 'Rozsah článku',
          selector: 'relatedItem/part',
          labelKey: 'bdm/relatedItem/part',
          description: `Rozsah článku`,
          fields: {
            extent: {
              usage: 'MA',
              label: 'Rozsah',
              selector: 'relatedItem/part/extent',
              labelKey: 'bdm/relatedItem/part/extent',
              description: `Tento kontejner <part> slouží k zaznamenání rozsahu stran v reprezentaci.`,
              fields: {
                start: {
                  usage: 'MA',
                  label: 'Od strany',
                  cols: 2,
                  selector: 'relatedItem/part/extent/start',
                  labelKey: 'bdm/relatedItem/part/extent/start',
                  description: `První stránka článku.`
                },
                end: {
                  usage: 'MA',
                  label: 'Do strany',
                  cols: 2,
                  selector: 'relatedItem/part/extent/end',
                  labelKey: 'bdm/relatedItem/part/extent/end',
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
          labelKey: 'bdm/relatedItem/titleInfo',
          description: `Názvová informace vnitřní části.`,
          fields: {
            title: {
              usage: 'M',
              label: 'Název recenzovaného díla',
              selector: 'relatedItem/titleInfo/title',
              labelKey: 'bdm/relatedItem/titleInfo/title',
              description: `Název recenzovaného díla. Odpovídá poli 787$t.`
            }
          }
        },
        name: {
          usage: 'M',
          label: 'Autoři recenzovaného díla',
          selector: 'relatedItem/name',
          labelKey: 'bdm/relatedItem/name',
          description: `Autoři recenzovaného díla ve tvaru: \"Příjmení, Jméno\". Odpovídá poli 787$a`,
          fields: {
            type: {
              usage: 'R',
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
              selector: "relatedItem/name/namePart[@type='given']",
              labelKey: "relatedItem/name/namePart[@type='given']",
              cols: 2,
              description: `Údaje o křestním jméně.<br/>
          V případě více křestních jmen se doporučuje
          uvést je společně ve stejném elementu , např. hodnota "Jan Amos"`
            },
            family: {
              usage: 'MA',
              label: 'Příjmení',
              selector: "relatedItem/name/namePart[@type='family']",
              labelKey: "relatedItem/name/namePart[@type='family']",
              cols: 2,
              description: `Údaje o příjmení.`
            }
          }
        },
        originInfo: {
          usage: 'M',
          label: 'Nakladatelské údaje recenzovaného díla',
          selector: 'relatedItem/originInfo',
          labelKey: 'relatedItem/originInfo',
          description: `Názvová informace vnitřní části.`,
          fields: {
            publisher: {
              usage: 'MA',
              label: 'Nakladatelské údaje',
              selector: 'relatedItem/originInfo/publisher',
              labelKey: 'relatedItem/originInfo/publisher',
              description: `Vydavatel recenzovaného díla ve tvaru: \"město : nakladatelství, rok vydání\". Odpovídá poli 787$d.`,
            },
            edition: {
              usage: 'R',
              label: 'Vydání',
              selector: 'relatedItem/originInfo/edition',
              labelKey: 'relatedItem/originInfo/edition',
              description: `Údaj o pořadí vydání, odpovídá poli 250 $a katalogizačního záznamu.`
            },
          }
        },
        physicalDescription: {
          usage: 'MA',
          label: 'Fyzický popis',
          selector: 'relatedItem/physicalDescription',
          labelKey: 'bdm/relatedItem/physicalDescription',
          description: `Obsahuje údaje o popisu zdroje/předlohy`,
          fields: {
            extent: {
              usage: 'RA',
              label: 'Rozsah',
              selector: 'relatedItem/physicalDescription/extent',
              labelKey: 'bdm/relatedItem/physicalDescription/extent',
              description: `Údaje o rozsahu (stran, svazků nebo rozměrů)`,
            },
          }
        },
        note: {
          usage: 'RA',
          label: 'Poznámka',
          selector: 'relatedItem/note',
          labelKey: 'bdm/relatedItem/note',
          description: `Obecná poznámka`,
          fields: {
            note: {
              usage: 'RA',
              selector: 'relatedItem/note/value',
              labelKey: 'bdm/relatedItem/note/value',
              label: 'Poznámka',
              help: 'off'
            }
          }
        },
        identifier: {
          usage: 'M',
          label: 'Identifikátory článku',
          selector: 'relatedItem/identifier',
          labelKey: 'relatedItem/identifier',
          description: `Údaje o identifikátorech.`,
          fields: {
            type: {
              usage: 'M',
              label: 'Typ',
              selector: 'relatedItem/identifier/@type',
              labelKey: 'relatedItem/identifier/@type',
              cols: 2,
              description: `Výběr typu identifikátoru článku.`,
              options: [
                ['doi', 'doi'],
                ['uuid', 'uuid'],
                ['isbn', 'isbn']
              ]
            },
            value: {
              usage: 'M',
              selector: 'relatedItem/identifier/value',
              labelKey: 'relatedItem/identifier/value',
              label: 'Hodnota',
              help: 'off'
            },
            validity: {
              usage: 'MA',
              label: 'Platnost',
              selector: 'relatedItem/identifier/@invalid',
              labelKey: 'relatedItem/identifier/@invalid',
              cols: 2,
              description: `Uvádějí se i neplatné resp. zrušené identifikátory.`
            },
          }
        },
      }
    }
  };
}
