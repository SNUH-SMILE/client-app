import React, { useEffect, useRef } from "react";
function InterviewList({ interviewData, idx, type }) {
  const refref = useRef();
  const contentValues = [
    "val01",
    "val02",
    "val03",
    "val04",
    "val05",
    "val06",
    "val07",
    "val08",
    "val09",
    "val10",
    "val11",
    "val12",
  ]; // 최대 문항 갯수는 총 11개
  const contentValuesPlus = [
    "34-2",
    "34-3",
    "34-4",
    "34-5",
    "34-6",
    "34-7",
    "34-8",
    "34-9",
    "34-10",
  ]; //1~5점으로 산정된 문항
  return (
    <div className="interview">
      <div className="interviewHeader">
        <div className="hBox">
          <h4>{interviewData.interviewTitlePlus}</h4>
          {/* - (<h4>{interviewData.interviewTitle}</h4>) */}
        </div>
        <div>
          등록일:
          {interviewData.interviewDD.substring(0, 4) +
            "-" +
            interviewData.interviewDD.substring(4, 6) +
            "-" +
            interviewData.interviewDD.substring(6, 8)}
        </div>
      </div>
      <table>
        <tbody>
          {Object.values(interviewData.interviewContents)
            .filter((i) => i.interCategori.substring(0, 1) == type)
            .map((content, i) => (
              <>
                <tr style={{ fontSize: "14px" }}>
                  <td>{content.interNo}.</td>
                  <td>{content.interContent}</td>
                </tr>
                <tr style={{ fontSize: "9px" }}>
                  {/*type에 따라 inputbox(13), radio(10), checkbox(11)로 표현*/}

                  {content.interType == "13" ? (
                    <td colSpan="2">
                      <input
                        type="text"
                        className="form-control"
                        defaultValue={content.answerValue || null}
                        readOnly
                      ></input>
                    </td>
                  ) : content.interType == "10" ? (
                    <td colSpan="2">
                      {contentValues.map((name, idx) => (
                        <>
                          {/*라디오버튼으로 생성시 체크가 안되는 버그 존재*/}
                          {content[name] && (
                            <input
                              type="checkbox"
                              id={content.interseq + idx.toString()}
                              checked={
                                content.answerValue &&
                                contentValuesPlus.filter(
                                  (i) => i == content.interNo
                                ).length > 0
                                  ? content.answerValue == idx + 1
                                  : content.answerValue == idx
                              }
                              className="form-check-input"
                              readOnly
                            />
                          )}
                          {content[name] && (
                            <label className="form-check-label">
                              {" "}
                              {content[name]}
                            </label>
                          )}
                        </>
                      ))}
                    </td>
                  ) : (
                    <td colSpan="2">
                      {contentValues.map((name, idx) => (
                        <>
                          {content[name] && (
                            <input
                              type="checkbox"
                              id={content.interseq + idx.toString()}
                              checked={
                                content.answerValue &&
                                content.answerValue
                                  .split(",")
                                  .filter((i) => i == idx).length > 0
                              }
                              className="form-check-input"
                              readOnly
                            />
                          )}
                          {content[name] && (
                            <label className="form-check-label">
                              {" "}
                              {content[name]}
                            </label>
                          )}
                        </>
                      ))}
                    </td>
                  )}
                </tr>
              </>
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default InterviewList;
