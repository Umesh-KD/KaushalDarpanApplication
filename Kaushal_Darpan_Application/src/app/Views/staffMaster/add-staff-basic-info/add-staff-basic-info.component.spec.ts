import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffBasicInfoComponent } from './add-staff-basic-info.component';

describe('AddStaffBasicInfoComponent', () => {
  let component: AddStaffBasicInfoComponent;
  let fixture: ComponentFixture<AddStaffBasicInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddStaffBasicInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStaffBasicInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
