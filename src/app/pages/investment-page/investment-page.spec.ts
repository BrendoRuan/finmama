import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvestmentPage } from './investment-page';

describe('InvestmentPage', () => {
  let component: InvestmentPage;
  let fixture: ComponentFixture<InvestmentPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InvestmentPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InvestmentPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
