import { useState } from "react"; 

// 팝업 열림 유무
export default function useAlertPopup() {
  const [showAlert, setShowAlert] = useState(false); // showAlert가 true면 팝업 열림 false면 팝업 닫힘

  const openAlert = () => setShowAlert(true); // 팝업 열림
  const closeAlert = () => setShowAlert(false); // 팝업 닫힘

  return { showAlert, openAlert, closeAlert }; 
}