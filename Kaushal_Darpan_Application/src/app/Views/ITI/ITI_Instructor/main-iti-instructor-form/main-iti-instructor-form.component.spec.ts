import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MainItiInstructorFormComponent } from './main-iti-instructor-form.component';

describe('ItiInstructorComponent', () => {
  let component: MainItiInstructorFormComponent;
  let fixture: ComponentFixture<MainItiInstructorFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MainItiInstructorFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MainItiInstructorFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
