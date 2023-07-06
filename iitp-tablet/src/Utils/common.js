const getToday= () =>{
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth()+1) < 10 ? '0'+(today.getMonth()+1):(today.getMonth()+1)
    const day = today.getDate() < 10 ?'0'+today.getDate():today.getDate()
    return year + '-' + month + '-' + day;
}
export const getTomorrow= () =>{
    const today = new Date()
    const year = today.getFullYear()
    const month = (today.getMonth()+1) < 10 ? '0'+(today.getMonth()+1):(today.getMonth()+1)
    const day = (today.getDate()+1) < 10 ?'0'+(today.getDate()+1):today.getDate()+1
    return year + '-' + month + '-' + day+' ';
}

export const convertDate = (date) => date.replace(/(\d{4})(\d{2})(\d{2})/g, '$1-$2-$3')


export default getToday