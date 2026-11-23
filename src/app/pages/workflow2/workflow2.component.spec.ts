import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Workflow2Component } from './workflow2.component';

describe('Workflow2Component', () => {
  let component: Workflow2Component;
  let fixture: ComponentFixture<Workflow2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Workflow2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Workflow2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
