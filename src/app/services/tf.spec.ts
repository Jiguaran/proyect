import { TestBed } from '@angular/core/testing';

import { Tf } from './tf';

describe('Tf', () => {
  let service: Tf;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Tf);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
