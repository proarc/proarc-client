export class K4PeriodicalVolumeAacrTemplate {

  static data = {
    identifier: {
      usage: 'M',
      label: 'Identifikátor',
      selector: 'identifier',
      labelKey: 'identifier',
      description: `Údaje o identifikátorech, obsahuje unikátní
      identifikátory mezinárodní nebo lokální, které svazek monografie má.`,
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
              <li>
                <strong>ISMN</strong> (ismn) <i>MA</i><br/>
                převzít z katalogizačního záznamu z pole 024 (1. ind.="2"), $a, $z
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
    typeOfResource: {
      usage: 'R',
      label: 'Typ zdroje',
      selector: 'typeOfResource',
      labelKey: 'typeOfResource',
      description: `Pro monografie hodnota <strong>text</strong><br/>
      mělo by se vyčítat z MARC21 katalogizačního záznamu, z pozice 06 návěští`,
      fields: {
        value: {
          usage: 'R',
          selector: 'typeOfResource/value',
          labelKey: 'typeOfResource/value',
          label: 'Typ zdroje',
          help: 'off',
          options: [
            ['', '-'],
            ['text', 'text']
          ]
        }
      }
    },
    part: {
      usage: 'O',
      label: 'Popis části',
      selector: 'part',
      labelKey: 'part',
      description: `Popis části, pokud je svazek části souboru,element může být využit jen na zaznamenání<caption>.`,
      fields: {
        date: {
          usage: 'O',
          label: 'Typ',
          selector: 'part/date',
          labelKey: 'part/date',
        },
        text: {
          usage: 'O',
          label: 'Typ',
          selector: 'part/text',
          labelKey: 'part/text',
        },
        number: {
          usage: 'RA',
          label: 'Caption',
          selector: 'part/detail/number',
          labelKey: 'part/detail/number',
        },
      }
    },
  };
}
