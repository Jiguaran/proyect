import { TestBed } from '@angular/core/testing';

import { T2 } from './t2';

describe('T2', () => {
  let service: T2;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(T2);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
