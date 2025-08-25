import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksheetIssueDateComponent } from './marksheet-issue-date.component';

describe('MarksheetIssueDateComponent', () => {
  let component: MarksheetIssueDateComponent;
  let fixture: ComponentFixture<MarksheetIssueDateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarksheetIssueDateComponent]
    });
    fixture = TestBed.createComponent(MarksheetIssueDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
