import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentWiseRequestlistComponent } from './DepartmentWiseRequest-list.component';

describe('ITIGovtEMZonalOfficeMasterComponent', () => {
  let component: DepartmentWiseRequestlistComponent;
  let fixture: ComponentFixture<DepartmentWiseRequestlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DepartmentWiseRequestlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DepartmentWiseRequestlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
