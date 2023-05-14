const assignPagination = (total_data, perPage) => {
  const count = Math.ceil(total_data / parseInt(perPage))
  const result = {
    countArray: [],
    totalPaginate: count,
  }
  for (let i = 1; i <= count; i++) {
    if (i <= 3) {
      result.countArray.push({ i, hidden: false })
    }
  }
  return result
}

const laquoPagination = (direction, currentPage, totalPage, totalPaginate, idx) => {
  const result = {
    activePage: 0,
    totalPage: [],
  }
  if (direction === 'left' && currentPage > 1) {
    const newPage = [...totalPage]
    if (currentPage + 2 <= totalPage.length) {
      newPage[currentPage + 1].hidden = true
      newPage[currentPage - 2].hidden = false
    }
    result.activePage = currentPage - 1
    result.totalPage = newPage
  } else if (direction === 'right' && currentPage <= totalPage.length) {
    const newPage = [...totalPage]
    if (totalPage.length - currentPage >= 0 && currentPage > 2) {
      newPage[currentPage - 3].hidden = true
      if (totalPage.length !== totalPaginate && !newPage[currentPage]) {
        newPage.push({ i: currentPage + 1, hidden: false })
      }
      newPage[currentPage].hidden = false
    }
    result.totalPage = newPage
    result.activePage = currentPage + 1
  } else {
    result.totalPage = [...totalPage]
    result.activePage = idx
  }
  return result
}

export { assignPagination, laquoPagination }
