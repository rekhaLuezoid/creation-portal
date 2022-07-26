import { TestBed } from '@angular/core/testing';

import { QuestionPreviewService } from './question-preview.service';

describe('QuestionPreviewService', () => {
  let service: QuestionPreviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(QuestionPreviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
