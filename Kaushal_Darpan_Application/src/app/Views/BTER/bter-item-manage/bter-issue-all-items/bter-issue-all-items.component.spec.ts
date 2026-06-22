import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBterIssueAllItemComponent } from './bter-issue-all-items.component';

describe('AddBterIssueAllItemComponent', () => {
  let component: AddBterIssueAllItemComponent;
  let fixture: ComponentFixture<AddBterIssueAllItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddBterIssueAllItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddBterIssueAllItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
