import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CitizenSuggestionTrackComponent } from './citizen-suggestion-track.component';

describe('CitizenSuggestionTrackComponent', () => {
  let component: CitizenSuggestionTrackComponent;
  let fixture: ComponentFixture<CitizenSuggestionTrackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CitizenSuggestionTrackComponent]
    });
    fixture = TestBed.createComponent(CitizenSuggestionTrackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
