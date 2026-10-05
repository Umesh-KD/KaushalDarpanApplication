import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PromotionEligibleStudentComponent } from './promotion-eligible-student.component';

describe('PromotionEligibleStudentComponent', () => {
  let component: PromotionEligibleStudentComponent;
  let fixture: ComponentFixture<PromotionEligibleStudentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromotionEligibleStudentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromotionEligibleStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
