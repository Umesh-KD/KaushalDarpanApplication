import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuploadDocumentComponent } from './reupload-document.component';

describe('ReuploadDocumentComponent', () => {
  let component: ReuploadDocumentComponent;
  let fixture: ComponentFixture<ReuploadDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReuploadDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuploadDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
