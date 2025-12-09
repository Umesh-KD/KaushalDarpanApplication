import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIAdminStaffComponent } from './itiadmin-staff.component';

describe('ITIAdminStaffComponent', () => {
  let component: ITIAdminStaffComponent;
  let fixture: ComponentFixture<ITIAdminStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIAdminStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIAdminStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
