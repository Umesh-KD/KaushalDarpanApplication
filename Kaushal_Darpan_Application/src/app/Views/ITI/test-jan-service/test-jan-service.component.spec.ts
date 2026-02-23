import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TestJanServiceComponent } from './test-jan-service.component';

describe('TestJanServiceComponent', () => {
  let component: TestJanServiceComponent;
  let fixture: ComponentFixture<TestJanServiceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestJanServiceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TestJanServiceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
