import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material';
import { HelpDialogComponent } from '../dialogs/help-dialog/help-dialog.component';

@Injectable()
export class HelpService {

  data = {
  titleInfo:`
      <h2>Název <i>M</i></h2>
      Název svazku monografie<br/>
      Pro plnění použít katalogizační záznam<br/>
      pokud má monografie více typů názvů, element se opakuje podle potřeby<br/>
      <h3>Typ <i>MA</i></h3>Hlavní název bez typu. Možné hodnoty 
      <ul>
        <li>Zkrácený název (abbreviated)</li>
        <li>Alternativní název (alternative)</li>
        <li>Přeložený název (translated)</li>
        <li>Jednotný název (uniform)</li>
      </ul>
      <h3>Název <i>M</i></h3>
      Názvová informace – název svazku monografie</br>
      hodnoty převzít z katalogu
      <h3>Vedlejší název <i>MA</i></h3>
      Podnázev svazku monografie.
      <h3>Číslo části <i>MA</i></h3>
      V případě, že se jedná o vícesvazkovou monografii, je zde uvedeno číslo svazku
      <h3>Název části <i>MA</i></h3>
      V případě, že se jedná o vícesvazkovou monografii, je zde uveden název svazku
      `,
    name: `
      <h2>Údaje o odpovědnosti za svazek <i>MA</i></h2>
      POZOR – údaje o odpovědnosti nutno přebírat z polí 1XX a 7XX MARCu21<br/>
      Pro plnění použít katalogizační záznam<br/>
      <h3>Celé jméno <i>MA</i></h3>
      Vyplnit pokud nelze rozlišit křestní jméno a příjmení.
      <h3>Křestní <i>MA</i></h3>
      Údaje o křestním jméně.
      <h3>Příjmení <i>MA</i></h3>
      Údaje o příjmení.
      <h3>Datum <i>MA</i></h3>
      Životopisná data autora<br/>
      Pokud známe datum narození a úmrtí autora, vyplnit ve tvaru RRRR-RRRR.
      <h3>Typ <i>M</i></h3>
      Použít jednu z hodnot: 
      <ul>
        <li>personal</li>
        <li>corporate</li>
        <li>conference</li>
        <li>family</li>
      </ul>
      <br/>
      <h2>Role <i>MA</i></h2>
      Specifikace role osoby nebo organizace
      <h3>Role <i>MA</i></h3>
      Kód role z kontrolovaného slovníku rolí 
      (<a href=\"http://www.loc.gov/marc/relators/relaterm.html\" target=\"_blank\">http://www.loc.gov/marc/relators/relaterm.html</a>)"
    `,
    originInfo: `
      <h2>Informace o původu předlohy <i>M</i></h2>
      Odpovídá poli 264
      <h3>Nakladatel <i>MA</i></h3>
      Jméno entity, která dokument vydala, vytiskla nebo jinak vyprodukovala<br/>
      Odpovídá poli 260 $b katalogizačního záznamu v MARC21.<br/>
      Pokud má monografie více vydavatelů, přebírají se za záznamu všichni (jsou v jednom poli 260).
      <h3>Typ <i>MA</i></h3>
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
      `
  }

  constructor(private dialog: MatDialog) {
  }

  showForField(field: string) {
    this.dialog.open(HelpDialogComponent, { data: this.data[field] });
  }

}
