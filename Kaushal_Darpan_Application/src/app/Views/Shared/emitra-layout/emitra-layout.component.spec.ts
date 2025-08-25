import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitraLayoutComponent } from './emitra-layout.component';

describe('EmitraLayoutComponent', () => {
  let component: EmitraLayoutComponent;
  let fixture: ComponentFixture<EmitraLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmitraLayoutComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmitraLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
