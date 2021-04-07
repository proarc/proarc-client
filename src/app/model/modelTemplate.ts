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
            },
            location: {
              help: `
              <h2>Uložení <i>MA</i> <code>location</code></h2>
              Údaje o uložení popisovaného dokumentu, např. signatura, místo uložení apod.
              <h3>Místo uložení <i>M</i> <code>location/physicalLocation</code></h3>
              Údaje o instituci, kde je fyzicky uložen daný konkrétní popisovaný dokument, např. NK ČR nutno použít kontrolovaný slovník – sigly knihovnen (ABA001 atd.) odpovídá poli 910 $a v MARC21<br\>
              Pozn. u dokumentů v digitální podobě není možné vyplnit
              <h3>Signatura <i>M</i> <code>location/shelfLocator</code></h3>
              Signatura nebo lokační údaje o daném konkrétním dokumentu, který slouží jako předloha.
              <h3>URL <i>O</i> <code>location/url</code></h3>
              Pro uvedení lokace elektronického dokumentu
              `,
              usage: "MA",
              physicalLocation: {
                usage: "M",
              },
              shelfLocator: {
                usage: "M",
              },
              url: {
                usage: "O",
              }
            },
            subject: {
              help: `
              <h2>Věcné třídění <i>R</i> <code>subject</code></h2>
              Údaje o věcném třídění<br/>
              Předpokládá se přebírání z katalogizačního záznamu
              <h3>Autorita <i>R</i> <code>subject/@authority</code></h3>
              Vyplnit hodnotu <strong>czenas</strong>, <strong>eczenas</strong>, <strong>Konspekt</strong>, <strong>czmesh</strong>, <strong>mednas</strong>, <strong>msvkth</strong>, <strong>agrovoc</strong><br/>
              Odpovídá hodnotě v $2
              <h3>Klíčové slovo <i>R</i> <code>subject/topic</code></h3>
              Libovolný výraz specifikující nebo charakterizující obsah svazku monografie<br/>
              Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (věcné téma) nebo obsah pole 650 záznamu MARC21 nebo obsah pole 072 $x
              <h3>Geografické třídění<i>R</i> <code>subject/geographic</code></h3>
              Geografické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (geografický termín) nebo obsah pole 651 záznamu MARC21
              <h3>Chronologické třídění<i>R</i> <code>subject/temporal</code></h3>
              Chronologické věcné třídění. Použít kontrolovaný slovník - např. z báze autorit AUT NK ČR (chronologický údaj) nebo obsah pole 648 záznamu MARC21
              `,
              usage: "R",
              authority: {
                usage: "R",
              },
              topic: {
                usage: "R",
              },
              geographic: {
                usage: "R",
              },
              temporal: {
                usage: "R",
              }
            },
            language: {
              help: `
              <h2>Jazyk <i>M</i> <code>language</code></h2>
              Údaje o jazyce dokumentu
              <h3>Část <i>RA</i> <code>language/@objectPart</code></h3>
              Možnost vyjádřit jazyk konkrétní části svazku <br/>
              možné hodnoty<br/>
              <ul>
                <li><strong>summary</strong> – odpovídá poli 041 $b</li>
                <li><strong>table of contents</strong> - odpovídá poli 041 $f</li>
                <li><strong>accompanying material</strong> - odpovídá poli 041 $g</li>
                <li><strong>translation</strong> - odpovídá poli 041 $h</li>
              </ul>
              <h3>Jazyk <i>M</i> <code>language/languageTerm</code></h3>
              Přesné určení jazyka
              `,
              usage: "M",
              objectPart: {
                usage: "RA",
                options: ['', 'summary', 'table of contents', 'accompanying material', 'translation']
              },
              language: {
                usage: "M",
              }
            },
            abstract: {
              help: `
              <h2>Abstrakt <i>R</i> <code>abstract</code></h2>
              Shrnutí obsahu jako celku odpovídá poli 520 MARC21
              `,
              usage: "RA",
            },
            physicalDescription: {
              help: `
              <h2>Fyzický popis <i>M</i> <code>physicalDescription</code></h2>
              Obsahuje údaje o fyzickém popisu zdroje/předlohy
              <h3>Rozsah <i>RA</i> <code>physicalDescription/extent</code></h3>
              Údaje o rozsahu (stran, svazků nebo rozměrů)<br/>
              odpovídá hodnotě v poli 300, $a, $b a $c<br/>
              počet stránek bude vyjádřen ve fyzické strukturální mapě
              <h3>Poznámka <i>RA</i> <code>physicalDescription/note</code></h3>
              Poznámka o fyzickém stavu dokumentu
              `,
              usage: "M",
              extent: {
                usage: "RA",
              },
              note: {
                usage: "RA",
              }
            },
            note: {
              help: `
              <h2>Poznámka <i>RA</i> <code>note</code></h2>
              Obecná poznámka ke svazku monografie jako celku<br/>
              Odpovídá hodnotám v poli 245, $c (statement of responsibility) 
              a v polích 5XX (poznámky) katalogizačního záznamu
              <h3>Typ <i>O</i> <code>note/@type</code></h3>
              Typ poznámky
              `,
              usage: "RA",
              type: {
                usage: "O",
              },
              note: {
                usage: "RA",
              }
            },
            genre: {
              help: `
              <h2>Žánr <i>M</i> <code>genre</code></h2>
              Bližší údaje o typu dokumentu<br/>
              Pro monografie hodnota <strong>volume</strong><br/>
              `,
              usage: "M",
              authority: {
                usage: "MA",
              },
              value: {
                usage: "M",
              }
            },
            identifier: {
              help: `
              <h2>Identifikátor <i>M</i> <code>identifier</code></h2>
              Údaje o identifikátorech, obsahuje unikátní
              identifikátory mezinárodní nebo lokální, které
              svazek monografie má.
              <h3>Typ <i>M</i> <code>identifier/@type</code></h3>
              Budou se povinně vyplňovat následující
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
                    <strong>ISBN</strong> (isbn) <i>M</i><br/>
                    převzít z katalogizačního záznamu z pole 020, $a, $z
                  </li>
                  <li>
                    <strong>ISMN</strong> (ismn) <i>M</i><br/>
                    převzít z katalogizačního záznamu z pole 024 (1. ind.="2"), $a, $z
                  </li>
                </ul>
                Jiný interní identifikátor - type = barcode, oclc, sysno, permalink apod.
                <h3>Platnost <i>M</i> <code>identifier/@invalid</code></h3>
                Uvádějí se i neplatné resp. zrušené identifikátory 
                <ul>
                  <li>
                    <strong>Platný</strong> <code>identifier/[not(@invalid)]</code>
                  </li>
                  <li>
                    <strong>Neplatný</strong> <code>identifier/[@invalid='yes']</code>
                  </li>
                </ul>
              `,
              usage: "M",
              type: {
                usage: "M"
              },
              validity: {
                usage: "M"
              }
            },
            classification: {
              help: `
              <h2>Klasifikace <i>R</i> <code>classification</code></h2>
              1. Klasifikační údaje věcného třídění podle Mezinárodního desetinného třídění<br/>
              odpovídá poli 080 MARC21<br/>
              2. Klasifikační údaje věcného třídění podle Konspektu.<br/>
              Odpovídá poli 072 $a MARC21
              <h3>Autorita <i>M</i> <code>classification/@authority</code></h3>
              <ul>
                <li>
                  vyplnit hodnotu <strong>udc</strong> (v případě 072 $a nebo MDT)
                </li>
                <li>
                  vyplnit hodnotu <strong>Konspekt</strong>  (v případě 072 $9)
                </li>
              </ul>
              <h3>Editce <i>M</i> <code>classification/@edition</code></h3>
              <ul>
                <li>
                  vyplnit hodnotu <strong>Konspekt</strong> (v případě 072 $a)
                </li>
              </ul>
              `,
              usage: "R",
              authority: {
                usage: "M",
              },
              edition: {
                usage: "M",
              },
              value: {
                usage: "M",
              }
            },
            typeOfResource: {
              help: `
              <h2>Informace o původu předlohy <i>M</i> <code>typeOfResource</code></h2>
              pro monografie hodnota <strong>text</strong><br/>
              mělo by se vyčítat z MARC21 katalogizačního
              záznamu, z pozice 06 návěští
              `,
              usage: "R",
              options: ['', 'text']
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