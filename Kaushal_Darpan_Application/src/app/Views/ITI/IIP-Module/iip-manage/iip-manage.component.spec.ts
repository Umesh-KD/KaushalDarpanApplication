import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ITIIIPManageComponent } from './iip-manage.component';

describe('ITIIIPManageComponent', () => {
  let component: ITIIIPManageComponent;
  let fixture: ComponentFixture<ITIIIPManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ITIIIPManageComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ITIIIPManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
