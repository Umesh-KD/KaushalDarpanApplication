import { ComponentFixture, TestBed } from '@angular/core/testing';

import { listitibankguaranteeComponent } from './list-iti-bankguarantee.component';

describe('listitibankguaranteeComponent', () => {
  let component: listitibankguaranteeComponent;
  let fixture: ComponentFixture<listitibankguaranteeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [listitibankguaranteeComponent]
    });
    fixture = TestBed.createComponent(listitibankguaranteeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
