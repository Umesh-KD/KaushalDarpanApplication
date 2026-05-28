import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IipEventConsentListPublicComponent } from './iip-event-consent-list-public.component';

describe('IipEventConsentListPublicComponent', () => {
  let component: IipEventConsentListPublicComponent;
  let fixture: ComponentFixture<IipEventConsentListPublicComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IipEventConsentListPublicComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IipEventConsentListPublicComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
