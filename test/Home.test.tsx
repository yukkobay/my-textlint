import { afterEach, beforeEach, expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../src/pages'
import userEvent from '@testing-library/user-event'
import * as workerFactory from '../src/common/WokerFactory'
import { UserEvent } from '@testing-library/user-event/setup/setup'

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

vi.mock('next/router', () => require('next-router-mock'))
vi.mock('worker_threads')

const makeWorkerSpy = vi.spyOn(workerFactory, 'makeWorker')

describe('renderされた場合', () => {
  let user: UserEvent

  beforeEach(() => {
    user = userEvent.setup()
    makeWorkerSpy.mockImplementation(() => undefined)
  })

  test('入力可能なtextareaを表示する', async () => {
    render(<Home />)

    const textbox = screen.getByRole('textbox')
    expect(textbox).toHaveValue('')

    await user.type(textbox, 'Hi Gizmo!')

    expect(textbox).toHaveValue('Hi Gizmo!')
  })

  test('TextlintWorkerに正しいpathを設定する', () => {
    render(<Home />)

    expect(makeWorkerSpy).toHaveBeenCalledOnce()
    expect(makeWorkerSpy).toHaveBeenCalledWith('/textlint-worker.js')

    makeWorkerSpy.mockClear()
  })
})

describe('textareaに入力した時', () => {
  let user: UserEvent
  const workerSpy = { postMessage: vi.fn() }

  beforeEach(() => {
    user = userEvent.setup()
    makeWorkerSpy.mockImplementation(() => workerSpy as any)
  })

  test('入力終了の800ms後にTextlintWorkerにpostする', async () => {
    render(<Home />)
    const textbox = screen.getByRole('textbox')

    await user.type(textbox, 'a')
    expect(workerSpy.postMessage).not.toHaveBeenCalled()

    await user.type(textbox, 'ny message')
    expect(workerSpy.postMessage).not.toHaveBeenCalled()

    await sleep(800)

    expect(workerSpy.postMessage).toHaveBeenCalledOnce()
    expect(workerSpy.postMessage).toHaveBeenCalledWith({
      command: 'lint',
      text: 'any message',
      ext: '.txt',
    })
  })
})

describe('Workerからmessageを受け取った時', () => {
  test('command名が`lint:result`の場合、メッセージを表示する', () => {
    // TODO:
  })
})

// TODO: MessageList
// TODO: workerからreceiveした場合、0件だった場合、xxxが表示される
// TODO: workerからreceiveした場合、1件だった場合、xxxが表示される
// TODO: workerからreceiveした場合、2件だった場合、xxxが表示される

// TODO: Title, description, favicon
// TODO: Header, Footer, Rules and more...
