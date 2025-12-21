import { TestBed } from '@angular/core/testing';

import { T6 } from './t6';

describe('T6', () => {
  let service: T6;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(T6);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
