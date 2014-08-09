/**
 * Created by U_I_Hunter on 7/26/14.
 */
function getboundingboxforline(line,tip,LorH,thickmargin,mode){
    var sx1 = line.getAttribute("x1");
    var sy1 = line.getAttribute("y1");
    var sx2 = line.getAttribute("x2");
    var sy2 = line.getAttribute("y2");
    var offset = 0;
    if (mode == "formetersplit"){
        offset = +meteroffset+ +7;
    }
    if (+sx1==+sx2 && +tip==0){
        return {x1:+sx1- +thickmargin+ +offset,y1:Math.min(+sy1,+sy2),x2:+sx1+ +thickmargin+ +offset,y2:Math.max(+sy1,+sy2)};
    }else if(+sy1==+sy2 && +tip==0){
        return {x1:Math.min(+sx1,+sx2),y1:+sy1- +thickmargin- +offset,x2:Math.max(+sx1,+sx2),y2:+sy1+ +thickmargin- +offset};
    }else if (+sx1==+sx2 && +tip!=0 && LorH=="h"){
        return {x1:+sx1- +thickmargin+ +offset,y1:+Math.max(+sy1,+sy2)- +tip,x2:+sx1+ +thickmargin+ +offset,y2:Math.max(+sy1,+sy2)};
    }else if (+sx1==+sx2 && +tip!=0 && LorH=="l"){
        return {x1:+sx1- +thickmargin+ +offset,y1:Math.min(+sy1,+sy2),x2:+sx1+ +thickmargin+ +offset,y2:+Math.min(+sy1,+sy2)+ +tip};
    }else if(+sy1==+sy2 && +tip!=0 && LorH=="h"){
        return {x1:+Math.max(+sx1,+sx2)- +tip,y1:+sy1- +thickmargin- +offset,x2:Math.max(+sx1,+sx2),y2:+sy1+ +thickmargin- +offset};
    }else if(+sy1==+sy2 && +tip!=0 && LorH=="l"){
        return {x1:Math.min(+sx1,+sx2),y1:+sy1- +thickmargin- +offset,x2:+Math.min(+sx1,+sx2)+ +tip,y2:+sy1+ +thickmargin- +offset};
    }else if(+sx1==+sx2 && +tip!=0 && LorH=="lh"){
        return {x1:+sx1- +thickmargin+ +offset,y1:+Math.min(+sy1,+sy2)- +tip,x2:+sx1+ +thickmargin+ +offset,y2:Math.max(+sy1,+sy2)+ +tip};
    }else if(+sy1==+sy2 && +tip!=0 && LorH=="lh"){
        return {x1:Math.min(+sx1,+sx2)- +tip,y1:+sy1- +thickmargin- +offset,x2:+Math.max(+sx1,+sx2)+ +tip,y2:+sy1+ +thickmargin- +offset};
    }
}

function checktwoRectCollide(s1,s2){         //return true if collision happens
    //console.log(s1.x1+" "+s1.y1+" "+s1.x2+" "+s1.y2+", "+s2.x1+" "+s2.y1+" "+s2.x2+" "+s2.y2);
    return !(((s2.x1<=s1.x1)&&(s2.x2<=s1.x1)) || ((s2.y1<=s1.y1)&&(s2.y2<=s1.y1)) ||
        ((s2.x1>=s1.x2)&&(s2.x2>=s1.x2)) || ((s2.y1>=s1.y2)&&(s2.y2>=s1.y2)));
}

function checkpointsinbox(p,b){
    return (p.x>=b.x1) && (p.x<=b.x2) && (p.y>=b.y1) && (p.y<=b.y2);
}