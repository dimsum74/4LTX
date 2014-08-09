/**
 * Created by U_I_Hunter on 7/26/14.
 */

function lineautodetection(mouse, lineclass, margin, linehalfthickcor, mode){
    var x1, x2, y1, y2;
    var lineclassls = document.getElementsByClassName(lineclass);
    var thislinels = document.getElementsByClassName("thisline");
    var offset = 0;
    if (mode === "precise"){
        offset = linehalfthickcor;
    }

    helper(lineclassls, offset);
    helper(thislinels, offset);

    function helper(linels, adjustment) {
        for (var i = 0; i < linels.length; ++i) {
            x1 = linels[i].getAttribute('x1');
            x2 = linels[i].getAttribute('x2');
            y1 = linels[i].getAttribute('y1');
            y2 = linels[i].getAttribute('y2');
            if (!dedrawingflag && checkpointsinbox(mouse, getboundingboxforline(linels[i], 0, 0, linehalfthickcor))) {
//                console.log("set " + i);
                linels[i].setAttribute('id', "thechosenline");
            } else if (!dedrawingflag && linels[i].getAttribute('id') == "thechosenline") {
                linels[i].setAttribute('id', x1 + " " + y1 + " " + x2 + " " + y2);
            }
            if (document.getElementById('thechosenline') === null) {
                if (linels[i].getAttribute('name') === "vertical") {
                    if (mouse.y < +y2 + +linehalfthickcor + +margin && mouse.y > y2 - margin) {
                        mouse.y = +y2 + +linehalfthickcor-adjustment;
                    } else if (mouse.y < +y1 + +margin && mouse.y > y1 - linehalfthickcor - margin) {
                        mouse.y = y1 - linehalfthickcor+ +adjustment;
                    }
                } else if (linels[i].getAttribute('name') === "horizontal") {
                    if (mouse.x < +x2 + +linehalfthickcor + +margin && mouse.x > x2 - margin) {
                        mouse.x = +x2 + +linehalfthickcor-adjustment;
                    } else if (mouse.x < +x1 + +margin && mouse.x > x1 - linehalfthickcor - margin) {
                        mouse.x = x1 - linehalfthickcor+ +adjustment;
                    }
                }
            }
        }
    }
    return mouse;
}

function makealignment(mouse){
    var x1, x2, y1, y2;
    var line;
    var container = document.getElementById("plates");
    var newlineV = document.createElementNS("http://www.w3.org/2000/svg",'line');
    newlineV.setAttribute('class',"alignment");
    var newlineH = document.createElementNS("http://www.w3.org/2000/svg",'line');
    newlineH.setAttribute('class',"alignment");

    newlineV.setAttribute('id',"alignV");
    newlineV.setAttribute('x1',mouse.x);
    newlineV.setAttribute('y1',"0");
    newlineV.setAttribute('x2',mouse.x);
    newlineV.setAttribute('y2',document.getElementById("DesignPlot").getAttribute('height').replace("px",""));

    newlineH.setAttribute('id',"alignH");
    newlineH.setAttribute('y1',mouse.y);
    newlineH.setAttribute('x1',"0");
    newlineH.setAttribute('y2',mouse.y);
    newlineH.setAttribute('x2',document.getElementById("DesignPlot").getAttribute('width').replace("px",""));

    container.appendChild(newlineV);
    container.appendChild(newlineH);
}

function deletealignment(){
    var container = document.getElementById("plates");
    var lineV = document.getElementById("alignV");
    if (lineV != null){
        container.removeChild(lineV);
    }
    var lineH = document.getElementById("alignH");
    if (lineH != null){
        container.removeChild(lineH);
    }
}




