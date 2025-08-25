import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppointITIExaminerComponent } from './appoint-itiexaminer.component';

describe('AppointITIExaminerComponent', () => {
  let component: AppointITIExaminerComponent;
  let fixture: ComponentFixture<AppointITIExaminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppointITIExaminerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AppointITIExaminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
