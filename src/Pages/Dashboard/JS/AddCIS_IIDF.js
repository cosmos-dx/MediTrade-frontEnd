function iidf (whichpage){
    let iidf = {"0":{"in":true,"value":"","labelid":"0info","id":"name","idf":"db_name","ph":"Add Customer-Name","mxl":"100",
         "listattr":"list-name","info":"","cssearch":"","url":"","db_data":{},"req":true,},
       "1":{"in":true,"value":"Bill By Bill","labelid":"1info","id":"mode","idf":"dd_mode","ph":"Transaction Type","mxl":"100",
         "listattr":"","info":"","dd":['Bill By Bill','On Account'],"db_data":{},"req":false,},
       "2":{"in":true,"value":"","labelid":"2info","id":"add1","idf":"si_add1","ph":"Address 1","mxl":"100",
       "listattr":"","info":"","db_data":{},"req":true,},
       "3":{"in":true,"value":"","labelid":"3info","id":"add2","idf":"si_add2","ph":"Address 2","mxl":"100",
       "listattr":"","info":"","db_data":{},"req":false,},
       "4":{"in":true,"value":"","labelid":"4info","id":"add3","idf":"si_stcode","ph":"State Code","mxl":"18",
       "listattr":"","info":"","db_data":{},"req":true,},
       "5":{"in":true,"value":"","labelid":"5info","id":"pincode","idf":"si_pincode","ph":"PIN Code","mxl":"6",
       "listattr":"","info":"","db_data":{},"req":false,},
       "6":{"in":true,"value":"","labelid":"6info","id":"area","idf":"db_area","ph":"Location Area","mxl":"18",
       "listattr":"list-area","info":"","cssearch":"","url":"","db_data":{},"req":true,},
       "7":{"in":true,"value":"","labelid":"7info","id":"mobile","idf":"si_phone","ph":"Contact Number","mxl":"10",
         "listattr":"","info":"","db_data":{},"req":true,},
       "8":{"in":true,"value":"","labelid":"8info","id":"email","idf":"si_email","ph":"email Address","mxl":"100",
         "listattr":"","info":"","db_data":{},"req":false,},
       "9":{"in":true,"value":"","labelid":"9info","id":"ophone","idf":"si_offphone","ph":"Office Contact","mxl":"10",
         "listattr":"","info":"","db_data":{},"req":false,},
       "10":{"in":true,"value":"","labelid":"10info","id":"pan","idf":"si_pan","ph":"PAN","mxl":"10",
         "listattr":"","info":"","db_data":{},"req":false,},
       "11":{"in":true,"value":"","labelid":"11info","id":"bal","idf":"si_obal","ph":"Opening Balance","mxl":"8",
         "listattr":"","info":"","db_data":{},"req":false,},
       "12":{"in":true,"value":"","labelid":"12info","id":"regn","idf":"si_regn","ph":"Registeration No","mxl":"30",
         "listattr":"","info":"","db_data":{},"req":false,},
       "13":{"in":true,"value":"","labelid":"13info","id":"gstn","idf":"si_gstn","ph":"GST Number","mxl":"15",
         "listattr":"","info":"","db_data":{},"req":false,},
       "14":{"in":true,"value":"","labelid":"14info","id":"cmnt","idf":"si_cmnt","ph":"Composition-Tax-Payer [Y=YES; N=NO]","mxl":"1",
         "listattr":"","info":"","db_data":{},"req":false,},
       }

 if( whichPage =="item"){
   rscr["cs"]="suppliers";
   rscr["cssearch"]="supplier";
   rscr["pagename"]="ADD-ITEM";
   iidf = {"0":{"in":true,"value":"","labelid":"0info","id":"name","idf":"db_name","ph":"Item-Name","mxl":"100",
       "listattr":"list-name","info":"","cssearch":"items","url":"http://localhost:80/itemsearchenter?","db_data":{},"req":true,},
       "1":{"in":true,"value":"TAB","labelid":"1info","id":"unit","idf":"dd_unit","ph":"Item-Unit","mxl":"10","listattr":"","info":"",
           "dd":['TAB','CAP','VIAL','BOTT','DROP','PCS','OINT','CREAM'],"db_data":{},"req":true,},
       "2":{"in":true,"value":"","labelid":"3info","id":"pack","idf":"si_pack","ph":"Item-Pack","mxl":"10",
         "listattr":"","info":"","db_data":{},"req":true,},
       "3":{"in":true,"value":"","labelid":"3info","id":"igroup","idf":"db_igroup","ph":"Item-Composition","mxl":"500",
         "listattr":"list-igroup","info":"","cssearch":"items_igroup","url":"http://localhost:80/addtodb?","db_data":{},"req":false,},
       "4":{"in":true,"value":"","labelid":"4info","id":"irack","idf":"db_irack","ph":"Item-Rack Name","mxl":"25","listattr":"list-irack","info":"",
            "cssearch":"items_irack","url":"http://localhost:80/addtodb?","db_data":{},"req":false,},
       "5":{"in":true,"value":"","labelid":"5info","id":"comp","idf":"db_comp","ph":"Item-Manufecturer","mxl":"25","listattr":"list-comp","info":"",
          "cssearch":"comp","url":"http://localhost:80/addtodb?","db_data":{},"req":true,},
       "6":{"in":true,"value":"","labelid":"6info","id":"prate","idf":"si_prate","ph":"Purchase Rate","mxl":"10",
         "listattr":"","info":"","db_data":{},"req":true,},
       "7":{"in":true,"value":"","labelid":"7info","id":"srate","idf":"si_srate","ph":"Sale Rate","mxl":"10",
         "listattr":"","info":"","db_data":{},"req":true,},
       "8":{"in":true,"value":"","labelid":"8info","id":"mrp","idf":"si_mrp","ph":"M.R.P","mxl":"10",
         "listattr":"","info":"","db_data":{},"req":true,},
       "9":{"in":true,"value":"","labelid":"9info","id":"gst","idf":"si_gst","ph":"IGST","mxl":"4",
         "listattr":"","info":"","db_data":{},"req":true,},
       "10":{"in":true,"value":"","labelid":"10info","id":"cgst","idf":"si_cgst","ph":"CGST","mxl":"4",
         "listattr":"","info":"","db_data":{},"req":true,},
       "11":{"in":true,"value":"","labelid":"11info","id":"sgst","idf":"si_sgst","ph":"SGST","mxl":"4",
         "listattr":"","info":"","db_data":{},"req":true,},
       "12":{"in":true,"value":"","labelid":"12info","id":"hsn","idf":"db_hsn","ph":"HSN Code","mxl":"8",
         "listattr":"list-hsn","info":"","cssearch":"hsn","url":"http://localhost:80/addtodb?","db_data":{},"req":true,},
       "13":{"in":true,"value":"","labelid":"13info","id":"sup","idf":"db_sup","ph":"Item-Supplier Name","mxl":"100",
         "listattr":"list-sup","info":"","cssearch":"sup","url":"http://localhost:80/addtodb?","db_data":{},"req":true,},
       "14":{"in":true,"value":"","labelid":"14info","id":"cmnt","idf":"si_cmnt","ph":"Comment and Notes","mxl":"20",
         "listattr":"","info":"","db_data":{},"req":false,},
       }
 }
 else if(whichPage=="supplier"){
   rscr["cs"]="suppliers";
   rscr["cssearch"]="supplier";
   rscr["pagename"]="ADD-SUPPLIER";
   iidf["0"]["ph"]="Add Supplier-Name";
   iidf["0"]["cssearch"]="supplier";
   iidf["0"]["url"]="http://localhost:80/partysearchenter?";
   iidf["6"]["cssearch"]="supplier_area";
   iidf["6"]["url"]="http://localhost:80/addtodb?";

   
 }
 else{
   rscr["cs"]="customer";
   rscr["cssearch"]="customer";
   rscr["pagename"]="ADD-CUSTOMER";
   iidf["0"]["ph"]="Add Customer-Name";
   iidf["0"]["cssearch"]="customer";
   iidf["0"]["url"]="http://localhost:80/partysearchenter?";
   iidf["6"]["cssearch"]="customer_area";
   iidf["6"]["url"]="http://localhost:80/addtodb?";
   
 }
 return iidf;
}