function _delete_dom_obj( id_name ){

    var dom_obj=document.getElementById(id_name);
    var dom_obj_parent=dom_obj.parentNode;

    alert('ID: '+dom_obj.getAttribute('id')+' を削除します');
    dom_obj_parent.removeChild(dom_obj);
}