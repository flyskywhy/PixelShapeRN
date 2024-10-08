import test from 'blue-tape';
import sinon from 'sinon';
import Brush from '../../src/modules/brush/Brush';
import Eraser from '../../src/modules/eraser/Eraser';
import lineTo from '../importStubs/lineTo.stub';

let eraser;

const before = () => {
  eraser = new Eraser();
  eraser._ctx = new RenderingContext2d();
};

test('Eraser =>', (expect) => {
  expect.test('::constructor', (expect) => {
    before();

    expect.ok(
      eraser instanceof Brush,
      'Should extend Brush class functionality',
    );
    expect.end();
  });

  expect.test('::onMouseDown', (expect) => {
    before();

    eraser.clearPixelCell = sinon.spy();

    eraser.onMouseDown(100, 100);
    expect.ok(
      eraser.clearPixelCell.calledWith(eraser._ctx),
      'Should clear cell on mouseDown',
    );
    expect.end();
  });

  expect.test('::draw', (expect) => {
    before();

    eraser.clearPixelCell = sinon.spy();

    eraser.draw();
    expect.ok(
      lineTo.called && eraser.clearPixelCell.called,
      'Should call lineTo on draw method with clearPixelCell as callback',
    );
    expect.end();
  });

  expect.end();
});
