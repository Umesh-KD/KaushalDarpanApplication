import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionalDiplomaCertificateDownloadComponent } from './ProvisionalDiplomaCertificateDownload.component';

describe('ProvisionalDiplomaCertificateDownloadComponent', () => {
  let component: ProvisionalDiplomaCertificateDownloadComponent;
  let fixture: ComponentFixture<ProvisionalDiplomaCertificateDownloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProvisionalDiplomaCertificateDownloadComponent]
    });
    fixture = TestBed.createComponent(ProvisionalDiplomaCertificateDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
