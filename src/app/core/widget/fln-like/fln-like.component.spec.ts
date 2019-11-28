import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlnLikeComponent } from './fln-like.component';

describe('FlnLikeComponent', () => {
  let component: FlnLikeComponent;
  let fixture: ComponentFixture<FlnLikeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlnLikeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlnLikeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
