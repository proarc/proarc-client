export class NdkPeriodicalVolumeAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Číslo ročníku',
      selector: 'titleInfo',
      description: `informace o čísle ročníku`,
      fields: {
        partNumber: {
          usage: "MA",
          label: 'Číslo',
          selector: 'titleInfo/partNumber',
          description: `Pořadové číslo vydání ročníku, např. 40`
        }
      }
    },
    name: {
      usage: "R",
      label: "Autor",
      selector: 'name',
      description: `Údaje o odpovědnosti za ročník periodika`,
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
          usage: "R",
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
      label: "Rok vydání",
      selector: 'originInfo',
      description: `Informace o původu předlohy; vyplňuje se ručně`,
      fields: {
        dateIssued: {
          usage: "M",
          label: "Rok",
          selector: 'originInfo/dateIssued',
          cols: 2,
          description:`Datum vydání předlohy, rok nebo rozsah let, kdy ročník vycházel`
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
        }
      }
    },
    physicalDescription: {
      usage: "O",
      label: "Fyzický popis",
      selector: "physicalDescription",
      description: `Obsahuje údaje o fyzickém popisu předlohy`,
      fields: {
        note: {
          usage: "O",
          label: "Poznámka",
          selector: "physicalDescription/note",
          description: `Poznámka o fyzickém stavu dokumentu<br/>
          zapisují se zde defekty zjištěné při digitalizaci pro úroveň ročníku (např. chybějící čísla apod.)`
        }
      }
    },
    genre: {
      usage: "M",
      label: "Žánr",
      selector: "genre",
      description: `Bližší údaje o typu dokumentu<br/>
      Hodnota <strong>volume</strong>`,
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
      description: `Úúdaje o identifikátorech, obsahuje unikátní identifikátory mezinárodní nebo lokální, které ročník periodika obsahuje.`,
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
    }
  }
}