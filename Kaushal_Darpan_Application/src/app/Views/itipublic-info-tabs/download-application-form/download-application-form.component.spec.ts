import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadApplicationFormComponent } from './download-application-form.component';

describe('KnowMeritITIComponent', () => {
  let component: DownloadApplicationFormComponent;
  let fixture: ComponentFixture<DownloadApplicationFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DownloadApplicationFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
