import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiPaperUploadNcvtComponent } from './iti-paper-upload-ncvt.component';

describe('ItiPaperUploadNcvtComponent', () => {
  let component: ItiPaperUploadNcvtComponent;
  let fixture: ComponentFixture<ItiPaperUploadNcvtComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiPaperUploadNcvtComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiPaperUploadNcvtComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
