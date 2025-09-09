import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIConsentComponent } from './iti-consent.component';

describe('ITIConsentComponent', () => {
  let component: ITIConsentComponent;
  let fixture: ComponentFixture<ITIConsentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIConsentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIConsentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
