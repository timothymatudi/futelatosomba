import { fireEvent, render, screen } from '@testing-library/react';
import ImageUploader from './ImageUploader';

test('reorders, edits, marks primary and removes existing images', () => {
  const onImagesChange = jest.fn();
  render(
    <ImageUploader
      images={[
        { url: '/one.jpg', caption: 'One', isPrimary: true },
        { url: '/two.jpg', caption: 'Two', isPrimary: false }
      ]}
      onImagesChange={onImagesChange}
    />
  );

  fireEvent.click(screen.getAllByTitle('Move right')[0]);
  expect(onImagesChange.mock.calls.at(-1)[0].map((image) => image.url))
    .toEqual(['/two.jpg', '/one.jpg']);

  fireEvent.change(screen.getByDisplayValue('Two'), { target: { value: 'Front view' } });
  expect(onImagesChange.mock.calls.at(-1)[0][0].caption).toBe('Front view');

  fireEvent.click(screen.getAllByTitle('Set as primary')[0]);
  expect(onImagesChange.mock.calls.at(-1)[0][0].isPrimary).toBe(true);

  fireEvent.click(screen.getAllByTitle('Remove')[1]);
  expect(onImagesChange.mock.calls.at(-1)[0]).toHaveLength(1);
  expect(onImagesChange.mock.calls.at(-1)[0][0].isPrimary).toBe(true);
});

