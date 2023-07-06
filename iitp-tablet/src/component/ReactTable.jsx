import React, { useEffect, useRef, useState } from "react";
import { CgChevronLeft, CgChevronRight } from "react-icons/cg";
import { BsCheckLg, BsX } from "react-icons/bs";
import { useTable, useSortBy, usePagination } from "react-table";
import PropTypes from "prop-types";
import styled from "styled-components";
import useAdmissionDetail from "../Utils/useAdmissionDetail";
import { click } from "@testing-library/user-event/dist/click";
import useDoubleTap from "../Utils/UseDoubleTap";
import { useNavigate } from "react-router-dom";

const RedSpan = styled.span`
  color: #ff2020;
`;
const BlueSpan = styled.span`
  color: #2094ff;
`;
function ReactTable({
  customTableStyle = "",
  tableHeader,
  tableBody,
  sorted,
  edited,
  pagination,
  trOnclick,
  trDbOnclicke,
  deleteRow,
  targetSelectData,
  primaryKey,
  crud,
}) {
  // Table Header
  const columns = React.useMemo(() => tableHeader, [tableHeader]);
  // const {onMove} = useAdmissionDetail()
  const navigate = useNavigate();
  const onMove = (id) => {
    localStorage.setItem("admissionId", id);
    if (id === "undefined") {
    } else {
      navigate("/stretcher/detail/" + id);
    }
  };
  // Table Body
  const data = React.useMemo(() => tableBody, [tableBody]);
  const { onClick } = useDoubleTap((e, id) => {
    onMove(id);
  }, 300);

  const {
    //공통
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    //Row
    rows,
    //Page
    page,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 1, pageSize: 2 },
    },
    sorted && useSortBy,
    pagination && usePagination
  );
  const hilighter = useRef(undefined);

  const [radioClick, setRadioClick] = useState();
  const highlighter = (e, test) => {
    /*        console.log(e.target.parentElement.childNodes[0].childNodes)
                setRadioClick(test);
                const test2= document.querySelector('#3345');
                console.log(test2)*/
    hilighter.current !== undefined &&
      hilighter.current.classList.remove("active");
    hilighter.current = e.currentTarget;
    hilighter.current.classList.add("active");
  };
  useEffect(() => {
    if (crud !== "U") {
      hilighter.current !== undefined &&
        hilighter.current.classList.remove("active");
    }
  }, [data, crud]);

  return (
    <>
      <table
        {...getTableProps()}
        className={
          customTableStyle
            ? customTableStyle
            : "table table-striped table-hover text-expert table-fixed"
        }
        style={{ height: "99%" }}
      >
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                // 정렬
                <th
                  className={column.styleClassName}
                  {...column.getHeaderProps()}
                >
                  {column.render("Header")}
                  {/* 정렬 UI */}
                  {sorted && column.sortedYn && (
                    <span>
                      {column.orderDiv === "" && (
                        <button
                          className="sort"
                          style={{ backgroundSize: "90%" }}
                          onClick={
                            column.sortedEvent
                              ? () => column.sortedEvent(column.id, "Asc")
                              : null
                          }
                        />
                      )}
                      {column.orderDiv === "Asc" &&
                        column.id === column.orderBy && (
                          <button
                            className="sort up"
                            style={{ backgroundSize: "90%" }}
                            onClick={
                              column.sortedEvent
                                ? () => column.sortedEvent(column.id, "Desc")
                                : null
                            }
                          />
                        )}
                      {column.orderDiv === "Desc" &&
                        column.id === column.orderBy && (
                          <button
                            className="sort down"
                            style={{ backgroundSize: "90%" }}
                            onClick={
                              column.sortedEvent
                                ? () => column.sortedEvent("", "")
                                : null
                            }
                          />
                        )}
                      {column.orderDiv !== "" &&
                        column.id !== column.orderBy && (
                          <button
                            className="sort"
                            style={{ backgroundSize: "90%" }}
                            onClick={
                              column.sortedEvent
                                ? () => column.sortedEvent(column.id, "Asc")
                                : null
                            }
                          />
                        )}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {pagination
            ? page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => {
                      return (
                        <td
                          className={cell.column.styleClassName}
                          {...cell.getCellProps()}
                        >
                          {cell.render("Cell")}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            : rows.map((row) => {
                prepareRow(row);
                return edited ? (
                  row.original.header !== undefined &&
                  row.original.header.includes("C") ? (
                    primaryKey === "comCd" ? (
                      //    Comcd 신규 Row
                      <tr
                        key={Object(row.original)[primaryKey]}
                        className={"checked-active"}
                      >
                        <td className="cd1">
                          <button
                            type="button"
                            role="deleteRow"
                            className="btn-delete"
                            onClick={() =>
                              deleteRow(row.original.header, primaryKey)
                            }
                          >
                            <BsX />
                          </button>
                        </td>
                        <td className="cd2">
                          {/*<input type="text" className="form-control text-center   "/>*/}
                        </td>
                        <td className="cd3">
                          <input
                            type="text"
                            className="form-control text-center"
                            autoFocus={true}
                            name={"comCdNm"}
                            onChange={(e) =>
                              row.cells[2].column.changeFunc(
                                e,
                                "comCdNm",
                                Object(row.original)[primaryKey],
                                primaryKey
                              )
                            }
                          />
                        </td>
                        <td className="cd4">
                          <select
                            className="form-select"
                            name={"comCdDiv"}
                            onChange={(e) =>
                              row.cells[3].column.changeFunc(
                                e,
                                "comCdDiv",
                                Object(row.original)[primaryKey],
                                primaryKey
                              )
                            }
                          >
                            <option value={""}>업무구분</option>
                            {targetSelectData &&
                              targetSelectData.map((value) => (
                                <option
                                  value={value.detailCd}
                                  key={value.detailCd}
                                >
                                  {value.detailCdNm}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td className="cd5">
                          <input
                            className="form-check-input use-check"
                            defaultChecked={true}
                            onChange={(e) =>
                              row.cells[4].column.changeFunc(
                                e,
                                "useYn",
                                Object(row.original)[primaryKey],
                                primaryKey
                              )
                            }
                            type="checkbox"
                          />
                        </td>
                        <td className="cd6">
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) =>
                              row.cells[5].column.changeFunc(
                                e,
                                "remark",
                                Object(row.original)[primaryKey],
                                primaryKey
                              )
                            }
                          />
                        </td>
                      </tr>
                    ) : (
                      //    ComcdDetail 신규 Row
                      <tr
                        key={Object(row.original)["header"]}
                        className={"checked-active"}
                      >
                        <td className="cd1">
                          <button
                            type="button"
                            role={"deleteRow"}
                            className="btn-delete"
                            onClick={() =>
                              deleteRow(row.original.header, primaryKey)
                            }
                          >
                            <BsX />
                          </button>
                        </td>
                        <td className="cd2">
                          <input
                            type="text"
                            className="form-control text-center"
                            autoFocus={true}
                            name={row.cells[1].column.id}
                            onChange={(e) =>
                              row.cells[1].column.changeFunc(
                                e,
                                "detailCd",
                                Object(row.original)[primaryKey],
                                primaryKey,
                                row.original.header
                              )
                            }
                          />
                        </td>
                        <td className="cd3">
                          <input
                            type="text"
                            className="form-control text-center"
                            name={row.cells[2].column.id}
                            onChange={(e) =>
                              row.cells[2].column.changeFunc(
                                e,
                                "detailCdNm",
                                Object(row.original)[primaryKey],
                                primaryKey,
                                row.original.header
                              )
                            }
                          />
                        </td>
                        <td className="cd4">
                          <input
                            type="checkbox"
                            defaultChecked={true}
                            className="form-check-input use-check"
                            onChange={(e) =>
                              row.cells[3].column.changeFunc(
                                e,
                                "useYn",
                                Object(row.original)[primaryKey],
                                primaryKey,
                                row.original.header
                              )
                            }
                          />
                        </td>
                        <td className="cd5">
                          <input
                            type="text"
                            className="form-control text-center"
                            onChange={(e) =>
                              row.cells[4].column.changeFunc(
                                e,
                                "property1",
                                Object(row.original)[primaryKey],
                                primaryKey,
                                row.original.header
                              )
                            }
                          />
                        </td>
                        <td className="cd6">
                          <input
                            type="text"
                            className="form-control text-center"
                            onChange={(e) =>
                              row.cells[5].column.changeFunc(
                                e,
                                "property2",
                                Object(row.original)[primaryKey],
                                primaryKey,
                                row.original.header
                              )
                            }
                          />
                        </td>
                        <td className="cd7">
                          <input
                            type="text"
                            className="form-control text-center"
                            onChange={(e) =>
                              row.cells[6].column.changeFunc(
                                e,
                                "property3",
                                Object(row.original)[primaryKey],
                                primaryKey,
                                row.original.header
                              )
                            }
                          />
                        </td>
                        <td className="cd8">
                          <input
                            type="text"
                            className="form-control text-center"
                            onChange={(e) =>
                              row.cells[7].column.changeFunc(
                                e,
                                "property4",
                                Object(row.original)[primaryKey],
                                primaryKey,
                                row.original.header
                              )
                            }
                          />
                        </td>
                        <td className="cd9">
                          <input
                            type="text"
                            className="form-control text-center"
                            onChange={(e) =>
                              row.cells[8].column.changeFunc(
                                e,
                                "property5",
                                Object(row.original)[primaryKey],
                                primaryKey,
                                row.original.header
                              )
                            }
                          />
                        </td>
                        <td className="cd10">
                          <input
                            type="text"
                            className="form-control"
                            onChange={(e) =>
                              row.cells[9].column.changeFunc(
                                e,
                                "remark",
                                Object(row.original)[primaryKey],
                                primaryKey,
                                row.original.header
                              )
                            }
                          />
                        </td>
                      </tr>
                    )
                  ) : (
                    <tr
                      {...row.getRowProps()}
                      onClick={
                        trOnclick
                          ? (e) => {
                              trOnclick(Object(row.values)[primaryKey]);
                              highlighter(e);
                            }
                          : (e) => highlighter(e)
                      }
                    >
                      {row.cells.map((cell) => {
                        return row.original.active ? (
                          <td
                            className={
                              cell.column.styleClassName + " checked-active"
                            }
                            {...cell.getCellProps()}
                          >
                            {/* checkbox 일 때*/}
                            {cell.column.editElement === "checkBox" && (
                              <input
                                className={
                                  "form-check-input checkbox-active " +
                                  cell.column.styleClassNameForBody
                                }
                                type="checkbox"
                                name={cell.column.id}
                                defaultChecked={
                                  cell.value === "Y" || row.original.active
                                }
                                onClick={
                                  cell.column.clickFunc
                                    ? (e) =>
                                        cell.column.clickFunc(
                                          e,
                                          Object(row.original)[primaryKey],
                                          primaryKey
                                        )
                                    : null
                                }
                                onChange={
                                  cell.column.changeFunc
                                    ? (e) =>
                                        cell.column.changeFunc(
                                          e,
                                          cell.column.id,
                                          Object(row.original)[primaryKey],
                                          primaryKey
                                        )
                                    : null
                                }
                              />
                            )}

                            {/* text 일 때*/}
                            {cell.column.editElement === "text" && (
                              <>
                                <div
                                  className={
                                    "checked-text " +
                                    cell.column.styleClassNameForBody
                                  }
                                >
                                  {cell.render("Cell")}
                                </div>
                                <div className={"checked-contents "}>
                                  <input
                                    type="text"
                                    className={
                                      "form-control " +
                                      cell.column.styleClassNameForBody
                                    }
                                    name={cell.column.id}
                                    defaultValue={cell.value}
                                    onChange={(e) =>
                                      cell.column.changeFunc(
                                        e,
                                        cell.column.id,
                                        Object(row.original)[primaryKey],
                                        primaryKey
                                      )
                                    }
                                    // cell.column.changeFunc(e,cell.column.id,row.original.comCd,row.original.comCd)}
                                  />
                                </div>
                              </>
                            )}

                            {/* select 일 때*/}
                            {cell.column.editElement === "select" && (
                              <select
                                className="form-select"
                                name={cell.column.id}
                                onChange={(e) =>
                                  cell.column.changeFunc(
                                    e,
                                    cell.column.id,
                                    Object(row.original)[primaryKey],
                                    primaryKey
                                  )
                                }
                              >
                                <option value={""}>업무구분</option>
                                {targetSelectData &&
                                  targetSelectData.map((value) => (
                                    <option
                                      value={value.detailCd}
                                      key={value.detailCd}
                                    >
                                      {value.detailCdNm}
                                    </option>
                                  ))}
                              </select>
                            )}

                            {cell.column.editElement === undefined && (
                              <>{cell.render("Cell")}</>
                            )}
                          </td>
                        ) : (
                          <td
                            className={cell.column.styleClassName}
                            {...cell.getCellProps()}
                          >
                            {/* checkbox 일 때*/}
                            {cell.column.editElement === "checkBox" && (
                              <input
                                className={
                                  "form-check-input checkbox-active " +
                                  cell.column.styleClassNameForBody
                                }
                                type="checkbox"
                                name={cell.column.id}
                                defaultChecked={cell.value === "Y"}
                                onClick={
                                  cell.column.clickFunc
                                    ? (e) =>
                                        cell.column.clickFunc(
                                          e,
                                          Object(row.original)[primaryKey],
                                          primaryKey
                                        )
                                    : null
                                }
                                disabled={
                                  cell.column.styleClassNameForBody && true
                                }
                              />
                            )}

                            {/* text 일 때*/}
                            {cell.column.editElement === "text" && (
                              <>
                                <div
                                  className={
                                    "checked-text " +
                                    cell.column.styleClassNameForBody
                                  }
                                >
                                  {cell.render("Cell")}
                                </div>
                                <div className={"checked-contents "}>
                                  <input
                                    type="text"
                                    className={
                                      "form-control " +
                                      cell.column.styleClassNameForBody
                                    }
                                    defaultValue={cell.value}
                                    name={cell.column.id}
                                    onChange={(e) =>
                                      cell.column.changeFunc(
                                        e,
                                        cell.column.id,
                                        Object(row.original)[primaryKey],
                                        primaryKey
                                      )
                                    }
                                  />
                                </div>
                              </>
                            )}

                            {/* select 일 때*/}
                            {cell.column.editElement === "select" && (
                              <select
                                className="form-select"
                                name={cell.column.id}
                                value={cell.value}
                                disabled
                              >
                                <option value={""}>업무구분</option>
                                {targetSelectData &&
                                  targetSelectData.map((value) => (
                                    <option
                                      value={value.detailCd}
                                      key={value.detailCd}
                                    >
                                      {value.detailCdNm}
                                    </option>
                                  ))}
                              </select>
                            )}
                            {cell.column.editElement === undefined && (
                              <>{cell.render("Cell")}</>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  )
                ) : (
                  <tr
                    {...row.getRowProps()}
                    onClick={
                      trOnclick
                        ? (e) => {
                            onClick(e, row.original.admissionId);
                            trOnclick(row.cells[0].value, row.original);
                            highlighter(e, row.cells[0].value);
                          }
                        : (e) => {
                            onClick(e, row.original.admissionId);
                            highlighter(e, row.cells[0].value);
                          }
                    }
                    onDoubleClick={
                      trDbOnclicke
                        ? (e) => {
                            onMove(row.original.admissionId);
                          }
                        : null
                    }
                  >
                    {row.cells.map((cell) => {
                      if (cell.column.Header === "선택") {
                        if (cell.column.editElement === "radio") {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <input
                                className="form-check-input"
                                type="radio"
                                name="lcenter"
                                onClick={() => {
                                  cell.column.editEvent(row.values, "select");
                                }}
                              />
                            </td>
                          );
                        } else {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                onClick={(e) => {
                                  e.target.checked
                                    ? cell.column.editEvent(row.values, "add")
                                    : cell.column.editEvent(
                                        row.values,
                                        "except"
                                      );
                                }}
                              />
                            </td>
                          );
                        }
                      } else {
                        if (cell.column.editElement === "radio") {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <input
                                className="form-check-input"
                                name="userCenters"
                                type="radio"
                                checked={cell.value === "Y"}
                                onChange={
                                  cell.column.editEvent
                                    ? () => {
                                        cell.column.editEvent(
                                          cell.row.values.centerId
                                        );
                                      }
                                    : null
                                }
                              />
                            </td>
                          );
                        } else if (cell.column.editElement === "checkbox") {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={cell.row.values.delYn || false}
                                onChange={
                                  cell.column.editEvent
                                    ? () => {
                                        cell.column.editEvent(
                                          cell.row.values.centerId
                                        );
                                      }
                                    : null
                                }
                              />
                            </td>
                          );
                        } else if (
                          cell.column.editElement === "AdmissionButton" ||
                          cell.column.id === "qantnStatus"
                        ) {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              {/*<button type="button" className={cell.value === '1'? "btn btn-exit" : "btn btn-exit-done"} onClick={row.original}>{cell.value === '1' ? '재원중' : '퇴실'}</button>*/}
                              <span
                                className={
                                  // cell.value === "1"
                                  // ? "btn btn-exit"
                                  // : "btn btn-exit-done"
                                  cell.value === "1" ? "text-primary" : ""
                                }
                              >
                                {cell.column.editElementType !== "Isolation"
                                  ? cell.value === "1"
                                    ? "재원중"
                                    : "퇴소"
                                  : null}
                                {cell.column.editElementType === "Isolation"
                                  ? cell.value === "1"
                                    ? "격리중"
                                    : "격리해제"
                                  : null}
                              </span>
                            </td>
                          );
                        } else if (cell.column.editElement === "updateButton") {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              {cell.value !== "N" && (
                                <button
                                  type="button"
                                  className="btn btn-exit"
                                  onClick={() =>
                                    cell.column.editEvent(
                                      row.original.admissionId,
                                      "U"
                                    )
                                  }
                                  /* onClick={cell.column.editEvent((Object(row.values)[primaryKey]),'U')
                                                                        }*/
                                >
                                  수정
                                </button>
                              )}
                            </td>
                          );
                        } else if (cell.column.editElement === "aiExeButton") {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              {cell.value !== "N" && (
                                <button
                                  type="button"
                                  className={
                                    cell.value === "X"
                                      ? "btn btn-exit"
                                      : "btn btn-exit-done"
                                  }
                                  onClick={
                                    cell.column.editEvent && cell.value !== "N"
                                      ? () => {
                                          cell.column.editEvent(
                                            row.original.admissionId
                                          );
                                        }
                                      : null
                                  }
                                >
                                  {cell.column.editElementType !== "Isolation"
                                    ? cell.value === "O"
                                      ? "추론결과"
                                      : "추론결과"
                                    : null}
                                  {cell.column.editElementType === "Isolation"
                                    ? cell.value === "O"
                                      ? "추론결과"
                                      : "추론결과"
                                    : null}
                                </button>
                              )}
                            </td>
                          );
                        } else if (cell.column.id === "bp") {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              {/* SBP */}
                              {row.original.sbpRiskGb === "H" ? (
                                <RedSpan>{row.original.sbpResult}</RedSpan>
                              ) : row.original.sbpRiskGb === "L" ? (
                                <BlueSpan>{row.original.sbpResult}</BlueSpan>
                              ) : (
                                <span>{row.original.sbpResult}</span>
                              )}
                              {(row.original.dbpResult ||
                                row.original.sbpResult) && <span> / </span>}
                              {/* DBP */}
                              {row.original.dbpRiskGb === "H" ? (
                                <RedSpan>{row.original.dbpResult}</RedSpan>
                              ) : row.original.dbpRiskGb === "L" ? (
                                <BlueSpan>{row.original.dbpResult}</BlueSpan>
                              ) : (
                                <span>{row.original.dbpResult}</span>
                              )}
                            </td>
                          );
                        } else if (cell.column.id === "prResult") {
                          return row.original.prRiskGb === "H" ? (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <RedSpan>{cell.render("Cell")}</RedSpan>
                            </td>
                          ) : row.original.prRiskGb === "L" ? (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <BlueSpan>{cell.render("Cell")}</BlueSpan>
                            </td>
                          ) : (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <span>{cell.render("Cell")}</span>
                            </td>
                          );
                        } else if (cell.column.id === "btResult") {
                          /* else if(cell.column.id === 'admissionId'){
                                                    return <td>
                                                        <input type="radio" name="check" id="3345"
                                                               defaultChecked={cell.render('Cell') && cell.render('Cell') === radioClick && radioClick }
                                                               onClick={(e)=> clickee(e)}
                                                        />
                                                        <label htmlFor={cell.render('Cell')}>{radioClick && radioClick} {cell.render('Cell')}</label>
                                                    </td>
                                                }*/
                          return row.original.btRiskGb === "H" ? (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <RedSpan>{cell.render("Cell")}</RedSpan>
                            </td>
                          ) : row.original.btRiskGb === "L" ? (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <BlueSpan>{cell.render("Cell")}</BlueSpan>
                            </td>
                          ) : (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <span>{cell.render("Cell")}</span>
                            </td>
                          );
                        } else if (cell.column.id === "spResult") {
                          return row.original.spRiskGb === "H" ? (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <RedSpan>{cell.render("Cell")}</RedSpan>
                            </td>
                          ) : row.original.spRiskGb === "L" ? (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <BlueSpan>{cell.render("Cell")}</BlueSpan>
                            </td>
                          ) : (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <span>{cell.render("Cell")}</span>
                            </td>
                          );
                        } else if (cell.column.id === "rrResult") {
                          return row.original.rrRiskGb === "H" ? (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <RedSpan>{cell.render("Cell")}</RedSpan>
                            </td>
                          ) : row.original.rrRiskGb === "L" ? (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <BlueSpan>{cell.render("Cell")}</BlueSpan>
                            </td>
                          ) : (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              <span>{cell.render("Cell")}</span>
                            </td>
                          );
                        } else if (cell.column.id === "replyYn") {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              {cell.value === "Y" ? (
                                <BsCheckLg
                                  color={"green"}
                                  role={"replyCheckIcon"}
                                />
                              ) : null}
                            </td>
                          );
                        } else {
                          return (
                            <td
                              className={cell.column.styleClassName}
                              {...cell.getCellProps()}
                            >
                              {cell.render("Cell")}
                            </td>
                          );
                        }
                      }
                    })}
                  </tr>
                );
              })}
        </tbody>
      </table>
      {/*        Pagination*/}
      {pagination && (
        <nav className="mt-4">
          <ul className="pagination">
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Previous">
                <span aria-hidden="true">
                  <CgChevronLeft />
                </span>
              </a>
            </li>
            <li className="page-item active" aria-current="page">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                4
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                5
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#" aria-label="Next">
                <span aria-hidden="true">
                  <CgChevronRight />
                </span>
              </a>
            </li>
          </ul>
        </nav>
      )}

      {/*        Pagination*/}
    </>
  );
}

// customTableStyle=null,tableHeader, tableBody, sorted, edited, pagination, trOnclick, trDbOnclicke, deleteRow ,targetSelectData, primaryKey
ReactTable.defaultProps = {
  customTableStyle: "",
  tableBody: [],
  sorted: false,
  edited: false,
  pagination: false,
  trOnclick: null,
  trDbOnclicke: null,
  deleteRow: null,
  targetSelectData: null,
  primaryKey: "",
};
ReactTable.propTypes = {
  tableHeader: PropTypes.array.isRequired,
  tableBody: PropTypes.array,
  sorted: PropTypes.bool,
  edited: PropTypes.bool,
  pagination: PropTypes.bool,
  trOnclick: PropTypes.func,
  trDbOnclicke: PropTypes.func,
  deleteRow: PropTypes.func,
  targetSelectData: PropTypes.array,
  primaryKey: PropTypes.string,
};
export default ReactTable;
