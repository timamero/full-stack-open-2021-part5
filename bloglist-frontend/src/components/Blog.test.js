import React from 'react'
import { render, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Blog from './Blog'

describe('<Blog /> rendering', () => {
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

  let component

  beforeEach(() => {
    component = render(
      <Blog blog={blog} userName={userName}/>
    )
  })

  test('displays title and author but does not render url or likes by default', () => {
    const toggleableDiv = component.container.querySelector('.toggleableDiv')

    expect(component.container).toHaveTextContent('This title is always displayed')
    expect(component.container).toHaveTextContent('L Kent')
    expect(component.container).toHaveTextContent('blog@example.com')
    expect(component.container).toHaveTextContent('likes: 10')
    expect(toggleableDiv).toHaveStyle('display: none')
  })

  test('test toggled content can be viewed', () => {
    const button = component.getByText('View')
    fireEvent.click(button)

    const toggleableDiv = component.container.querySelector('.toggleableDiv')

    expect(component.container).toHaveTextContent('This title is always displayed')
    expect(component.container).toHaveTextContent('L Kent')
    expect(component.container).toHaveTextContent('blog@example.com')
    expect(component.container).toHaveTextContent('likes: 10')
    expect(toggleableDiv).not.toHaveStyle('display: none')
  })
})

test('test when the like button is clicked twice, the event handler is called twice', () => {
  const handleUpdateBlog = jest.fn()

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
    <Blog blog={blog}
      userName={userName}
      handleUpdateBlog={handleUpdateBlog}
    />
  )

  const likeButton = component.getByText('Like')
  fireEvent.click(likeButton)
  fireEvent.click(likeButton)

  expect(handleUpdateBlog.mock.calls).toHaveLength(2)
})