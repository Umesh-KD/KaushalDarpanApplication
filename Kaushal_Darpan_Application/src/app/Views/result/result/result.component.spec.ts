import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItiResultComponent } from './result.component';

describe('ItiResultComponent', () => {
  let component: ItiResultComponent;
  let fixture: ComponentFixture<ItiResultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ItiResultComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ItiResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
