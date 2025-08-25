import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksheetLetterComponent } from './marksheet-letter.component';

describe('MarksheetLetterComponent', () => {
  let component: MarksheetLetterComponent;
  let fixture: ComponentFixture<MarksheetLetterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarksheetLetterComponent]
    });
    fixture = TestBed.createComponent(MarksheetLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
