// stuffs of stubbing
const { stub, spy } = require('sinon')
const { client } = require('websocket')
const fakeConnect = stub(client.prototype, 'connect')

const { test } = require('ava')
const CQWebsocket = require('../..')
const { WebsocketType, WebsocketState } = CQWebsocket

test.after.always(function () {
  fakeConnect.restore()
})

test('#connect() returns the bot itself', function (t) {
  t.plan(1)

  const bot = new CQWebsocket()
  t.is(bot.connect(), bot)
})

test('#connect()', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebsocket()
    .on('socket.connecting', _spy)
    .connect()
  t.is(bot._monitor.EVENT.state, WebsocketState.CONNECTING)
  t.is(bot._monitor.API.state, WebsocketState.CONNECTING)
  t.true(_spy.calledTwice)
})

test('#connect(wsType="/event")', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebsocket()
    .on('socket.connecting', _spy)
    .connect(WebsocketType.EVENT)
  t.is(bot._monitor.EVENT.state, WebsocketState.CONNECTING)
  t.is(bot._monitor.API.state, WebsocketState.INIT)
  t.true(_spy.calledOnce)
})

test('#connect(wsType="/api")', function (t) {
  t.plan(3)

  const _spy = spy()
  const bot = new CQWebsocket()
    .on('socket.connecting', _spy)
    .connect(WebsocketType.API)
  t.is(bot._monitor.EVENT.state, WebsocketState.INIT)
  t.is(bot._monitor.API.state, WebsocketState.CONNECTING)
  t.true(_spy.calledOnce)
})

test('#connect() while bot has host, port and access_token options', function (t) {
  t.plan(2)

  const bot = new CQWebsocket({ access_token: '123456789', host: 'localhost', port: 12345 })
    .connect()
  t.true(fakeConnect.calledWith('ws://localhost:12345/event?access_token=123456789'))
  t.true(fakeConnect.calledWith('ws://localhost:12345/api?access_token=123456789'))
})

test('#connect() while bot has baseUrl and access_token options', function (t) {
  t.plan(2)

  const bot = new CQWebsocket({ access_token: '123456789', baseUrl: 'localhost:12345/ws' })
    .connect()
  t.true(fakeConnect.calledWith('ws://localhost:12345/ws/event?access_token=123456789'))
  t.true(fakeConnect.calledWith('ws://localhost:12345/ws/api?access_token=123456789'))
})
