import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterCertificateComponent } from './bter-certificate.component';

describe('BterCertificateComponent', () => {
  let component: BterCertificateComponent;
  let fixture: ComponentFixture<BterCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BterCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
