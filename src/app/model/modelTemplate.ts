export class ModelTemplate {

    static data = {
        "model:ndkmonographvolume": {
            allowedChildren: ['model:ndkmonographsupplement',
                              'model:ndkchapter', 
                              'model:ndkpicture',
                              'model:ndkpage'],
            preferredChild: 'model:ndkpage',
            titleInfo: {
              help:`
                <h2>Název <i>M</i> <code>originInfo</code></h2>
                Název svazku monografie<br/>
                Pro plnění použít katalogizační záznam<br/>
                pokud má monografie více typů názvů, element se opakuje podle potřeby<br/>
                <h3>Typ <i>MA</i> <code>originInfo/@type</code></h3>
                Hlavní název bez typu - pole 245 a $a<br/>
                Možné hodnoty 
                <ul>
                  <li>Zkrácený název (abbreviated) - pole 210</li>
                  <li>Alternativní název (alternative) – pole 246</li>
                  <li>Přeložený název (translated) – pole 242</li>
                  <li>Jednotný název (uniform) – pole 130 resp. 240</li>
                </ul>
                <h3>Název <i>M</i> <code>originInfo/title</code></h3>
                Názvová informace – název svazku monografie</br>
                hodnoty převzít z katalogu
                <h3>Vedlejší název <i>MA</i> <code>originInfo/subTitle</code></h3>
                Podnázev svazku monografie.
                <h3>Číslo části <i>MA</i> <code>originInfo/partNumber</code></h3>
                V případě, že se jedná o vícesvazkovou monografii, je zde uvedeno číslo svazku
                <h3>Název části <i>MA</i> <code>originInfo/partName</code></h3>
                V případě, že se jedná o vícesvazkovou monografii, je zde uveden název svazku
                `,
              usage: 'M',
              title: {
                usage: "M"
              },
              subTitle: {
                usage: "MA"
              },
              partName: {
                usage: "MA"
              },
              partNumber: {
                usage: "MA"
              },
              type: {
                usage: "MA"
              },
            },
            name: {
              help: `
                <h2>Údaje o odpovědnosti za svazek <i>MA</i> <code>name</code></h2>
                POZOR – údaje o odpovědnosti nutno přebírat z polí 1XX a 7XX MARCu21<br/>
                Pro plnění použít katalogizační záznam<br/>
                <h3>Celé jméno <i>MA</i> <code>name/namePart[not(@type)]</code></h3>
                Vyplnit pokud nelze rozlišit křestní jméno a příjmení.
                <h3>Křestní <i>MA</i> <code>name/namePart[@type='given']</code></h3>
                Údaje o křestním jméně.<br/>
                V případě více křestních jmen se doporučuje
                uvést je společně ve stejném elementu , např. hodnota "Jan Amos"
                <h3>Příjmení <i>MA</i> <code>name/namePart[@type='family']</code></h3>
                Údaje o příjmení.
                <h3>Datum <i>MA</i> <code>name/namePart[@type='date']</code></h3>
                Životopisná data autora<br/>
                Pokud známe datum narození a úmrtí autora, vyplnit ve tvaru RRRR-RRRR.
                <h3>Typ <i>M</i> <code>name/@type</code></h3>
                Použít jednu z hodnot: 
                <ul>
                  <li><strong>Osoba</strong> (personal)</li>
                  <li><strong>Organizace</strong> (corporate)</li>
                  <li><strong>Konference</strong> (conference)</li>
                  <li><strong>Rodina</strong> (family)</li>
                </ul>
                <br/>
                <h2>Role <i>MA</i></h2>
                Specifikace role osoby nebo organizace<br/>
                Kód role z kontrolovaného slovníku rolí 
                (<a href=\"http://www.loc.gov/marc/relators/relaterm.html\" target=\"_blank\">http://www.loc.gov/marc/relators/relaterm.html</a>)
              `,
              usage: "MA",
              name: {
                usage: "MA"
              },
              given: {
                usage: "MA"
              },
              family: {
                usage: "MA"
              },
              date: {
                usage: "MA"
              },
              type: {
                usage: "MA"
              },
              role: {
                usage: "MA"
              }
            },
            originInfo: {
                help: `
                <h2>Informace o původu předlohy <i>M</i> <code>originInfo</code></h2>
                <h3>Nakladatel <i>MA</i> <code>originInfo/publisher</code></h3>
                Jméno entity, která dokument vydala, vytiskla nebo jinak vyprodukovala<br/>
                Odpovídá poli 260 $b katalogizačního záznamu v MARC21.<br/>
                Pokud má monografie více vydavatelů, přebírají se za záznamu všichni (jsou v jednom poli 260).
                <h3>Typ <i>M</i> <code>originInfo/@eventType</code></h3>
                Hodnoty dle druhého indikátoru pole 264:
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
                </p>
                <h3>Datum vydání <i>M</i> <code>originInfo/dateIssued</code></h3>
                Datum vydání předlohy.<br/>
                Přebírat z katalogu.<br/>
                Odpovídá hodnotě z katalogizačního záznamu, pole 260, $c a pole 008/07-10
                <h3>Upřesnění data <i>R</i> <code>originInfo/dateIssued@qualifier</code></h3>
                Možnost dalšího upřesnění. Možné hodnoty 
                <ul>
                  <li>Přibližné (approximate)</li>
                  <li>Odvozené (inferred)</li>
                  <li>Sporné (questionable)</li>
                </ul>
                <h3>Edice <i>R</i> <code>originInfo/edition</code></h3>
                Údaj o pořadí vydání, odpovídá poli 250 $a katalogizačního záznamu.
                <h3>Vydání <i>M</i> <code>originInfo/issuance</code></h3>
                Údaje o vydávání odpovídá hodnotě uvedené v návěští MARC21 na pozici 07<br/>
                Možné hodnoty 
                <ul>
                  <li>Monografické (monographic)</li>
                  <li>Vícedílné (multipart monograph)</li>
                  <li>Jednotkové (single unit)</li>
                </ul>
                <h3>Místo <i>MA</i> <code>originInfo/place/placeTerm</code></h3>
                Údaje o místě spojeném s vydáním, výrobou nebo původem popisovaného dokumentu.<br/>
                Odpovídá hodnotám z katalogizačního záznamu, pole 260, $a resp. pole 008/15-17
                <h3>Datum - jiné <i>R</i> <code>originInfo/dateOther</code></h3>
                Ddatum vytvoření, distribuce, výroby předlohy<br/>
                Tento elemet se využije v případě výskytu $c v:
                <ul>
                  <li>264_0 <strong>Produkce</strong> (production)</li>
                  <li>264_2 <strong>Distribuce</strong> (distribution)</li>
                  <li>264_3 <strong>Výroba</strong> (manufacture)</li>
                </ul>
                <h3>Datum vytvoření <i>R</i> <code>originInfo/dateCreated</code></h3>
                Ddatum vytvoření předlohy
                <h3>Datum - copyright <i>R</i> <code>originInfo/copyrightDate</code></h3>
                Využije se pouze v případě výskytu pole 264 s ruhým indikátorem 4 a podpolem $c 264_4
                `,
                usage: "M",
                publisher: {
                    usage: "M"
                },
                dateIssued: {
                    usage: "M"
                },
                qualifier: {
                    usage: "R"
                },
                edition: {
                    usage: "R"
                },
                issuance: {
                    usage: "M",
                    options: ['monographic', 'single unit', 'multipart monograph']
                },
                place: {
                    usage: "MA"
                },
                eventType: {
                    usage: "M"
                },
                dateCreated: {
                  usage: "R"
                },
                dateOther: {
                  usage: "R"
                },
                copyrightDate: {
                  usage: "R"
                }
            }
        },
        "model:ndkperiodical": {
          allowedChildren: ['model:ndkperiodicalvolume'],
          preferredChild: 'model:ndkperiodicalvolume',
          titleInfo: {
            help:`
              <h2>Název <i>M</i> <code>originInfo</code></h2>
              Název titulu periodika<br/>
              Pro plnění použít katalogizační záznam<br/>
              pokud má periodikum více typů názvů, element se opakuje podle potřeby<br/>
              <h3>Typ <i>MA</i> <code>originInfo/@type</code></h3>
              Hlavní název bez typu - pole 245 a $a<br/>
              Možné hodnoty 
              <ul>
                <li>Zkrácený název (abbreviated) - pole 210</li>
                <li>Alternativní název (alternative) – pole 246</li>
                <li>Přeložený název (translated) – pole 242</li>
                <li>Jednotný název (uniform) – pole 130 resp. 240</li>
              </ul>
              <h3>Název <i>M</i> <code>originInfo/title</code></h3>
              Názvová informace – název titulu periodika</br>
              hodnoty převzít z katalogu
              <h3>Vedlejší název <i>MA</i> <code>originInfo/subTitle</code></h3>
              Podnázev titulu periodika
              <h3>Číslo části <i>MA</i> <code>originInfo/partNumber</code></h3>
              Např. určité části/edice, k použití u ročenek a specializovaných periodik
              <h3>Název části <i>MA</i> <code>originInfo/partName</code></h3>
              např. určité části/edice, k použití u ročenek a specializovaných periodik 
              odpovídající pole a podpole podle typu viz typ
              `,
            usage: 'M',
            title: {
              usage: "M"
            },
            subTitle: {
              usage: "MA"
            },
            partName: {
              usage: "MA"
            },
            partNumber: {
              usage: "MA"
            },
            type: {
              usage: "MA"
            },
          },
          originInfo: {
              help: `
              <h2>Informace o původu předlohy <i>M</i></h2>
              Odpovídá poli 264
              <h3>Nakladatel <i>MA</i></h3>
              Jméno entity, která dokument vydala, vytiskla nebo jinak vyprodukovala<br/>
              Odpovídá poli 260 $b katalogizačního záznamu v MARC21.<br/>
              Pokud má monografie více vydavatelů, přebírají se za záznamu všichni (jsou v jednom poli 260).
              <h3>Typ <i>M</i></h3>
              Hodnoty dle druhého indikátoru pole 264:
              <ul>
                <li>
                  264_0 <strong>Produkce</strong> (production) <i>R</i>
                  Hodnota 0 se uvádí, jestliže pole obsahuje <strong>údaje o vytvoření</strong> zdroje v nezveřejněné podobě.
                </li>
                <li>
                264_1 <strong>Publikace</strong> (publication) <i>R</i> 
                Hodnota 1 se uvádí, jestliže pole obsahuje <strong>údaje o nakladateli</strong> zdroje
                </li>
                <li>
                  264_2 <strong>Distribuce</strong> (distribution) <i>R</i> 
                  Hodnota 2 se uvádí, jestliže pole obsahuje <strong>údaje o distribuci</strong> zdroje
                </li>
                <li>
                  264_3 <strong>Výroba</strong> (manufacture) <i>R</i> 
                  Hodnota 3 se uvádí, jestliže pole obsahuje <strong>údaje o tisku</strong>, výrobě zdroje ve zveřejněné podobě.
                </li>
                <li>
                  264_4 <strong>Copyright</strong> (copyright) <i>R</i> 
                  Hodnota 4 se uvádí, jestliže pole obsahuje <strong>údaje o ochraně podle autorského práva</strong>
                </li>
              </ul>
              <h3>Rok <i>M</i></h3>
              Datum vydání předlohy <br/>
              Přebírat z katalogu;<br/>
              Odpovídá hodnotě z katalogizačního záznamu, pole 260, $c a pole 008/07-10
              <h3>Upřesnění data <i>R</i></h3>
              Možnost dalšího upřesnění. Možné hodnoty 
              <ul>
                <li>Přibližné (approximate)</li>
                <li>Odvozené (inferred)</li>
                <li>Sporné (questionable)</li>
              </ul>
              <h3>Edice <i>R</i></h3>
              Údaj o pořadí vydání, odpovídá poli 250 $a katalogizačního záznamu.
              <h3>Vydání <i>M</i></h3>
              Údaje o vydávání odpovídá hodnotě uvedené v návěští MARC21 na pozici 07
              <h3>Místo <i>MA</i></h3>
              Údaje o místě spojeném s vydáním, výrobou nebo původem popisovaného dokumentu
              `,
              usage: "M",
              publisher: {
                  usage: "M"
              },
              dateIssued: {
                  usage: "M"
              },
              qualifier: {
                  usage: "R"
              },
              edition: {
                  usage: "R"
              },
              issuance: {
                  usage: "M",
                  options: ['monographic', 'single unit', 'multipart monograph',
                  'continuing', 'serial', 'integrating resource']
              },
              place: {
                  usage: "MA"
              },
              eventType: {
                  usage: "M"
              }
          }
      }
    };


}