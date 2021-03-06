import { cleanup, fireEvent, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { IFacultyOld } from './constants';
import { UniversalListPL } from './Lists';

afterEach(cleanup);

describe('<FacultiesList/>', () => {
  const faculties: IFacultyOld[] = require('../public/data/faculties.json');

  it('Should render all faculties', () => {
    const wrapper = render(
      <MemoryRouter>
        <UniversalListPL loading={true} title="Title" items={faculties} />
      </MemoryRouter>
    );
    let ul = wrapper.container.getElementsByTagName('ul')[0];
    expect(ul.childElementCount).toBe(faculties.length);
  });
  it('Should render only faculties matching search', () => {
    const wrapper = render(
      <MemoryRouter>
        <UniversalListPL loading={true} title="Title" items={faculties} />
      </MemoryRouter>
    );
    let ul = wrapper.container.getElementsByTagName('ul')[0];
    const input = wrapper.getByTestId('input-search');
    fireEvent.change(input, { target: { value: 'Управления' } });
    // wrapper.debug();
    ul = wrapper.container.getElementsByTagName('ul')[0];
    expect(ul.childElementCount).toBe(1);
  });
});
