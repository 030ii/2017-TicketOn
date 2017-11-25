function blankcheck(el,msg){
 if(el.value==""){
  alert(msg+"를(을) 입력해주세요.");
  el.focus();
  return true;
 }
}

function dosubmit(){
  if(blankcheck(register_fm.id,'아이디')) {
    return;
   }
  if(blankcheck(register_fm.password,'비밀번호')) {
    return;
   }

  login_fm.submit();
}
