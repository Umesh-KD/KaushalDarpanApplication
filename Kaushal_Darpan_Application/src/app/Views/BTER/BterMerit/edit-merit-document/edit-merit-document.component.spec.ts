import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMeritDocumentComponent } from './edit-merit-document.component';

describe('EditMeritDocumentComponent', () => {
  let component: EditMeritDocumentComponent;
  let fixture: ComponentFixture<EditMeritDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditMeritDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMeritDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
