import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotedStudentComponent } from './promoted-student.component';

describe('PromotedStudentComponent', () => {
  let component: PromotedStudentComponent;
  let fixture: ComponentFixture<PromotedStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotedStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotedStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
