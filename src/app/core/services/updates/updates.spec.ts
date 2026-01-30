import { TestBed } from '@angular/core/testing';

import { Updates } from './updates';

describe('Updates', () => {
  let service: Updates;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Updates);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
