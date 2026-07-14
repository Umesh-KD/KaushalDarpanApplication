import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiplomaCertificateDownloadComponent } from './DiplomaCertificateDownload.component';

describe('DiplomaCertificateDownloadComponent', () => {
  let component: DiplomaCertificateDownloadComponent;
  let fixture: ComponentFixture<DiplomaCertificateDownloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DiplomaCertificateDownloadComponent]
    });
    fixture = TestBed.createComponent(DiplomaCertificateDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
