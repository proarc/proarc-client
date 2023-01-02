import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorPremisComponent } from './editor-premis.component';

describe('EditorPremisComponent', () => {
  let component: EditorPremisComponent;
  let fixture: ComponentFixture<EditorPremisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorPremisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorPremisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
