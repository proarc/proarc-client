import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResolveConflictDialogComponent } from './resolve-conflict-dialog.component';

describe('ResolveConflictDialogComponent', () => {
  let component: ResolveConflictDialogComponent;
  let fixture: ComponentFixture<ResolveConflictDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResolveConflictDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResolveConflictDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
