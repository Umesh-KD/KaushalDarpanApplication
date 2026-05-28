import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IIPEventConsentListComponent } from './iip-event-consent-list.component';

describe('IIPEventConsentListComponent', () => {
  let component: IIPEventConsentListComponent;
  let fixture: ComponentFixture<IIPEventConsentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IIPEventConsentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IIPEventConsentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
