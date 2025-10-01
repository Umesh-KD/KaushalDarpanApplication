import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateDetailsViewModalComponent } from './candidate-details-view-modal.component';

describe('CandidateDetailsViewModalComponent', () => {
  let component: CandidateDetailsViewModalComponent;
  let fixture: ComponentFixture<CandidateDetailsViewModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CandidateDetailsViewModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateDetailsViewModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
