import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PapersMasterComponent } from './papers-master.component';

describe('PapersMasterComponent', () => {
  let component: PapersMasterComponent;
  let fixture: ComponentFixture<PapersMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PapersMasterComponent]
    });
    fixture = TestBed.createComponent(PapersMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
