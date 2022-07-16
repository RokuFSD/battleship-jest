import { createElement } from '../index';

test('Create element', () => {
  let testDiv = createElement('div', { class: 'midiv', id: 'midiv' }, 'Prueba');
  expect(testDiv.outerHTML).toBe('<div class="midiv" id="midiv">Prueba</div>');
});

test('Create multiple elements', () => {
  let testDiv = createElement('div', { class: 'midiv', id: 'midiv' }, [
    createElement('div', { class: 'myInnerdiv' }, 'PruebaInterna'),
    createElement('button', { class: 'myInnerButton' }, 'Submit'),
  ]);
  expect(testDiv.outerHTML).toBe(
    '<div class="midiv" id="midiv"><div class="myInnerdiv">PruebaInterna</div><button class="myInnerButton">Submit</button></div>',
  );
});
