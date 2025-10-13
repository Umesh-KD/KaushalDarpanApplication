import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddITIIssueItemComponent } from './iti-issue-item.component';

describe('AddITIIssueItemComponent', () => {
  let component: AddITIIssueItemComponent;
  let fixture: ComponentFixture<AddITIIssueItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddITIIssueItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddITIIssueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
