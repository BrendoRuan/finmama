import { TestBed } from '@angular/core/testing';

import { Money } from './money';

describe('Money', () => {
  let service: Money;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Money);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
