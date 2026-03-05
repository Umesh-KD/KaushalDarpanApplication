import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIPlanDocumentComponent } from './itiplan-document.component';

describe('ITIPlanDocumentComponent', () => {
  let component: ITIPlanDocumentComponent;
  let fixture: ComponentFixture<ITIPlanDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITIPlanDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIPlanDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
