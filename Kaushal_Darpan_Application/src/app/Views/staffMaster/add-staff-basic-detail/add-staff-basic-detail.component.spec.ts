import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStaffBasicDetailComponent } from './add-staff-basic-detail.component';

describe('AddStaffBasicDetailComponent', () => {
  let component: AddStaffBasicDetailComponent;
  let fixture: ComponentFixture<AddStaffBasicDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddStaffBasicDetailComponent]
    });
    fixture = TestBed.createComponent(AddStaffBasicDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
