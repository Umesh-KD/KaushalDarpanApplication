import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterEmDepartmentWiseRequestlistComponent } from './Bter-Em-DepartmentWiseRequest-list.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: BterEmDepartmentWiseRequestlistComponent;
  let fixture: ComponentFixture<BterEmDepartmentWiseRequestlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BterEmDepartmentWiseRequestlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterEmDepartmentWiseRequestlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
