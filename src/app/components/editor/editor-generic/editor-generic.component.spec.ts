import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorGenericComponent } from './editor-generic.component';

describe('EditorGenericComponent', () => {
  let component: EditorGenericComponent;
  let fixture: ComponentFixture<EditorGenericComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorGenericComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorGenericComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
