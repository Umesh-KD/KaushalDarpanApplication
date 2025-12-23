import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnLabItemComponent } from './return-lab-item.component';

describe('ReturnLabItemComponent', () => {
  let component: ReturnLabItemComponent;
  let fixture: ComponentFixture<ReturnLabItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReturnLabItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnLabItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
