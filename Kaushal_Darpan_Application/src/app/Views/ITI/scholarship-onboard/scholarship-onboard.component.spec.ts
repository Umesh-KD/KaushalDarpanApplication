import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScholarshipOnboardComponent } from './scholarship-onboard.component';

describe('ScholarshipOnboardComponent', () => {
  let component: ScholarshipOnboardComponent;
  let fixture: ComponentFixture<ScholarshipOnboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScholarshipOnboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScholarshipOnboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
