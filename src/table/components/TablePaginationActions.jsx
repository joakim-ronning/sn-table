import PropTypes from 'prop-types';
import React from 'react';
import IconButton from '@mui/material/IconButton';
import FirstPageIcon from '@mui/icons-material/FirstPage';
import KeyboardArrowLeft from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import LastPageIcon from '@mui/icons-material/LastPage';
import { makeStyles } from '@mui/styles';
import { handleLastTab } from '../utils/handle-key-press';

const useStyles = makeStyles({
  root: {
    display: 'flex',
  },
  paginationActionButton: {
    color: 'rgba(0, 0, 0, 0.54)',
  },
  disabled: {
    color: 'rgba(0, 0, 0, 0.3)',
    cursor: 'default',
  },
});

export default function TablePaginationActions(props) {
  const classes = useStyles();
  const { count, page, rowsPerPage, onPageChange, keyboard, tableWidth, translator, isInSelectionMode } = props;
  const onFirstPage = page === 0;
  const lastPage = Math.ceil(count / rowsPerPage) - 1;
  const onLastPage = page >= lastPage;
  const tabIndex = !keyboard.enabled || keyboard.active ? '0' : '-1';

  const handleLastButtonTab = (event) => handleLastTab(event, isInSelectionMode);
  const handleFirstPageButtonClick = (event) => onPageChange(event, 0);
  const handleBackButtonClick = (event) => onPageChange(event, page - 1);
  const handleNextButtonClick = (event) => onPageChange(event, page + 1);
  const handleLastPageButtonClick = (event) => onPageChange(event, lastPage);

  return (
    <div className={classes.root}>
      {tableWidth > 350 && (
        <IconButton
          onClick={!onFirstPage ? handleFirstPageButtonClick : () => {}}
          aria-disabled={onFirstPage}
          aria-label={translator.get('SNTable.Pagination.FirstPage')}
          title={translator.get('SNTable.Pagination.FirstPage')}
          tabindex={tabIndex}
          className={`${classes.paginationActionButton} ${onFirstPage && classes.disabled}`}
        >
          <FirstPageIcon />
        </IconButton>
      )}
      <IconButton
        onClick={!onFirstPage ? handleBackButtonClick : () => {}}
        aria-disabled={onFirstPage}
        aria-label={translator.get('SNTable.Pagination.PreviousPage')}
        title={translator.get('SNTable.Pagination.PreviousPage')}
        tabindex={tabIndex}
        className={`${classes.paginationActionButton} ${onFirstPage && classes.disabled}`}
      >
        <KeyboardArrowLeft />
      </IconButton>
      <IconButton
        onClick={!onLastPage ? handleNextButtonClick : () => {}}
        aria-disabled={onLastPage}
        aria-label={translator.get('SNTable.Pagination.NextPage')}
        title={translator.get('SNTable.Pagination.NextPage')}
        tabindex={tabIndex}
        className={`${classes.paginationActionButton} ${onLastPage && classes.disabled}`}
        onKeyDown={keyboard.enabled && tableWidth <= 350 && handleLastButtonTab}
      >
        <KeyboardArrowRight />
      </IconButton>
      {tableWidth > 350 && (
        <IconButton
          onClick={!onLastPage ? handleLastPageButtonClick : () => {}}
          aria-disabled={onLastPage}
          aria-label={translator.get('SNTable.Pagination.LastPage')}
          title={translator.get('SNTable.Pagination.LastPage')}
          tabindex={tabIndex}
          className={`${classes.paginationActionButton} ${onLastPage && classes.disabled}`}
          onKeyDown={keyboard.enabled && handleLastButtonTab}
        >
          <LastPageIcon />
        </IconButton>
      )}
    </div>
  );
}

TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  keyboard: PropTypes.object.isRequired,
  isInSelectionMode: PropTypes.bool.isRequired,
  tableWidth: PropTypes.number.isRequired,
  translator: PropTypes.object.isRequired,
};
