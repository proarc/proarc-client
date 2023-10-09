import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateInSourceDialogComponent } from './update-in-source-dialog.component';

describe('UpdateInSourceDialogComponent', () => {
  let component: UpdateInSourceDialogComponent;
  let fixture: ComponentFixture<UpdateInSourceDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateInSourceDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateInSourceDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
