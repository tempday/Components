function validPwd(s) {
    var e = /^[\w]{6,}$/;
    if ("password" == s.type) return "reconfirm" == s.id ? s.value === DM("#password")[0].value && e.test(s.value) ? (DM(".userInfo").sub(DM.index(s) + 1).removeClass("display"), 
    !0) : (DM(".userInfo").sub(DM.index(s) + 1).addClass("display"), !1) : e.test(s.value) ? (DM(".userInfo").sub(DM.index(s) + 1).removeClass("display"), 
    !0) : (DM(".userInfo").sub(DM.index(s) + 1).addClass("display"), !1);
}