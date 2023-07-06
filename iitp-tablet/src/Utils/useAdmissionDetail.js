import {useNavigate} from "react-router-dom";

const useMoveAdmissionDetail = () =>{
    const navigate = useNavigate();
    const onMove = (id)=>{
        localStorage.setItem('admissionId',id);
        if (id === 'undefined') {
        }else{
            navigate('/admission/detail')
        }
    }
    return {onMove}
}

export default useMoveAdmissionDetail;