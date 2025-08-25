import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BterPaperUploadComponent } from './bter-paper-upload.component';

describe('ItiPaperUploadComponent', () => {
  let component: BterPaperUploadComponent;
  let fixture: ComponentFixture<BterPaperUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BterPaperUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BterPaperUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
