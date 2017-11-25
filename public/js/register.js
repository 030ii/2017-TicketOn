function blankcheck(el,msg){
 if(el.value==""){
  alert(msg+"를(을) 입력해주세요.");
  el.focus();
  return true;
 }
}
function dosubmit(){
  if(blankcheck(register_fm.name,'이름')) {
    return;
   }
  if(blankcheck(register_fm.id,'아이디')) {
    return;
   }
  if(blankcheck(register_fm.password,'비밀번호')) {
    return;
   }
  if(blankcheck(register_fm.passwordch,'비밀번호확인')) {
    return;
   }
  if(blankcheck(register_fm.tel,'전화번호')) {
    return;
   }
  if(password.value != passwordch.value){
    password.value = "";
    passwordch.value = "";
    alert('비밀번호가 일치하지않습니다.');

    return true;
  }




  register_fm.submit();

}
