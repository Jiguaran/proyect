import { TestBed } from '@angular/core/testing';

import { T3 } from './t3';

describe('T3', () => {
  let service: T3;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(T3);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
