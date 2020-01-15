import { TestBed } from '@angular/core/testing';

import { ViewSettingsService } from './view-settings.service';

describe('ViewSettingsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ViewSettingsService = TestBed.get(ViewSettingsService);
    expect(service).toBeTruthy();
  });
});
