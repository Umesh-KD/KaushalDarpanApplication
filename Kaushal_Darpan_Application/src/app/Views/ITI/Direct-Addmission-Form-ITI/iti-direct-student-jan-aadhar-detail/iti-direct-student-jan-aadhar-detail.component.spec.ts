import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDirectStudentJanAadharDetailComponent } from './iti-direct-student-jan-aadhar-detail.component';

describe('ITIDirectStudentJanAadharDetailComponent', () => {
  let component: ITIDirectStudentJanAadharDetailComponent;
  let fixture: ComponentFixture<ITIDirectStudentJanAadharDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIDirectStudentJanAadharDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIDirectStudentJanAadharDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
