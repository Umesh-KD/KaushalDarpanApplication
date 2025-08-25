import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperSetterComponent } from './paper-setter.component';

describe('PaperSetterComponent', () => {
  let component: PaperSetterComponent;
  let fixture: ComponentFixture<PaperSetterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PaperSetterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperSetterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
