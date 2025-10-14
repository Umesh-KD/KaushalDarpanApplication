import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadNcvtDataComponent } from './upload-ncvt-data.component';

describe('UploadNcvtDataComponent', () => {
  let component: UploadNcvtDataComponent;
  let fixture: ComponentFixture<UploadNcvtDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadNcvtDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadNcvtDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
