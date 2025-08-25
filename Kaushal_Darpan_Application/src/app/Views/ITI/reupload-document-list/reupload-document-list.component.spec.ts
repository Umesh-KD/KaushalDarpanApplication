import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuploadDocumentListComponent } from './reupload-document-list.component';

describe('ReuploadDocumentListComponent', () => {
  let component: ReuploadDocumentListComponent;
  let fixture: ComponentFixture<ReuploadDocumentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ReuploadDocumentListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReuploadDocumentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
