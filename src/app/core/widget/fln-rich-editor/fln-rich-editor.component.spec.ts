import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FlnRichEditorComponent } from './fln-rich-editor.component';

describe('FlnRichEditorComponent', () => {
  let component: FlnRichEditorComponent;
  let fixture: ComponentFixture<FlnRichEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlnRichEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlnRichEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
