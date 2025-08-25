import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenSuggestionComponent } from './citizen-suggestion.component';

describe('CitizenSuggestionComponent', () => {
  let component: CitizenSuggestionComponent;
  let fixture: ComponentFixture<CitizenSuggestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CitizenSuggestionComponent]
    });
    fixture = TestBed.createComponent(CitizenSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
