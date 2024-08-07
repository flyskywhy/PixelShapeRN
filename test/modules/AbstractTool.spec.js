import test from 'blue-tape';
import sinon from 'sinon';
import AbstractTool from '../../src/modules/basetool/AbstractTool';

let tool, context;

const before = () => {
  tool = new AbstractTool();
  context = new RenderingContext2d();
};

test('AbstractTool =>', (expect) => {
  expect.test('::_assignBufferContext, ::_assignRenderingContext', (expect) => {
    before();

    tool.useStateOn = sinon.spy();
    tool._assignRenderingContext(context);
    expect.ok(tool._ctx, 'Should assign new rendering context');

    tool._assignBufferContext(context);
    expect.ok(tool._buffer, 'Should assign new buffer context');
    expect.ok(
      context.clearRect.called,
      'Should clear buffer context surface when assigned',
    );
    expect.ok(tool.useStateOn.called, 'Should apply state on buffer context');
    expect.end();
  });

  expect.test('::applyState', (expect) => {
    before();

    const newState = {
      ghostData: {
        color: '#ababab',
        alpha: 1,
      },
    };

    tool.applyState(newState);
    expect.deepEqual(
      tool.state.ghostData,
      newState.ghostData,
      'Should set new props on the tools state',
    );
    expect.end();
  });

  expect.test('::useStateOn', (expect) => {
    before();

    const state = {
      size: tool.size,
      color: tool.state.color,
      alpha: tool.state.alpha,
      compositeOperation: tool.state.compositeOperation,
    };

    tool.useStateOn(context);

    const {
      lineWidth: size,
      fillStyle: color,
      globalAlpha: alpha,
      globalCompositeOperation: compositeOperation,
    } = context;

    expect.deepEqual(
      {size, color, alpha, compositeOperation},
      state,
      'Should set new state on context',
    );
    expect.end();
  });

  expect.test('::useGhostStateOn', (expect) => {
    before();

    const state = {
      alpha: tool.state.ghostData.alpha,
      color: tool.state.ghostData.color,
    };

    tool.useGhostStateOn(context);

    const {globalAlpha: alpha, fillStyle: color} = context;

    expect.deepEqual(
      {alpha, color},
      state,
      'Should set new ghost state on context',
    );
    expect.end();
  });

  expect.test('::getPixeledCoords', (expect) => {
    before();

    let coords;

    tool.applyState({size: 2});
    tool.applyPixelSize(10);

    expect.false(tool.getPixeledCoords(), 'Should return false on empty args');

    coords = tool.getPixeledCoords(311, 207);

    expect.deepEqual(
      coords,
      {x: 300, y: 190, naturalX: 30, naturalY: 19},
      'Should truncate input coords to grid cell size',
    );
    expect.end();
  });

  expect.test('::drawPixelCell', (expect) => {
    before();

    tool.getPixeledCoords = sinon.stub().returns({x: 100, y: 100});
    tool.drawPixelCell(context, 104, 104);

    expect.ok(
      tool.getPixeledCoords.called,
      'Should truncate coords before drawing',
    );
    expect.ok(
      context.fillRect.called,
      'Should draw pixel cell with provided coordinates',
    );
    expect.end();
  });

  expect.test('::clearPixelCell', (expect) => {
    before();

    tool.getPixeledCoords = sinon.stub().returns({x: 100, y: 100});
    tool.clearPixelCell(context, 104, 104);

    expect.ok(
      tool.getPixeledCoords.called,
      'Should truncate coords before clearing',
    );
    expect.ok(
      context.clearRect.called,
      'Should clear pixel cell with provided coordinates',
    );
    expect.end();
  });

  expect.test('::handleGhostPixelMove', (expect) => {
    before();

    tool.useGhostStateOn = sinon.spy();
    tool.clearPixelCell = sinon.spy();
    tool.drawPixelCell = sinon.spy();

    tool.handleGhostPixelMove(100, 100);
    expect.false(
      tool.useGhostStateOn.called,
      'Should do nothing if buffer is not defined on tool',
    );

    tool._assignBufferContext(context);
    tool.handleGhostPixelMove(100, 100);
    expect.ok(
      tool.useGhostStateOn.calledWith(tool._buffer) &&
        tool.clearPixelCell.calledWith(tool._buffer) &&
        tool.drawPixelCell.calledWith(tool._buffer),
      'Should operate with buffer context only',
    );
    expect.ok(
      tool._buffer.save.called && tool._buffer.restore.called,
      'Should save and restore buffers state before and after drawing respectively',
    );
    expect.end();
  });

  expect.test('::storeCallback', (expect) => {
    before();

    expect.throws(
      tool.storeCallback,
      'Should throw if not implemented in child',
    );
    expect.end();
  });

  expect.test('::onMouseDown', (expect) => {
    before();

    expect.throws(tool.onMouseDown, 'Should throw if not implemented in child');
    expect.end();
  });

  expect.test('::onMouseMove', (expect) => {
    before();

    expect.throws(tool.onMouseMove, 'Should throw if not implemented in child');
    expect.end();
  });

  expect.test('::onMouseUp', (expect) => {
    before();

    expect.throws(tool.onMouseUp, 'Should throw if not implemented in child');
    expect.end();
  });

  expect.end();
});
