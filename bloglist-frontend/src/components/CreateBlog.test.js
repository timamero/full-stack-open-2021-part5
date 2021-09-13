import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import CreateBlog from './CreateBlog'

test('test that handleCreateBlog is called when form is submitted', () => {
  const handleCreateBlog = jest.fn()

  const component = render(
    <CreateBlog handleCreateBlog={handleCreateBlog} />
  )

  const title = component.container.querySelector('#title')
  const author = component.container.querySelector('#author')
  const url = component.container.querySelector('#url')
  const form = component.container.querySelector('form')

  fireEvent.change(title, {
    target: { value: 'testing title input' }
  })
  fireEvent.change(author, {
    target: { value: 'test author' }
  })
  fireEvent.change(url, {
    target: { value: 'test@example.com' }
  })
  fireEvent.submit(form)

  expect(handleCreateBlog.mock.calls).toHaveLength(1)
  expect(handleCreateBlog.mock.calls[0][0]).toEqual({ title: 'testing title input', author: 'test author', url: 'test@example.com' })
})