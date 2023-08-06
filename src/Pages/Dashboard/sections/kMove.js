function kMove(km, kyi, dataLen, divList, listattr, text, select=false, activeClr='#f5f3ba', baseClr='whitesmoke'){
	//let scrollpos = 0;
	//let scrollval = 5;
    var visibleelements = [] ;
    var listelements = divList['children'];
    var wdglen = listelements.length;

    for (let i = 0; i < listelements.length; i++) {
          if (listelements[i].style.display===''){
            listelements[i].style.backgroundColor = baseClr;
            visibleelements.push(listelements[i])
              }
            }
    
    if (km==='down'){
        
        if (Object.entries(visibleelements).length > 0) {
            
          if (visibleelements[kyi] === undefined ){
            kyi=0;
            //scrollpos = 0;
            
            visibleelements[kyi].style.backgroundColor = activeClr;
           
            }
          else {
            if (visibleelements[kyi-1] !== undefined ){
            	visibleelements[kyi-1].style.backgroundColor = baseClr;
                visibleelements[kyi].style.backgroundColor = activeClr;
                }
            else{
               visibleelements[kyi].style.backgroundColor = activeClr;
                }
            }
            
            if (kyi>dataLen){
            	kyi = dataLen;
            	
            }
            //else{
            //	scrollpos += scrollval;  
            //	//kyi = kyi+1;  
            //}
        } 

    } 
    
    else if (km==='up'){
      
      for (let i = 0; i < visibleelements.length; i++) {
        visibleelements[i].style.backgroundColor = baseClr;
            }
      if (Object.entries(visibleelements).length > 0){ 
        
        if (kyi < 0){kyi=0;visibleelements[kyi].style.backgroundColor = activeClr;}
        else if (visibleelements.length===0){kyi=0;return true;}
        else if (visibleelements[kyi] === undefined ){kyi=0; return true;} 
             else { 
                 //scrollpos -= scrollval;
                 kyi-- ; 
                 if (wdglen < 0){
                    kyi = 0;
                    //scrollpos = 0;
                    }
                 else {
                    try{
                        visibleelements[kyi].style.backgroundColor = activeClr;
                        }
                    catch(err){
                    	kyi = 0;
                        visibleelements[0].style.backgroundColor = activeClr;
                       
                        }
                    }       
                  }
                }
               
              
              }

    
    }

export default kMove;