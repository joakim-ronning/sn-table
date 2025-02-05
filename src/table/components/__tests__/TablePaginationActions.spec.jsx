import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import TablePaginationActions from '../TablePaginationActions';
import * as handleAccessibility from '../../utils/handle-accessibility';

describe('<TablePaginationActions />', () => {
  let count;
  let page;
  let rowsPerPage;
  let onPageChange;
  let keyboardActive;
  let tableWidth;
  let translator;
  let isInSelectionMode;

  beforeEach(() => {
    count = 250;
    page = 0;
    rowsPerPage = 100;
    onPageChange = sinon.spy();
    keyboardActive = false;
    tableWidth = 500;
    translator = { get: (s) => s };
    isInSelectionMode = false;
    sinon.stub(handleAccessibility, 'focusConfirmButton').returns(sinon.spy());
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render all buttons', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    expect(queryByTitle('SNTable.Pagination.FirstPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.PreviousPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.NextPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.LastPage')).to.be.visible;
  });

  it('should render only previous and next button', () => {
    tableWidth = 300;
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    expect(queryByTitle('SNTable.Pagination.FirstPage')).to.be.null;
    expect(queryByTitle('SNTable.Pagination.PreviousPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.NextPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.LastPage')).to.be.null;
  });

  it('should not render pagination dropdown', () => {
    const { queryByTitle, queryByTestId } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    expect(queryByTitle('SNTable.Pagination.FirstPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.PreviousPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.NextPage')).to.be.visible;
    expect(queryByTitle('SNTable.Pagination.LastPage')).to.be.visible;
    expect(queryByTestId('pagination-dropdown')).to.be.null;
  });

  it('should call onPageChange when clicking next page', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    fireEvent.click(queryByTitle('SNTable.Pagination.NextPage'));
    expect(onPageChange).to.have.been.calledWith(sinon.match.any, 1);
  });

  it('should call onPageChange when clicking previous page', () => {
    page = 1;
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    fireEvent.click(queryByTitle('SNTable.Pagination.PreviousPage'));
    expect(onPageChange).to.have.been.calledWith(sinon.match.any, 0);
  });

  it('should call onPageChange when clicking last page', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    fireEvent.click(queryByTitle('SNTable.Pagination.LastPage'));
    expect(onPageChange).to.have.been.calledWith(sinon.match.any, 2);
  });

  it('should call onPageChange when clicking first page', () => {
    page = 2;
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    fireEvent.click(queryByTitle('SNTable.Pagination.FirstPage'));
    expect(onPageChange).to.have.been.calledWith(sinon.match.any, 0);
  });

  it('should call onPageChange when selecting page from dropdown', () => {
    tableWidth = 700;
    page = 0;
    const { queryByTestId } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );

    fireEvent.change(queryByTestId('pagination-dropdown'), { target: { value: 1 } });
    expect(onPageChange).to.have.been.calledWith(sinon.match.any, 1);
  });

  it('should not call focusConfirmButton when pressing tab on last page button and isInSelectionMode is false', () => {
    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab' });
    expect(handleAccessibility.focusConfirmButton).to.not.have.been.called;
  });

  it('should not call focusConfirmButton when pressing shift + tab on last page button and isInSelectionMode is true', () => {
    isInSelectionMode = true;

    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab', shiftKey: true });
    expect(handleAccessibility.focusConfirmButton).to.not.have.been.called;
  });

  it('should call focusConfirmButton when pressing tab on last page button and isInSelectionMode is true', () => {
    isInSelectionMode = true;

    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.LastPage'), { key: 'Tab' });
    expect(handleAccessibility.focusConfirmButton).to.have.been.calledOnce;
  });

  it('should call focusConfirmButton when pressing tab on next page button, isInSelectionMode is true and tableWidth < 350', () => {
    isInSelectionMode = true;
    tableWidth = 300;

    const { queryByTitle } = render(
      <TablePaginationActions
        count={count}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        keyboardActive={keyboardActive}
        tableWidth={tableWidth}
        translator={translator}
        isInSelectionMode={isInSelectionMode}
      />
    );
    fireEvent.keyDown(queryByTitle('SNTable.Pagination.NextPage'), { key: 'Tab' });
    expect(handleAccessibility.focusConfirmButton).to.have.been.calledOnce;
  });
});
