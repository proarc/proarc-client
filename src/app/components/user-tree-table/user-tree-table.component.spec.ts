import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserTreeTableComponent } from './user-tree-table.component';

describe('UserTreeTableComponent', () => {
  let component: UserTreeTableComponent;
  let fixture: ComponentFixture<UserTreeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserTreeTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserTreeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
