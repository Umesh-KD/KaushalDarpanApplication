import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QualificationTabComponent } from './qualification-tab.component';

describe('QualificationTabComponent', () => {
  let component: QualificationTabComponent;
  let fixture: ComponentFixture<QualificationTabComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QualificationTabComponent]
    });
    fixture = TestBed.createComponent(QualificationTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
