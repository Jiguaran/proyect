import { TestBed } from '@angular/core/testing';

import { EspacioState } from './espacio-state';

describe('EspacioState', () => {
  let service: EspacioState;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EspacioState);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
