import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviewFormTabComponent } from './preview-form-tab.component';

describe('PreviewFormTabComponent', () => {
  let component: PreviewFormTabComponent;
  let fixture: ComponentFixture<PreviewFormTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewFormTabComponent]
    });
    fixture = TestBed.createComponent(PreviewFormTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
