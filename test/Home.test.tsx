import { expect, test, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../src/pages'
import userEvent from '@testing-library/user-event'
import * as workerFactory from '../src/common/WokerFactory'
import { UserEvent } from '@testing-library/user-event/setup/setup'
vi.mock('next/router', () => require('next-router-mock'))
vi.mock('worker_threads')

describe('renderされた場合', () => {
  let user: UserEvent

  beforeEach(() => {
    user = userEvent.setup()
  })

  test('入力可能なtextareaを表示する', async () => {
    render(<Home />)

    const textbox = screen.getByRole('textbox')
    expect(textbox).toHaveValue('')

    await user.type(textbox, 'Hi Gizmo!')

    expect(textbox).toHaveValue('Hi Gizmo!')
  })

  test('TextlintWorkerに正しいpathを設定する', () => {
    const spy = vi
      .spyOn(workerFactory, 'makeWorker')
      .mockImplementation(() => undefined)

    render(<Home />)

    expect(spy).toHaveBeenCalledOnce()
    expect(spy).toHaveBeenCalledWith('/textlint-worker.js')
  })
})

describe('textareaに入力した時', () => {
  let user: UserEvent

  beforeEach(() => {
    user = userEvent.setup()
  })

  test('TextlintWorkerにpostする', () => {
    const workerSpy = { postMessage: vi.fn() }

    const spy = vi
      .spyOn(workerFactory, 'makeWorker')
      .mockImplementation(() => workerSpy as any)

    render(<Home />)
    expect(workerSpy.postMessage).not.toHaveBeenCalled()

    const textbox = screen.getByRole('textbox')
    user.type(textbox, 'H')

    expect(workerSpy.postMessage).toHaveBeenCalled()
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

// TODO: WokerFactory

// TODO: Title, description, favicon
// TODO: Header, Footer, Rules and more...
