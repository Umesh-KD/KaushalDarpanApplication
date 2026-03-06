import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIDirectprivateStudentJanAadharDetailComponent } from './iti-direct-private-student-jan-aadhar-detail.component';

describe('ITIDirectprivateStudentJanAadharDetailComponent', () => {
  let component: ITIDirectprivateStudentJanAadharDetailComponent;
  let fixture: ComponentFixture<ITIDirectprivateStudentJanAadharDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIDirectprivateStudentJanAadharDetailComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIDirectprivateStudentJanAadharDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
