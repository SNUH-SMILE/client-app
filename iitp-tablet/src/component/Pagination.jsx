import React, { useEffect, useState } from "react";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";

const makePagination = (
  firstPageNoOnPageList,
  lastPageNoOnPageList,
  activeNum,
  handledActive
) => {
  let lis = [];
  for (let i = firstPageNoOnPageList; i <= lastPageNoOnPageList; i++) {
    lis.push(
      <li
        key={"paginationLi" + i}
        className={activeNum === i ? "page-item active" : "page-item"}
        onClick={() => handledActive(i)}
      >
        <button className="page-link">{i}</button>
      </li>
    );
  }
  return lis;
};
function Pagination({ paginationObj, totalPageCount, handledList }) {
  const {
    currentPageNo,
    prevPaginationExists,
    nextPaginationExists,
    firstPageNoOnPageList,
    lastPageNoOnPageList,
  } = paginationObj;

  const [activeNum, setActiveNum] = useState(currentPageNo);

  useEffect(() => {
    setActiveNum(currentPageNo);
  }, [currentPageNo]);

  const handledActive = (num) => {
    handledList((prevValue) => ({ ...prevValue, currentPageNo: num }));
    setActiveNum(num);
  };
  const handledPrev = () => {
    const num = firstPageNoOnPageList - 10;
    handledList((prevValue) => ({ ...prevValue, currentPageNo: num }));
    setActiveNum(num);
  };
  const handledNext = () => {
    const num = firstPageNoOnPageList + 10;
    handledList((prevValue) => ({ ...prevValue, currentPageNo: num }));
    setActiveNum(num);
  };

  return (
    <nav className="">
      <ul className="pagination">
        <li className="page-item">
          <button
            className="page-link"
            aria-label="Previous"
            role={"prevPageIcon"}
            disabled={!prevPaginationExists}
            onClick={handledPrev}
          >
            <span aria-hidden="true">
              <CgChevronLeft />
            </span>
          </button>
        </li>
        {totalPageCount &&
          makePagination(
            firstPageNoOnPageList,
            lastPageNoOnPageList,
            activeNum,
            handledActive
          )}
        <li className="page-item">
          <button
            className="page-link"
            aria-label="Next"
            role={"nextPageIcon"}
            disabled={!nextPaginationExists}
            onClick={handledNext}
          >
            <span aria-hidden="true">
              <CgChevronRight />
            </span>
          </button>
        </li>
      </ul>
    </nav>
  );
}

export default React.memo(Pagination);
