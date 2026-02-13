import { TestBed } from '@angular/core/testing';

import { CardCalculatorService } from './card-calculator.service';

describe('CardCalculatorService', () => {
  let service: CardCalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardCalculatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
