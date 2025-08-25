import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalPracticalAssesmentComponent } from './internal-practical-assesment.component';

describe('InternalPracticalAssesmentComponent', () => {
  let component: InternalPracticalAssesmentComponent;
  let fixture: ComponentFixture<InternalPracticalAssesmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InternalPracticalAssesmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InternalPracticalAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
