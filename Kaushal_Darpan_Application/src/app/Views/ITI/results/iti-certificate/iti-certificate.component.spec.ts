import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiCertificateComponent } from './iti-certificate.component';

describe('ItiCertificateComponent', () => {
  let component: ItiCertificateComponent;
  let fixture: ComponentFixture<ItiCertificateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItiCertificateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiCertificateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
