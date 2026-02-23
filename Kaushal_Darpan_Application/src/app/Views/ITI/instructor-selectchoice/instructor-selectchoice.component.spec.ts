import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructorSelectchoiceComponent } from './instructor-selectchoice.component';

describe('InstructorSelectchoiceComponent', () => {
  let component: InstructorSelectchoiceComponent;
  let fixture: ComponentFixture<InstructorSelectchoiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InstructorSelectchoiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InstructorSelectchoiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
