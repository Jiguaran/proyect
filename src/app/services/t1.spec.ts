import { TestBed } from '@angular/core/testing';

import { T1 } from './t1';

describe('T1', () => {
  let service: T1;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(T1);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
