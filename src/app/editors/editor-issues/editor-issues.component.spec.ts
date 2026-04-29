import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorIssuesComponent } from './editor-issues.component';

describe('EditorIssuesComponent', () => {
  let component: EditorIssuesComponent;
  let fixture: ComponentFixture<EditorIssuesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditorIssuesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditorIssuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
