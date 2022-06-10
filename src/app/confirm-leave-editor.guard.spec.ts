import { TestBed } from '@angular/core/testing';

import { ConfirmLeaveEditorGuard } from './confirm-leave-editor.guard';

describe('ConfirmLeaveEditorGuard', () => {
  let guard: ConfirmLeaveEditorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ConfirmLeaveEditorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
