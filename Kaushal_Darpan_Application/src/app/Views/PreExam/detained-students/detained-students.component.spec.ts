import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetainedStudentsComponent } from './detained-students.component';

describe('DetainedStudentsComponent', () => {
  let component: DetainedStudentsComponent;
  let fixture: ComponentFixture<DetainedStudentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetainedStudentsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetainedStudentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
