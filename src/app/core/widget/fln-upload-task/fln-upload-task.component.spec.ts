import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlnUploadTaskComponent } from './fln-upload-task.component';

describe('FlnUploadTaskComponent', () => {
  let component: FlnUploadTaskComponent;
  let fixture: ComponentFixture<FlnUploadTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlnUploadTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlnUploadTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
