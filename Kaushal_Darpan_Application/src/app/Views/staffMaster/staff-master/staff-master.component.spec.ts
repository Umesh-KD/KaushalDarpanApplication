import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffMasterComponent } from './staff-master.component';

describe('StaffMasterComponent', () => {
  let component: StaffMasterComponent;
  let fixture: ComponentFixture<StaffMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StaffMasterComponent]
    });
    fixture = TestBed.createComponent(StaffMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
