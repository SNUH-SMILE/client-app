import React, {useEffect, useRef, useState} from 'react';
import UseSetPageTitle from "../../Utils/UseSetPageTitle";
import ItemApi from "../../Apis/ItemApi";
import ReactTable from "../../component/ReactTable";
import useAlert from "../../Utils/UseAlert";

function Item() {

    const {confirm, alert} = useAlert();

    // 헤더에 페이지 타이틀 설정
    UseSetPageTitle('측정항목 관리');

    const itemId = useRef();
    const itemNm = useRef();
    const unit = useRef();
    const refFrom = useRef();
    const refTo = useRef();

    const searchItemId = useRef();
    const searchItemNm = useRef();

    const [val, setVal] = useState({'refFrom':'', 'refTo':''});

    const [crud, setCrud] = useState('')
    // 측정항목 관리 API
    const itemApi = new ItemApi(itemId, itemNm, unit, refFrom, refTo, searchItemId, searchItemNm);

    const itemTableColumns = [
        {
            Header: '측정항목ID',
            accessor: 'itemId',
            styleClassName: 'mid'
        },
        {
            Header: '측정항목명',
            accessor: 'itemNm',
            styleClassName: 'mname'
        },
        {
            Header: '단위',
            accessor: 'unit',
            styleClassName: 'munit'
        },
        {
            Header: '참고치-From',
            accessor: 'refFrom',
            styleClassName: 'mfrom'
        },
        {
            Header: '참고치-To',
            accessor: 'refTo',
            styleClassName: 'mto'
        },
    ];

    // 측정항목 리스트 데이터
    const [itemList, setItemList] = useState([]);

    // Mount 시 생활치료센터 리스트 요청
    useEffect(() => {
        getItemList();
    }, []);

    // 검색 Input Enter 이벤트
    const handledOnSearch = (e) => {
        if (e.keyCode === 13) {
            getItemList();
        } else if (e.keyCode === 27) {
            e.target.value = null;
        }
    };

    // 측정항목 리스트 요청
    const getItemList = () => {
        clearItemDetail(false);
        itemApi.getItemList().then(({data}) => {
            if (data.code === '00') {
                setItemList(data.result);
            } else {
                alert(data.message);
            }
        });
        setCrud('G');
    };

    // 측정항목 상세정보 요청
    const getItemInfo = (searchItemId) => {
        itemApi.getItemInfo(searchItemId).then(({data}) => {
            clearItemDetail(false);

            if (data.code === '00') {
                setItemInfo(data.result);
            } else {
                alert(data.message)
            }
        });
    };

    // 측정항목 상세정보 바인딩
    const setItemInfo = (data) => {
        itemId.current.value = data.itemId;
        itemNm.current.value = data.itemNm;
        unit.current.value = data.unit;
        setVal({'refFrom': data.refFrom, 'refTo': data.refTo});
    };

    // 상세정보 초기화
    const clearItemDetail = (isNew) => {
        itemId.current.value = null;
        itemNm.current.value = null;
        unit.current.value = null;
        setVal({'refFrom': '', 'refTo': ''});

        if (isNew) {
            itemNm.current.focus();
            crud==='S' ? setCrud('C') : setCrud('S')
        }
    };

    // 저장
    const saveItem = async () => {
        if (!itemNm.current.value) {
            alert('측정항목 명칭이 누락되었습니다.');
            itemNm.current.focus();
        } else if (!unit.current.value) {
            alert('측정항목 단위가 누락되었습니다.');
            unit.current.focus();
            // } else if (!refFrom.current.value) {
        } else if (!parseInt(refFrom.current.value)) {
            alert('참고치가 누락되었습니다.');
            refFrom.current.focus();
            // } else if (!refTo.current.value) {
        } else if (!parseInt(refTo.current.value)) {
            alert('참고치가 누락되었습니다.');
            refTo.current.focus();
        } else {
            // 신규/수정 여부
            const isNewData = !itemId.current.value;
            const confirmMsg = isNewData ?
                `[${itemNm.current.value}]-신규 측정항목을 추가하시겠습니까?` :
                `[${itemNm.current.value}]-해당 측정항목을 수정하시겠습니까?`;
            const confirmStatus = await confirm(confirmMsg);
            if(confirmStatus){
                isNewData ? createItem() : updateItem();
            }
        }
    };

    // 측정항목 신규 추가
    const createItem = () => {
        itemApi.createItem().then(({data}) => {
            if (data.code === "00") {
                alert('저장 되었습니다.');

                console.log('Completed::createItem');
                console.log(data);

                clearItemDetail(false);
                setItemInfo(data.result.data);
                setItemList(data.result.list);

            } else {
                alert(data.message);
            }
        }).catch((e) => {
            console.log('[ERROR]-Item.jsx createItem', e);
        });
    };

    // 측정항목 수정
    const updateItem = () => {
        itemApi.updateItem().then(({data}) => {
            if (data.code === "00") {
                alert('수정 되었습니다.');

                console.log('Completed::updateItem');
                console.log(data);

                clearItemDetail(false);
                setItemInfo(data.result.data);
                setItemList(data.result.list);

            } else {
                alert(data.message);
            }
        }).catch((e) => {
            console.log('[ERROR]-Item.jsx updateItem', e);
        });
        setCrud('U')
    };

    // 삭제
    const deleteItem = async () => {
        if (!itemId.current.value) {
            alert('선택된 측정항목이 없습니다.');
        } else {
            const confirmStatus = await confirm(`[${itemNm.current.value}]-선택한 측정항목을 삭제하시겠습니까?`);
            if(confirmStatus){
                itemApi.deleteItem().then(({data}) => {
                    if (data.code === "00") {
                        alert('삭제 되었습니다.');
                        clearItemDetail(false);
                        setItemList(data.result);

                    } else {
                        alert(data.message);
                    }
                }).catch((e) => {
                    console.log('[ERROR]-Item.jsx updateItem', e);
                });
            }
        }
    };


    // 참고치 입력 값 확인
    const handleChange = (e) => {
        const inputVal = e.nativeEvent.data;
        if (inputVal && !/[-, 0-9]/.test(inputVal)) {
            return;
        }

        let {name, value} = e.target;

        if (value !== '-' && isNaN(Number(value))) {
            return;
        } else if (value > 32767 || value < -32768) {
            return;
        }

        value = value.trim() === '' || value.trim() === '-' ? value.trim() : parseInt(value.trim());

        setVal({...val, [name]: value } );
    };

    return (
        <main className="flex_layout_2col">
            <div className="row">
                <div className="col col-lg-8">
                    <div className="card indiv">
                        <div className="card-content">
                            <div className="table-responsive">
                                <div className="table-header">
                                    <form>
                                        <div className="d-flex clear">
                                            <div className="tbl_title">측정항목 리스트</div>
                                            <div className="me-3 d-flex">
                                                <span className="stit">측정항목ID</span>
                                                <input className="form-control w120"
                                                       type="text"
                                                       defaultValue={''}
                                                       maxLength="5"
                                                       role={'searchItemId'}
                                                       ref={searchItemId}
                                                       onKeyUp={ (e) => handledOnSearch(e) }
                                                />
                                            </div>
                                            <div className="me-1 d-flex">
                                                <span className="stit">측정항목명</span>
                                                <input className="form-control w120"
                                                       type="text"
                                                       defaultValue={''}
                                                       maxLength="50"
                                                       ref={searchItemNm}
                                                       onKeyUp={ (e) => handledOnSearch(e) }
                                                />
                                            </div>
                                            <div className="ms-auto btn_wrap">
                                                <button type="button" className="btn btn-gray" onClick={getItemList}>검색</button>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="table-body height100">
                                    <ReactTable tableHeader={itemTableColumns} tableBody={itemList} trOnclick={getItemInfo} crud={crud}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col col-lg-4 wd100-mt20">
                    <div className="card indiv">
                        <form>
                            <div className="card-content">
                                <div className="table-responsive">
                                    <div className="table-header">
                                        <div className="d-flex">
                                            <div className="tbl_title nobar">상세정보</div>
                                            <div className="ms-auto">
                                                <div className="btn_wrap d-flex">
                                                    <button type="button"
                                                            className="btn btn-wgray"
                                                            onClick={deleteItem}>삭제</button>
                                                    <button type="button"
                                                            className="btn btn-white btn-new"
                                                            onClick={() => clearItemDetail(true)}>신규</button>
                                                    <button type="button"
                                                            className="btn btn-ccolor"
                                                            onClick={saveItem}>저장</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table-body">
                                        <table className="table table-borderless mt-3 text-import">
                                            <tbody>
                                            <tr>
                                                <th>측정항목ID</th>
                                                <td className="mid">
                                                    <input className="form-control w-100"
                                                           type="text"
                                                           defaultValue={''}
                                                           role={'detailItemID'}
                                                           ref={itemId}
                                                           readOnly
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>측정항목 명칭</th>
                                                <td className="mname">
                                                    <input className="form-control w-100"
                                                           type="text"
                                                           defaultValue={''}
                                                           role={'detailItemNM'}
                                                           maxLength="50"
                                                           ref={itemNm}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>측정항목 단위</th>
                                                <td className="munit">
                                                    <input className="form-control w-100"
                                                           type="text"
                                                           defaultValue={''}
                                                           role={'detailItemUnit'}
                                                           maxLength="20"
                                                           ref={unit}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>참고치-From</th>
                                                <td className="mfrom">
                                                    <input className="form-control w-100"
                                                           name="refFrom"
                                                           type="text"
                                                           ref={refFrom}
                                                           role={'detailItemRF'}
                                                           value={val.refFrom}
                                                           onChange={ (e) => handleChange(e)}
                                                    />
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>참고치-To</th>
                                                <td className="mto">
                                                    <input className="form-control w-100"
                                                           name="refTo"
                                                           type="text"
                                                           ref={refTo}
                                                           role={'detailItemRT'}
                                                           value={val.refTo}
                                                           onChange={ (e) => handleChange(e)}
                                                    />
                                                </td>
                                            </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Item;