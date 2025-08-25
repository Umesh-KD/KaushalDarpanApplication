import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CorrectMeritDocumentComponent } from './correct-merit-document.component';

describe('CorrectMeritDocumentComponent', () => {
  let component: CorrectMeritDocumentComponent;
  let fixture: ComponentFixture<CorrectMeritDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CorrectMeritDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CorrectMeritDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
