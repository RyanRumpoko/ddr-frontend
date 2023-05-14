import React from 'react'
import { CCardFooter, CPagination, CPaginationItem } from '@coreui/react'
import { laquoPagination } from 'src/util/Pagination'

const PaginationComponent = ({
  currentPage,
  totalPage,
  setCurrentPage,
  setTotalPage,
  setIsChangingPage,
  totalPaginate,
}) => {
  const laquoHandler = (direction, idx) => {
    setIsChangingPage(true)
    const laquo = laquoPagination(direction, currentPage, totalPage, totalPaginate, idx)
    setCurrentPage(laquo.activePage)
    setTotalPage(laquo.totalPage)
  }
  return (
    <CCardFooter className="d-flex justify-content-center align-item-center">
      <CPagination>
        <CPaginationItem onClick={() => laquoHandler('left')} disabled={currentPage === 1}>
          Previous
        </CPaginationItem>
        {totalPage.map((item, idx) => (
          <CPaginationItem
            key={idx}
            onClick={() => laquoHandler('middle', idx + 1)}
            active={currentPage === idx + 1}
            hidden={item.hidden}
          >
            {idx + 1}
          </CPaginationItem>
        ))}
        <CPaginationItem
          onClick={() => laquoHandler('right')}
          disabled={currentPage === totalPaginate || totalPage.length === 0}
        >
          Next
        </CPaginationItem>
      </CPagination>
    </CCardFooter>
  )
}

export default PaginationComponent
