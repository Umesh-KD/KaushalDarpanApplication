import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperAutoSelectComponent } from './paper-auto-select.component';

describe('PaperAutoSelectComponent', () => {
  let component: PaperAutoSelectComponent;
  let fixture: ComponentFixture<PaperAutoSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaperAutoSelectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperAutoSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
