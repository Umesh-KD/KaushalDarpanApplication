import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddIssueTrackerComponent } from './add-issue-tracker.component';

describe('AddIssueTrackerComponent', () => {
  let component: AddIssueTrackerComponent;
  let fixture: ComponentFixture<AddIssueTrackerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddIssueTrackerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddIssueTrackerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
