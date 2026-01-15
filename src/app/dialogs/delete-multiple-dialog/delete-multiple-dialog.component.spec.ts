import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMultipleDialogComponent } from './delete-multiple-dialog.component';

describe('DeleteMultipleDialogComponent', () => {
  let component: DeleteMultipleDialogComponent;
  let fixture: ComponentFixture<DeleteMultipleDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMultipleDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteMultipleDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
