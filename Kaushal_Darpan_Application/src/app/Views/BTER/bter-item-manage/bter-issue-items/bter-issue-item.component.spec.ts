import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBterIssueItemComponent } from './bter-issue-item.component';

describe('AddBterIssueItemComponent', () => {
  let component: AddBterIssueItemComponent;
  let fixture: ComponentFixture<AddBterIssueItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBterIssueItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBterIssueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
