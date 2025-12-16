import { TestBed } from '@angular/core/testing';

import { Dates } from './dates';

describe('Dates', () => {
  let service: Dates;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Dates);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
