import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarksheetDownloadComponent } from './marksheet-download.component';

describe('MarksheetDownloadComponent', () => {
  let component: MarksheetDownloadComponent;
  let fixture: ComponentFixture<MarksheetDownloadComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MarksheetDownloadComponent]
    });
    fixture = TestBed.createComponent(MarksheetDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
