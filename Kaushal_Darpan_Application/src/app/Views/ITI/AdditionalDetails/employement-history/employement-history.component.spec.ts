import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentEmployementHistoryComponent } from './employement-history.component';

describe('CompanyMasterComponent', () => {
  let component: StudentEmployementHistoryComponent;
  let fixture: ComponentFixture<StudentEmployementHistoryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentEmployementHistoryComponent]
    });
    fixture = TestBed.createComponent(StudentEmployementHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
