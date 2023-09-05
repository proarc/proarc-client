import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CzidloDialogComponent } from './czidlo-dialog.component';

describe('CzidloDialogComponent', () => {
  let component: CzidloDialogComponent;
  let fixture: ComponentFixture<CzidloDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CzidloDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CzidloDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
