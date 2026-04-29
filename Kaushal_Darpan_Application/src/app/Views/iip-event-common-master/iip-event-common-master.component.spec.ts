import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IipEventCommonMasterComponent } from './iip-event-common-master.component';

describe('IipEventCommonMasterComponent', () => {
  let component: IipEventCommonMasterComponent;
  let fixture: ComponentFixture<IipEventCommonMasterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IipEventCommonMasterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IipEventCommonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
