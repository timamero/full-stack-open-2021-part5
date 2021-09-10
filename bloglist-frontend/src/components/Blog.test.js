import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

test('<Blog /> displays title and author but does not render url or likes by default', () => {
  const blog = {
    title: 'This title is always displayed',
    author: 'L Kent',
    url: 'blog@example.com',
    likes: 10,
    user: {
      name: 'testUser'
    }
  }

  const userName = 'testUser'

  const component = render(
    <Blog blog={blog} userName={userName}/>
  )

  const toggleableDiv = component.container.querySelector('.toggleableDiv')

  expect(component.container).toHaveTextContent('This title is always displayed')
  expect(component.container).toHaveTextContent('L Kent')
  expect(component.container).toHaveTextContent('blog@example.com')
  expect(component.container).toHaveTextContent('likes: 10')
  expect(toggleableDiv).toHaveStyle('display: none')
})

test('test toggled content can be viewed', () => {
  // const handleViewClick = jest.fn()

  const blog = {
    title: 'This title is always displayed',
    author: 'L Kent',
    url: 'blog@example.com',
    likes: 10,
    user: {
      name: 'testUser'
    }
  }

  const userName = 'testUser'

  const component = render(
    <Blog blog={blog} userName={userName}/>
  )

  component.debug()

  const button = component.getByText('View')
  fireEvent.click(button)

  const toggleableDiv = component.container.querySelector('.toggleableDiv')

  expect(component.container).toHaveTextContent('This title is always displayed')
  expect(component.container).toHaveTextContent('L Kent')
  expect(component.container).toHaveTextContent('blog@example.com')
  expect(component.container).toHaveTextContent('likes: 10')
  expect(toggleableDiv).not.toHaveStyle('display: none')
})