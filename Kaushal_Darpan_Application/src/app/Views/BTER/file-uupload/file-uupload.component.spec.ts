import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FileUuploadComponent } from './file-uupload.component';

describe('FileUuploadComponent', () => {
  let component: FileUuploadComponent;
  let fixture: ComponentFixture<FileUuploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FileUuploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FileUuploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
