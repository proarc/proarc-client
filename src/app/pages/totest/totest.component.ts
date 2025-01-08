import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslateModule } from '@ngx-translate/core';
import { Configuration } from '../../shared/configuration';

@Component({
  imports: [CommonModule, TranslateModule, FormsModule, 
    MatCardModule, MatFormFieldModule, MatIconModule, MatButtonModule, MatProgressBarModule,
    MatInputModule],
  selector: 'app-totest',
  templateUrl: './totest.component.html',
  styleUrls: ['./totest.component.scss']
})
export class TotestComponent implements OnInit {

  constructor(public config: Configuration) { }

  ngOnInit(): void {
  }

}
