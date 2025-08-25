import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LayOutTestComponent } from './lay-out-test.component';

describe('LayOutTestComponent', () => {
  let component: LayOutTestComponent;
  let fixture: ComponentFixture<LayOutTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LayOutTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LayOutTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
