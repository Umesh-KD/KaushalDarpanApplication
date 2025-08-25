import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITISeatMatrixComponent } from './itiseat-matrix.component';

describe('ITISeatMatrixComponent', () => {
  let component: ITISeatMatrixComponent;
  let fixture: ComponentFixture<ITISeatMatrixComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ITISeatMatrixComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITISeatMatrixComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
