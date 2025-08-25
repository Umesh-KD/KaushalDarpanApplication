import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterEMAddStaffDetailsComponent } from './bter-em-add-staff-details.component';

describe('BterEMAddStaffDetailsComponent', () => {
  let component: BterEMAddStaffDetailsComponent;
  let fixture: ComponentFixture<BterEMAddStaffDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BterEMAddStaffDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterEMAddStaffDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
