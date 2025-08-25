import { TestBed } from '@angular/core/testing';

import { CitizenSuggestionService } from './citizen-suggestion.service';

describe('CitizenSuggestionService', () => {
  let service: CitizenSuggestionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CitizenSuggestionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
