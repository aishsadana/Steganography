var mainImg=null;
var hideImg=null;
var resultImg=null;
var modifiedImg=null;
var hiddenImg=null;
function upload(can,inpVal,inpD){
  var can=document.getElementById(can);
  var inp=document.getElementById(inpVal);
  var img=new SimpleImage(inp);
  switch(inpVal){
    case "main_inp":
      mainImg=new SimpleImage(inp);
      break;
    case "hide_inp":
      hideImg=new SimpleImage(inp);
      if(mainImg==null||!mainImg.complete()){
        alert("Main Image not loaded");
        return;
      }
      break;
    case "modified_inp":
      modifiedImg=new SimpleImage(inp);
  }
  img.drawTo(can);
  var result=img.getWidth()+" x "+img.getHeight();
  var dim=document.getElementById(inpD);
  dim.innerHTML=result;
}
function chopBits(num){
    return Math.floor(num/16)*16;
}
function getRem(num){
    return Math.floor(num%16)*16;
}
function chopToHide(img){
    for(var p of img.values()){
        p.setRed(chopBits(p.getRed()));
        p.setGreen(chopBits(p.getGreen()));
        p.setBlue(chopBits(p.getBlue()));
    }
    return img;
}
function shift(img){
    for(var p of img.values()){
        p.setRed(p.getRed()>>4);
        p.setGreen(p.getGreen()>>4);
        p.setBlue(p.getBlue()>>4);
    }
    return img;
}
function combine(main,hide){
    for(var p of hide.values()){
        var px=main.getPixel(p.getX(),p.getY());
        px.setRed(p.getRed()+px.getRed());
        px.setGreen(p.getGreen()+px.getGreen());
        px.setBlue(p.getBlue()+px.getBlue());
    }
    return main;
}
function extract(img,hidden){
    for(var p of img.values()){
        var x=p.getX();
        var y=p.getY();
        var px=hidden.getPixel(x,y);
        px.setRed(getRem(p.getRed()));
        px.setGreen(getRem(p.getGreen()));
        px.setBlue(getRem(p.getBlue()));
    }
    return hidden;
}
function generate(){
  if(mainImg==null||!mainImg.complete()){
    alert("Main Image not loaded");
    return;
  }
  if(hideImg==null||!hideImg.complete()){
    alert("Image to hide not loaded");
    return;
  }
  if(hideImg.getWidth()>mainImg.getWidth()||hideImg.getHeight()>mainImg.getHeight()){
     alert("Image to hide must be smaller than main image");
     return;
  }
  mainImg=chopToHide(mainImg);
  hideImg=shift(hideImg);
  mainImg=combine(mainImg,hideImg);
  var can=document.getElementById("can3");
  mainImg.drawTo(can);
}
function extractImg(){
  if(modifiedImg==null||!modifiedImg.complete()){
    alert("Modified Image not loaded");
    return;
  }
  hiddenImg=new SimpleImage(modifiedImg.getWidth(),modifiedImg.getHeight());
  hiddenImg=extract(modifiedImg,hiddenImg);
  var can=document.getElementById("can5");
  hiddenImg.drawTo(can);
}