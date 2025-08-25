import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffInitialDetailsComponent } from './add-staff-initial-details.component';

describe('AddStaffInitialDetailsComponent', () => {
  let component: AddStaffInitialDetailsComponent;
  let fixture: ComponentFixture<AddStaffInitialDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddStaffInitialDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStaffInitialDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
