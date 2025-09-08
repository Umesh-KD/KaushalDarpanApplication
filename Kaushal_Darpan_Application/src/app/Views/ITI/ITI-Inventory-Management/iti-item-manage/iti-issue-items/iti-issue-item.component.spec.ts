import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddItiIssueItemComponent } from './iti-issue-item.component';

describe('AddItiIssueItemComponent', () => {
  let component: AddItiIssueItemComponent;
  let fixture: ComponentFixture<AddItiIssueItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddItiIssueItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddItiIssueItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