function updatealignment(mouse,mode){
    var newlineV = document.getElementById('alignV');
    if (newlineV == null){
        return;
    }
    newlineV.setAttribute('x1',mouse.x);
    newlineV.setAttribute('x2',mouse.x);
    var newlineH = document.getElementById('alignH');
    newlineH.setAttribute('y1',mouse.y);
    newlineH.setAttribute('y2',mouse.y);
    var x1, x2, y1, y2, cx, cy;
    var meterlinels = document.getElementsByClassName('metersline');
    var container, meter, meterline, meterd1, meterd2, lineid, frame, fx, fy;
    var newmetersplit, newmeterlinesplit, newdeliminator1split, newdeliminator2split;
    var originmeter, originmeterline, originmeterd1, originmeterd2;
    for (var i=0;i<meterlinels.length;++i){
        x1 = meterlinels[i].getAttribute('x1');
        x2 = meterlinels[i].getAttribute('x2');
        y1 = meterlinels[i].getAttribute('y1');
        y2 = meterlinels[i].getAttribute('y2');
        //console.log("parent: "+meterlinels[i]+" "+meterlinels.length);
        container = meterlinels[i].parentNode;
        meter = container.getElementsByClassName('meters')[0];
        meterd1 = container.getElementsByClassName('deliminator')[0];
        meterd2 = container.getElementsByClassName('deliminator')[1];
        if (meterlinels[i].getAttribute('direction') === "vertical") {
            if (checktwoRectCollide(getboundingboxforline(meterlinels[i],0,0,0),getboundingboxforline(newlineH,0,0,0))){
                cy = newlineH.getAttribute('y1');
                container = meterlinels[i].parentNode;
                frame = meterlinels[i].parentNode.childNodes[0];
                lineid = frame.getAttribute('x1')+" "+frame.getAttribute('y1')+" "+frame.getAttribute('x2')+" "+frame.getAttribute('y2');
                fx = frame.getAttribute('x1');
                //get the origin ID
                newmeterlinesplit = document.getElementById(lineid+" demo-l-meterline");
                if (newmeterlinesplit == null){
                    createmeters("l","vertical");
                    originmeterline = meterlinels[i];
                    originmeter = document.getElementById(meterlinels[i].getAttribute('id').replace("meterline","meter"));
                    originmeterd1 = document.getElementById(meterlinels[i].getAttribute('id').replace("meterline","deliminator1"));
                    originmeterd2 = document.getElementById(meterlinels[i].getAttribute('id').replace("meterline","deliminator2"));
                    meterlinels[i].setAttribute('originid',meterlinels[i].getAttribute('id'));
                    meterlinels[i].setAttribute('id',lineid+" demo-r-meterline");
                    originmeter.setAttribute('id',lineid+" demo-r-meter");
                    originmeterd1.setAttribute('id',lineid+" demo-r-deliminator1");
                    originmeterd2.setAttribute('id',lineid+" demo-r-deliminator2");
                    originmeterline.setAttribute('fixedy2',y2);
                    newmeterlinesplit.setAttribute('fixedy1',y1);
                } else {
                    newdeliminator1split = document.getElementById(lineid+" demo-l-deliminator1");
                    newdeliminator2split = document.getElementById(lineid+" demo-l-deliminator2");
                    newmetersplit = document.getElementById(lineid+" demo-l-meter");
                    originmeterline = document.getElementById(lineid+" demo-r-meterline");
                    originmeter = document.getElementById(lineid+" demo-r-meter");
                    originmeterd1 = document.getElementById(lineid+" demo-r-deliminator1");
                    originmeterd2 = document.getElementById(lineid+" demo-r-deliminator2");
                }
                updatemeters(newmetersplit,newmeterlinesplit,newdeliminator1split,newdeliminator2split,fx,fx,newmeterlinesplit.getAttribute('fixedy1'),Math.max(+cy,cy-halfthickcor));
                updatemeters(originmeter,originmeterline,originmeterd1,originmeterd2,fx,fx,
                    Math.min(+cy,+cy+ +halfthickcor),originmeterline.getAttribute('fixedy2'));
            }else {
                cy = newlineH.getAttribute('y1');
                container = meterlinels[i].parentNode;
                frame = meterlinels[i].parentNode.childNodes[0];
                lineid = frame.getAttribute('x1')+" "+frame.getAttribute('y1')+" "+frame.getAttribute('x2')+" "+frame.getAttribute('y2');
                newmeterlinesplit = document.getElementById(lineid+" demo-l-meterline");
                originmeterline = document.getElementById(lineid+" demo-r-meterline");
                if (newmeterlinesplit != null &&
                    ( mouse.y<=newmeterlinesplit.getAttribute('fixedy1') || mouse.y>=originmeterline.getAttribute('fixedy2') )
                    ){
//                    console.log(newmeterlinesplit.getAttribute('fixedx1')+" "+originmeterline.getAttribute('fixedx2') );
                    mergetwometers(newmeterlinesplit,originmeterline);
                }
            }


        } else if (meterlinels[i].getAttribute('direction') === "horizontal") {
            if (checktwoRectCollide(getboundingboxforline(meterlinels[i],0,0,0),getboundingboxforline(newlineV,0,0,0))){
                cx = newlineV.getAttribute('x1');
                container = meterlinels[i].parentNode;
                frame = meterlinels[i].parentNode.childNodes[0];
                lineid = frame.getAttribute('x1')+" "+frame.getAttribute('y1')+" "+frame.getAttribute('x2')+" "+frame.getAttribute('y2');
                fy = frame.getAttribute('y1');
                //get the origin ID
                newmeterlinesplit = document.getElementById(lineid+" demo-l-meterline");
                if (newmeterlinesplit == null){
                    createmeters("l","horizontal");
                    originmeterline = meterlinels[i];
                    originmeter = document.getElementById(meterlinels[i].getAttribute('id').replace("meterline","meter"));
                    originmeterd1 = document.getElementById(meterlinels[i].getAttribute('id').replace("meterline","deliminator1"));
                    originmeterd2 = document.getElementById(meterlinels[i].getAttribute('id').replace("meterline","deliminator2"));
                    meterlinels[i].setAttribute('originid',meterlinels[i].getAttribute('id'));
                    meterlinels[i].setAttribute('id',lineid+" demo-r-meterline");
                    originmeter.setAttribute('id',lineid+" demo-r-meter");
                    originmeterd1.setAttribute('id',lineid+" demo-r-deliminator1");
                    originmeterd2.setAttribute('id',lineid+" demo-r-deliminator2");
                    originmeterline.setAttribute('fixedx2',x2);
                    newmeterlinesplit.setAttribute('fixedx1',x1);
                } else {
                    newdeliminator1split = document.getElementById(lineid+" demo-l-deliminator1");
                    newdeliminator2split = document.getElementById(lineid+" demo-l-deliminator2");
                    newmetersplit = document.getElementById(lineid+" demo-l-meter");
                    originmeterline = document.getElementById(lineid+" demo-r-meterline");
                    originmeter = document.getElementById(lineid+" demo-r-meter");
                    originmeterd1 = document.getElementById(lineid+" demo-r-deliminator1");
                    originmeterd2 = document.getElementById(lineid+" demo-r-deliminator2");
                }
                updatemeters(newmetersplit,newmeterlinesplit,newdeliminator1split,newdeliminator2split,newmeterlinesplit.getAttribute('fixedx1'),Math.max(+cx,cx-halfthickcor),fy,fy);
                updatemeters(originmeter,originmeterline,originmeterd1,originmeterd2,Math.min(+cx,+cx+ +halfthickcor),
                    originmeterline.getAttribute('fixedx2'),fy,fy);
            }else {
                cx = newlineV.getAttribute('x1');
                container = meterlinels[i].parentNode;
                frame = meterlinels[i].parentNode.childNodes[0];
                lineid = frame.getAttribute('x1')+" "+frame.getAttribute('y1')+" "+frame.getAttribute('x2')+" "+frame.getAttribute('y2');
                newmeterlinesplit = document.getElementById(lineid+" demo-l-meterline");
                originmeterline = document.getElementById(lineid+" demo-r-meterline");
                if (newmeterlinesplit != null &&
                    ( mouse.x<=newmeterlinesplit.getAttribute('fixedx1') || mouse.x>=originmeterline.getAttribute('fixedx2') )
                    ){
//                    console.log(newmeterlinesplit.getAttribute('fixedx1')+" "+originmeterline.getAttribute('fixedx2') );
                    mergetwometers(newmeterlinesplit,originmeterline);
                }
            }
        }
    }
    function createmeters(LorR,direction){
        newmeterlinesplit = document.createElementNS("http://www.w3.org/2000/svg",'line');
        newmeterlinesplit.setAttribute('class',"metersline");
        newmeterlinesplit.setAttribute('direction',direction);
        newmeterlinesplit.setAttribute('id',lineid+" demo-"+LorR+"-meterline");
        container.appendChild(newmeterlinesplit);
        newdeliminator1split = document.createElementNS("http://www.w3.org/2000/svg",'line');
        newdeliminator2split = document.createElementNS("http://www.w3.org/2000/svg",'line');
        newdeliminator1split.setAttribute('class',"deliminator");
        newdeliminator1split.setAttribute('id',lineid+" demo-"+LorR+"-deliminator1");
        newdeliminator2split.setAttribute('class',"deliminator");
        newdeliminator2split.setAttribute('id',lineid+" demo-"+LorR+"-deliminator2");
        container.appendChild(newdeliminator1split);
        container.appendChild(newdeliminator2split);
        newmetersplit = document.createElementNS("http://www.w3.org/2000/svg",'text');
        newmetersplit.setAttribute('id',lineid+" demo-"+LorR+"-meter");
        newmetersplit.setAttribute('class',"meters");
        container.appendChild(newmetersplit);
    }
}

