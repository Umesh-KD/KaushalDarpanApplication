import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAnnexture32ListComponent } from './upload-annexture32-list.component';

describe('UploadAnnexture32ListComponent', () => {
  let component: UploadAnnexture32ListComponent;
  let fixture: ComponentFixture<UploadAnnexture32ListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadAnnexture32ListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAnnexture32ListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
