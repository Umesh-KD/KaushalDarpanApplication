import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllotedCandidateListComponent } from './alloted-candidate-list.component';

describe('AllotedCandidateListComponent', () => {
  let component: AllotedCandidateListComponent;
  let fixture: ComponentFixture<AllotedCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllotedCandidateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllotedCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
