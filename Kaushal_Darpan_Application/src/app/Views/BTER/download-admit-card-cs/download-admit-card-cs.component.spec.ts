import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadAdmitCardCSComponent } from './download-admit-card-cs.component';

describe('DownloadAdmitCardCSComponent', () => {
  let component: DownloadAdmitCardCSComponent;
  let fixture: ComponentFixture<DownloadAdmitCardCSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadAdmitCardCSComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadAdmitCardCSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
