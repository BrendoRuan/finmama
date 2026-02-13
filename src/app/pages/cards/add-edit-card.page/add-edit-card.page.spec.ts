import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCardPage } from './add-edit-card.page';

describe('AddEditCardPage', () => {
  let component: AddEditCardPage;
  let fixture: ComponentFixture<AddEditCardPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditCardPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditCardPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
