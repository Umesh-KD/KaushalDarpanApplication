import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiInstructorFormComponent } from './iti-instructor-form.component';

describe('ItiInstructorComponent', () => {
  let component: ItiInstructorFormComponent;
  let fixture: ComponentFixture<ItiInstructorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiInstructorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiInstructorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
