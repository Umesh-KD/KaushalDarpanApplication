import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIsurveyperformComponent } from './iti_survey-perform.component';

describe('IDFFundDetailsComponent', () => {
  let component: ITIsurveyperformComponent;
  let fixture: ComponentFixture<ITIsurveyperformComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIsurveyperformComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIsurveyperformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
