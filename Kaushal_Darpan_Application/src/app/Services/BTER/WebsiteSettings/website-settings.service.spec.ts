import { TestBed } from '@angular/core/testing';

import { WebsiteSettingsService } from './website-settings.service';

describe('WebsiteSettingsService', () => {
  let service: WebsiteSettingsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteSettingsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
