import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorOptionFormComponent } from './instructor-option-form.component';

describe('InstructorOptionFormComponent', () => {
  let component: InstructorOptionFormComponent;
  let fixture: ComponentFixture<InstructorOptionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorOptionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorOptionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
