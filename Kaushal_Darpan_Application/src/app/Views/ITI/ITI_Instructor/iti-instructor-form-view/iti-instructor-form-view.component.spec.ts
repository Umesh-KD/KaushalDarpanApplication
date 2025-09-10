import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiInstructorFormViewComponent } from './iti-instructor-form-view.component';

describe('ItiInstructorComponent', () => {
  let component: ItiInstructorFormViewComponent;
  let fixture: ComponentFixture<ItiInstructorFormViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiInstructorFormViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiInstructorFormViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
