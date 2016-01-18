/* public/script.js */

(function(){

  var socket = io();

  var loc = document.location.pathname;
  loc = loc.substring(1);
  
  var cont = '';

  cont = (loc == '')?'home':loc;
  
  var groupkeypress,groupkeyup;

  groupkeypress = 'key pressed';
  groupkeyup = 'copy selection';

  if(loc == '') {
      groupkeypress = 'key pressesd';
      groupkeyup = 'copy selection';
  } 
  else {
      groupkeypress  = 'key pressed'+loc;
      groupkeyup = 'copy selection'+loc;
  }  


  
  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
 

 
  sharejs.open(cont, 'text',function(error, doc) {
       doc.attach_ace(editor);
  });  


  var pos;
  
  $('#layer').keypress(function(event){
      event.stopImmediatePropagation();
      pos = editor.selection.getCursor();
      socket.emit('key pressed',{val:pos,cat:groupkeypress});
  
  });
     
 
  var mousedownpos;

  $('#layer').mousedown(function(event){
        event.stopImmediatePropagation();
        var rng = editor.selection.getRange();
        mousedownpos = editor.selection.getCursor();
   });


  var mouseuppos,direction,rng;

  $('#layer').click(function(event){
      event.stopImmediatePropagation();
      rng = editor.selection.getRange();
      mouseuppos = editor.selection.getCursor();
      direction = true;
      if((mouseuppos.row > mousedownpos.row)||((mouseuppos.row == mousedownpos.row)&&(mouseuppos.column >= mousedownpos.column))) {
           direction = false;
      }  
      socket.emit('copy selection',{range:rng,position: mouseuppos,Id:groupkeyup,alignment:direction});
  });


  $('#btn').click(function(event){
      event.stopImmediatePropagation();
      socket.emit('new editor',"");
  });


  socket.on(groupkeypress, function(msg){
      editor.moveCursorToPosition(msg.val);
  });


  socket.on(groupkeyup,function(msg){
      editor.selection.setSelectionRange(msg.range,msg.alignment);
  });
   

  socket.on('new editor',function(msg){
      window.open('http://localhost:3000/'+msg);
  });  

})();