function mergetwometers(meterline,originline){
    var originid = originline.getAttribute('originid');
    var container = originline.parentNode;
    var frame = originline.parentNode.childNodes[0];
    var x1 = frame.getAttribute('x1');
    var y1 = frame.getAttribute('y1');
    var x2 = frame.getAttribute('x2');
    var y2 = frame.getAttribute('y2');
    if (originline.getAttribute('direction') == "horizontal"){
        x1 = meterline.getAttribute('x1');
        x2 = originline.getAttribute('x2');
    }else{
        y1 = meterline.getAttribute('y1');
        y2 = originline.getAttribute('y2');
    }
    container.removeChild(document.getElementById(meterline.getAttribute('id').replace("meterline","meter")));
    container.removeChild(document.getElementById(meterline.getAttribute('id').replace("meterline","deliminator1")));
    container.removeChild(document.getElementById(meterline.getAttribute('id').replace("meterline","deliminator2")));
    container.removeChild(meterline);
    var originmeter = document.getElementById(originline.getAttribute('id').replace("meterline","meter"));
    var origind1 = document.getElementById(originline.getAttribute('id').replace("meterline","deliminator1"));
    var origind2 = document.getElementById(originline.getAttribute('id').replace("meterline","deliminator2"));
    originmeter.setAttribute('id',originid.replace("meterline","meter"));
    origind1.setAttribute('id',originid.replace("meterline","deliminator1"));
    origind2.setAttribute('id',originid.replace("meterline","deliminator2"));
    originline.setAttribute('id',originid);
    updatemeters(originmeter,originline,origind1,origind2,x1,x2,y1,y2);
}




