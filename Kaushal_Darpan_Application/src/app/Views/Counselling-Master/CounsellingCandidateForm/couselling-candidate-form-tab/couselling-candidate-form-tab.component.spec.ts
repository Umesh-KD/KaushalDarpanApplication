import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CousellingCandidateFormTabComponent } from './couselling-candidate-form-tab.component';

describe('CousellingCandidateFormTabComponent', () => {
  let component: CousellingCandidateFormTabComponent;
  let fixture: ComponentFixture<CousellingCandidateFormTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CousellingCandidateFormTabComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CousellingCandidateFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
