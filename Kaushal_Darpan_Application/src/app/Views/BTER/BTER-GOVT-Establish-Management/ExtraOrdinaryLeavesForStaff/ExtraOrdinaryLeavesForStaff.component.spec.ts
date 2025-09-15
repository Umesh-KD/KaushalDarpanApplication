import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraOrdinaryLeavesForStaffComponent } from './ExtraOrdinaryLeavesForStaff.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: ExtraOrdinaryLeavesForStaffComponent;
  let fixture: ComponentFixture<ExtraOrdinaryLeavesForStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExtraOrdinaryLeavesForStaffComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraOrdinaryLeavesForStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
