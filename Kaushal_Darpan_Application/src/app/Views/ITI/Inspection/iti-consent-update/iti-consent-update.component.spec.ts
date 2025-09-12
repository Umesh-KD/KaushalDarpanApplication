import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIConsentUpdateComponent } from './iti-consent-update.component';

describe('ITIConsentComponent', () => {
  let component: ITIConsentUpdateComponent;
  let fixture: ComponentFixture<ITIConsentUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIConsentUpdateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIConsentUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
