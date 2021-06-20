export class NdkMonographTitleRdaTemplate {

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
      description: `Informace o původu předlohy: odpovídá poli 264`,
      fields: {
        publisher: {
            usage: "MA",
            label: "Nakladatel",
            selector: 'originInfo/publisher',
            description: `Jméno entity, která dokument vytvořila, vydala, distribuovala nebo vyrobila<br/>
            odpovídá poli 264 $b katalogizačního záznamu v MARC21<br/>
            pokud má monografie více vydavatelů/distributorů/výrobců, přebírají se ze záznamu všichni (v jednom poli 264)`,
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
            ['copyright', 'Copyright'],
            ['digitization', 'Digitalizace']
          ]
        },
        edition: {
            usage: "MA",
            label: "Edice",
            selector: 'originInfo/edition',
            cols: 2,
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