import { ComponentFixture, TestBed } from '@angular/core/testing';

import {UploadTraineeLogsListComponent } from './upload-trainee-logs-list.component';

describe('AllotedCandidateListComponent', () => {
  let component: UploadTraineeLogsListComponent;
  let fixture: ComponentFixture<UploadTraineeLogsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UploadTraineeLogsListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadTraineeLogsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
