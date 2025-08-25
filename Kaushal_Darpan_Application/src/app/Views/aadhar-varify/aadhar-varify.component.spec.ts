import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentJanAadharDetailComponent } from './aadhar-varify.component';

describe('StudentJanAadharDetailComponent', () => {
  let component: StudentJanAadharDetailComponent;
  let fixture: ComponentFixture<StudentJanAadharDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentJanAadharDetailComponent]
    });
    fixture = TestBed.createComponent(StudentJanAadharDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
