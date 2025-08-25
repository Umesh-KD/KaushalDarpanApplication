import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaperSetterVerifyComponent } from './paper-setter-verify.component';

describe('PaperSetterVerifyComponent', () => {
  let component: PaperSetterVerifyComponent;
  let fixture: ComponentFixture<PaperSetterVerifyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaperSetterVerifyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaperSetterVerifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
