import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCounsellingCandidateFormComponent } from './edit-counselling-candidate-form.component';

describe('EditCounsellingCandidateFormComponent', () => {
  let component: EditCounsellingCandidateFormComponent;
  let fixture: ComponentFixture<EditCounsellingCandidateFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditCounsellingCandidateFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditCounsellingCandidateFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
