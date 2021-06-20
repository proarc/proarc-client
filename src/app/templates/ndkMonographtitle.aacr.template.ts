export class NdkMonographTitleAacrTemplate {

  static data = {
    titleInfo: {
      usage: 'M',
      label: 'Název',
      selector: 'titleInfo',
      description: `Název titulu, souborný název<br/>
      Pro plnění použít katalogizační záznam<br/>`,
      fields: {
        title: {
          usage: "M",
          label: 'Název',
          selector: 'titleInfo/title',
          description: `názvová informace – název monografického dokumentu</br>
          hodnoty převzít z katalogu<br/>`
        },
        subTitle: {
          usage: "MA",
          label: 'Podnázev',
          selector: 'titleInfo/subTitle',
          description: `Podnázev svazku monografie`
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
      label: "Nakladatel",
      selector: 'originInfo',
      description: `Informace o původu předlohy`,
      fields: {
        publisher: {
            usage: "MA",
            label: "Nakladatel",
            selector: 'originInfo/publisher',
            description: `Jméno entity, která dokument vydala, vytiskla nebo jinak vyprodukovala<br/>
            Odpovídá poli 260 $b katalogizačního záznamu.<br/>
            Pokud existuje více vydavatelů, přebírají se ze záznamu všichni`,
        },
        edition: {
            usage: "MA",
            label: "Edice",
            selector: 'originInfo/edition',
            description:`Údaj o pořadí vydání, odpovídá poli 250 $a katalogizačního záznamu v MARC 21.`
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
          label: "Autorita",
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
    }
  }
}