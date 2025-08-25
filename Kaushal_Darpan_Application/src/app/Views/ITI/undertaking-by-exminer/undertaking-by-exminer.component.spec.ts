import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UndertakingByExminerComponent } from './undertaking-by-exminer.component';

describe('UndertakingByExminerComponent', () => {
  let component: UndertakingByExminerComponent;
  let fixture: ComponentFixture<UndertakingByExminerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UndertakingByExminerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UndertakingByExminerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
