import { TestBed } from '@angular/core/testing';

import { SeenService } from './seen.service';

describe('SeenService', () => {
  let service: SeenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SeenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
