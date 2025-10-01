import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacementAllStudentListComponent } from './placement-allstudentlist.component';

describe('CompanyMasterComponent', () => {
  let component:  PlacementAllStudentListComponent;
  let fixture: ComponentFixture<PlacementAllStudentListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlacementAllStudentListComponent]
    });
    fixture = TestBed.createComponent(PlacementAllStudentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
