import test from 'blue-tape';
import sinon from 'sinon';
import Brush from '../../src/modules/brush/Brush';
import lineTo from '../importStubs/lineTo.stub';

let brush;

const before = () => {
  const rndrCtx = new RenderingContext2d(),
    bfrCtx = new RenderingContext2d();

  brush = new Brush();
  brush._buffer = bfrCtx;
  brush._ctx = rndrCtx;
};

test('Brush =>', (expect) => {
  expect.test('::onMouseDown', (expect) => {
    before();

    brush.drawPixelCell = sinon.spy();

    brush.onMouseDown(100, 100);
    expect.ok(brush.mouseDown, 'Should set mouseDown flag to true');
    expect.ok(
      brush.drawPixelCell.calledWith(brush._ctx),
      'Should do actual drawing on rendering context only',
    );
    expect.end();
  });

  expect.test('::onMouseMove', (expect) => {
    before();

    brush.handleGhostPixelMove = sinon.spy();
    brush.draw = sinon.spy();

    brush.mouseDown = false;
    brush.onMouseMove(100, 100);
    expect.ok(
      brush.handleGhostPixelMove.called,
      'Should draw ghost on buffer whenever mouse moves',
    );
    expect.notOk(
      brush.draw.called,
      'Should not start drawing on rendering context if mouseDown flag is not truthy',
    );

    brush.mouseDown = true;
    brush.onMouseMove(100, 100);
    expect.ok(
      brush.draw.calledWith(brush._ctx),
      'Should draw on rendering context if mouseDown flag is truthy',
    );
    expect.end();
  });

  expect.test('::onMouseUp', (expect) => {
    before();

    brush.draw = sinon.spy();
    brush.mouseDown = true;
    brush.onMouseUp(100, 100);
    expect.notOk(brush.mouseDown, 'Should set mouseDown flag to false');
    expect.ok(
      brush.draw.calledWith(brush._ctx),
      'Should finish drawing on rendering context',
    );
    expect.end();
  });

  expect.test('::draw', (expect) => {
    before();

    brush.drawPixelCell = sinon.spy();

    brush.draw();
    expect.ok(
      lineTo.called && brush.drawPixelCell.called,
      'Should call lineTo on draw method with drawPixelCell as callback',
    );
    expect.end();
  });

  expect.end();
});
