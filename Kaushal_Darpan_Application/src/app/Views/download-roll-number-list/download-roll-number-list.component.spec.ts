import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadRollNumberListComponent } from './download-roll-number-list.component';

describe('DownloadRollNumberListComponent', () => {
  let component: DownloadRollNumberListComponent;
  let fixture: ComponentFixture<DownloadRollNumberListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DownloadRollNumberListComponent]
    });
    fixture = TestBed.createComponent(DownloadRollNumberListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
