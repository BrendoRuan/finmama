import { TestBed } from '@angular/core/testing';

import { CardBillService } from './card-bill.service';

describe('CardBillService', () => {
  let service: CardBillService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardBillService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
