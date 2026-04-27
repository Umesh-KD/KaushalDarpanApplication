import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiExaminationCollegeComponent } from './iti-examination-college.component';

describe('ItiExaminationCollegeComponent', () => {
  let component: ItiExaminationCollegeComponent;
  let fixture: ComponentFixture<ItiExaminationCollegeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiExaminationCollegeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiExaminationCollegeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
