function blankcheck(el,msg){
 if(el.value==""){
  alert(msg+"를(을) 입력해주세요.");
  el.focus();
  return true;
 }
}
function dosubmit(){
  if(blankcheck(register_fm.u_name,'이름')) {
    return;
   }
  if(blankcheck(register_fm.u_id,'아이디')) {
    return;
   }
  if(blankcheck(register_fm.u_password,'비밀번호')) {
    return;
   }
  if(blankcheck(register_fm.u_passwordch,'비밀번호확인')) {
    return;
   }
  if(blankcheck(register_fm.u_email,'이메일')) {
    return;
   }
  if(blankcheck(register_fm.u_tel,'전화번호')) {
    return;
   }
  if(u_password.value != u_passwordch.value){
    u_password.value = "";
    u_passwordch.value = "";
    alert('비밀번호가 일치하지않습니다.');

    return true;
  }




  register_fm.submit();

}
