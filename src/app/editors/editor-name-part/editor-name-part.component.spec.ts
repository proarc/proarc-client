import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorNamePartComponent } from './editor-name-part.component';

describe('EditorNamePartComponent', () => {
  let component: EditorNamePartComponent;
  let fixture: ComponentFixture<EditorNamePartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorNamePartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorNamePartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