function updatemeters(meter, meterline, d1, d2, linex1, linex2, liney1, liney2){
    var x1 = linex1;
    var y1 = liney1;
    var x2 = linex2;
    var y2 = liney2;
    var x, y, l, length;
    y=y1;
    x=x1;
    if (y1<y2){
        l = (y2-y1)/2;
        length = Math.abs(l);
        y = +y1 + +l;
    }else if (y2<y1){
        l = (y1-y2)/2;
        length = Math.abs(l);
        y = +y2 + +l;
    }
    if (x1<x2){
        l = (x2-x1)/2;
        length = Math.abs(l);
        x = +x1 + +l;
    }else if (x2<x1){
        l = (x1-x2)/2;
        length = Math.abs(l);
        x = +x2 + +l;
    }
    if (x1 == x2){
        meterline.setAttribute('x1',x1-meteroffset-7);
        meterline.setAttribute('y1',y1);
        meterline.setAttribute('x2',x1-meteroffset-7);
        meterline.setAttribute('y2',y2);
        meter.setAttribute('x',x1-meteroffset);
        meter.setAttribute('y',y);
        meter.setAttribute('style',"writing-mode: tb;");
        meter.textContent = (2*length/scale).toFixed(1);
        if (d1 != undefined) {
            d1.setAttribute('x1',x1-1.3*(+meteroffset+ +7));
            d1.setAttribute('y1', y1);
            d1.setAttribute('x2', x1);
            d1.setAttribute('y2', y1);
        }
        if (d2 != undefined) {
            d2.setAttribute('x1', x1 - 1.3 * (+meteroffset + +7));
            d2.setAttribute('y1', y2);
            d2.setAttribute('x2', x1);
            d2.setAttribute('y2', y2);
        }
    }else if (y1 == y2){
        meterline.setAttribute('x1',x1);
        meterline.setAttribute('y1',+y1+ +meteroffset + 7);
        meterline.setAttribute('x2',x2);
        meterline.setAttribute('y2',+y2+ +meteroffset + 7);
        meter.setAttribute('y',+y1+ +meteroffset + 4);
        meter.setAttribute('x',x);
        meter.setAttribute('style',"writing-mode: lr;");
        meter.textContent = (2*length/scale).toFixed(1);
        if (d1 != undefined) {
            d1.setAttribute('x1', x1);
            d1.setAttribute('y1', +y1 + 1.3 * (+meteroffset + +7));
            d1.setAttribute('x2', x1);
            d1.setAttribute('y2', y1);
        }
        if (d2 != undefined) {
            d2.setAttribute('x1', x2);
            d2.setAttribute('y1', +y2 + 1.3 * (+meteroffset + +7));
            d2.setAttribute('x2', x2);
            d2.setAttribute('y2', y2);
        }
    }
}