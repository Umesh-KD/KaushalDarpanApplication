import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllpostnewComponent } from './allpostnew.component';

describe('AllpostnewComponent', () => {
  let component: AllpostnewComponent;
  let fixture: ComponentFixture<AllpostnewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllpostnewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllpostnewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
