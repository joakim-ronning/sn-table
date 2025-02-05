import './rtl-setup';
import React from 'react';
import { render } from '@testing-library/react';
import { expect } from 'chai';
import sinon from 'sinon';

import * as withColumnStyling from '../withColumnStyling';
import * as stylingUtils from '../../utils/styling-utils';

describe('withColumnStyling', () => {
  let HOC;
  let cell;
  let column;
  let styling;

  beforeEach(() => {
    // This is a bit of dummy mock. value will be on props, but this is not how the value is set. That is done in tableBodyWrapper
    // But this enables testing that withStyling uses the CellComponent correctly
    HOC = withColumnStyling.default((props) => <div {...props}>{props.value}</div>);
    sinon.stub(stylingUtils, 'getColumnStyle').returns(sinon.spy());

    styling = {};
    cell = {
      qAttrExps: {},
    };
    column = {
      stylingInfo: [],
    };
  });

  afterEach(() => {
    sinon.verifyAndRestore();
    sinon.resetHistory();
  });

  it('should render table head', () => {
    const { queryByText } = render(<HOC value="someValue" cell={cell} column={column} styling={styling} />);

    expect(queryByText('someValue')).to.be.visible;
    expect(stylingUtils.getColumnStyle).to.have.been.calledWith(styling, cell.qAttrExps, column.stylingInfo);
  });
});
