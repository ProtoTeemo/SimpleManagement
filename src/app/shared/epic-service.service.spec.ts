import { TestBed } from '@angular/core/testing';

import { EpicFlowService } from './epic-flow.service';

describe('EpicServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EpicServiceService = TestBed.get(EpicServiceService);
    expect(service).toBeTruthy();
  });
});
