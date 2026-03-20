import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNodalVerifierComponent } from './create-nodal-verifier.component';

describe('CreateNodalVerifierComponent', () => {
  let component: CreateNodalVerifierComponent;
  let fixture: ComponentFixture<CreateNodalVerifierComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateNodalVerifierComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateNodalVerifierComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
