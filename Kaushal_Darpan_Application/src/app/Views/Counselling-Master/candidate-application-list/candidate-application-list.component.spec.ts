import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateApplicationListComponent } from './candidate-application-list.component';

describe('CandidateApplicationListComponent', () => {
  let component: CandidateApplicationListComponent;
  let fixture: ComponentFixture<CandidateApplicationListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CandidateApplicationListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CandidateApplicationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
