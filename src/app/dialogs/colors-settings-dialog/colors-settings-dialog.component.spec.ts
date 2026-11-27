import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorsSettingsDialogComponent } from './colors-settings-dialog.component';

describe('ColorsSettingsDialogComponent', () => {
  let component: ColorsSettingsDialogComponent;
  let fixture: ComponentFixture<ColorsSettingsDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorsSettingsDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ColorsSettingsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
