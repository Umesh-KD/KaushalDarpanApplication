import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiPaperUploadComponent } from './iti-paper-upload.component';

describe('ItiPaperUploadComponent', () => {
  let component: ItiPaperUploadComponent;
  let fixture: ComponentFixture<ItiPaperUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiPaperUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiPaperUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
