import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAnnexture32Component } from './upload-annexture32.component';

describe('UploadAnnexture32Component', () => {
  let component: UploadAnnexture32Component;
  let fixture: ComponentFixture<UploadAnnexture32Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UploadAnnexture32Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadAnnexture32Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
