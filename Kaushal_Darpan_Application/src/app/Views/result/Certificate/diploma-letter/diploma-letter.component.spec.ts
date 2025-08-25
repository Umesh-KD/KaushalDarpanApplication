import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomaLetterComponent } from './diploma-letter.component';

describe('DiplomaLetterComponent', () => {
  let component: DiplomaLetterComponent;
  let fixture: ComponentFixture<DiplomaLetterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiplomaLetterComponent]
    });
    fixture = TestBed.createComponent(DiplomaLetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
