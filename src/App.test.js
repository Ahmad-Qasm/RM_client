import { render, screen } from '@testing-library/react';
import { act } from "react-dom/test-utils";
import App from './App';


// test('App : Rendered : Has heading', () => {
//   var headingElement;
//   act(() => {
//     render(<App />);
//     headingElement = screen.getByRole('heading');
//   });
//   expect(headingElement).not.toBeNull();
// });


test('App : Rendered : Has Home button', () => {
  var btn;
  act(() => {
    render(<App />);
    btn = screen.getByRole('button', {name: 'home-button'});
  });
  expect(btn).not.toBeNull();
});
