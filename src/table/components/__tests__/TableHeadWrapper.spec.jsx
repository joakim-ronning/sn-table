import './rtl-setup';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';
import TableHeadWrapper from '../TableHeadWrapper';
import * as handleKeyPress from '../../utils/handle-key-press';
import * as handleAccessibility from '../../utils/handle-accessibility';

describe('<TableHeadWrapper />', () => {
  let tableData;
  let theme;
  let layout;
  let changeSortOrder;
  let constraints;
  let selectionsAPI;
  let keyboard;
  let translator;
  let focusedCellCoord;

  beforeEach(() => {
    tableData = {
      columns: [
        { id: 1, align: 'left', label: 'someDim', sortDirection: 'asc', isDim: true },
        { id: 2, align: 'right', label: 'someMsr', sortDirection: 'desc', isDim: false },
      ],
      columnOrder: [0, 1],
    };
    theme = {
      getColorPickerColor: () => {},
      name: () => {},
    };
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [0, 1],
      },
    };
    changeSortOrder = sinon.spy();
    constraints = {
      active: false,
    };
    selectionsAPI = {
      isModal: () => false,
    };
    keyboard = {
      enabled: false,
    };
    translator = { get: (s) => s };
    focusedCellCoord = [0, 0];
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render table head', () => {
    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );

    expect(queryByText(tableData.columns[0].label)).to.be.visible;
    expect(queryByText(tableData.columns[1].label)).to.be.visible;
  });

  it('should call changeSortOrder when clicking a header cell', () => {
    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).to.have.been.calledWith(layout, true, 0);
  });

  it('should not call changeSortOrder when clicking a header cell in edit mode', () => {
    constraints = {
      active: true,
    };
    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).not.have.been.called;
  });

  it('should not call changeSortOrder when clicking a header cell and cells are selected', () => {
    selectionsAPI = {
      isModal: () => true,
    };
    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.click(queryByText(tableData.columns[0].label));

    expect(changeSortOrder).not.have.been.called;
  });

  it('should call headHandleKeyPress when keyDown on a header cell', () => {
    sinon.stub(handleKeyPress, 'headHandleKeyPress').returns(sinon.spy());

    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.keyDown(queryByText(tableData.columns[0].label));

    expect(handleKeyPress.headHandleKeyPress).to.have.been.calledOnce;
  });

  it('should call handleClickToFocusHead when clicking a header cell', () => {
    sinon.stub(handleAccessibility, 'handleClickToFocusHead').returns(sinon.spy());

    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );
    fireEvent.mouseDown(queryByText(tableData.columns[0].label));

    expect(handleAccessibility.handleClickToFocusHead).to.have.been.calledOnce;
  });

  it('should change `aria-pressed` and `aria-sort` when we sort by second column', () => {
    tableData = {
      columns: [
        { ...tableData.columns[0], sortDirection: 'desc' },
        { ...tableData.columns[1], sortDirection: 'asc' },
      ],
      columnOrder: tableData.columnOrder,
    };
    layout = {
      qHyperCube: {
        qEffectiveInterColumnSortOrder: [1, 0],
      },
    };

    const { queryByText } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );

    const firstColQuery = queryByText(tableData.columns[0].label).closest('th');
    const secondColQuery = queryByText(tableData.columns[1].label).closest('th');

    expect(firstColQuery).to.not.have.attribute('aria-sort');
    expect(firstColQuery).to.have.attribute('aria-pressed', 'false');
    expect(secondColQuery).to.have.attribute('aria-sort', 'ascending');
    expect(secondColQuery).to.have.attribute('aria-pressed', 'true');
  });

  it('should render the visually hidden text instead of `aria-label` and has correct `scope` properly', () => {
    const { queryByText, queryByTestId } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );

    // check scope
    const tableColumn = queryByText(tableData.columns[0].label).closest('th');
    expect(tableColumn).to.have.attribute('scope', 'col');

    // check label
    const tableColumnSortlabel = queryByTestId('VHL-for-col-0');
    expect(tableColumnSortlabel).to.have.text('SNTable.SortLabel.PressSpaceToSort');
  });

  it('should not render visually hidden text while we are out of table header', () => {
    focusedCellCoord = [1, 1];
    const { queryByTestId } = render(
      <TableHeadWrapper
        tableData={tableData}
        theme={theme}
        layout={layout}
        changeSortOrder={changeSortOrder}
        constraints={constraints}
        selectionsAPI={selectionsAPI}
        keyboard={keyboard}
        translator={translator}
        focusedCellCoord={focusedCellCoord}
      />
    );

    const firstColHiddenLabel = queryByTestId('VHL-for-col-0');
    const secondColHiddenLabel = queryByTestId('VHL-for-col-1');

    expect(firstColHiddenLabel).to.be.null;
    expect(secondColHiddenLabel).to.be.null;
  });
});
