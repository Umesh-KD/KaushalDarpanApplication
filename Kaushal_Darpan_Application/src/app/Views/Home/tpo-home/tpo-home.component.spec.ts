import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TPOHomeComponent } from './tpo-home.component';

describe('TPOHomeComponent', () => {
  let component: TPOHomeComponent;
  let fixture: ComponentFixture<TPOHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TPOHomeComponent]
    });
    fixture = TestBed.createComponent(TPOHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
