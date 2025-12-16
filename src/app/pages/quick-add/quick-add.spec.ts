import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickAdd } from './quick-add';

describe('QuickAdd', () => {
  let component: QuickAdd;
  let fixture: ComponentFixture<QuickAdd>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuickAdd]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuickAdd);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
