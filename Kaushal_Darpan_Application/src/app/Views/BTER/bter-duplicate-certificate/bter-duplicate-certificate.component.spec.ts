import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterDuplicateCertificateComponent } from './bter-duplicate-certificate.component';

describe('BterDuplicateCertificateComponent', () => {
  let component: BterDuplicateCertificateComponent;
  let fixture: ComponentFixture<BterDuplicateCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BterDuplicateCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterDuplicateCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
