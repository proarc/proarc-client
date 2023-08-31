import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotestComponent } from './totest.component';

describe('TotestComponent', () => {
  let component: TotestComponent;
  let fixture: ComponentFixture<TotestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TotestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
