import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIAddConsentComponent } from './iti-add-consent.component';

describe('InspectionDeploymentComponent', () => {
  let component: ITIAddConsentComponent;
  let fixture: ComponentFixture<ITIAddConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIAddConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIAddConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
