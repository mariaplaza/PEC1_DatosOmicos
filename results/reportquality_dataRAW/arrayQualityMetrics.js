// (C) Wolfgang Huber 2010-2011

// Script parameters - these are set up by R in the function 'writeReport' when copying the 
//   template for this script from arrayQualityMetrics/inst/scripts into the report.

var highlightInitial = [ false, false, true, true, false, false, true, false, true, false, false, false, false, false, false, false, false, false, false, true, false, true ];
var arrayMetadata    = [ [ "1", "GSM3587187_QP-4180216_1_A05.CEL.gz", "1", "2016-02-19T03:58:59Z" ], [ "2", "GSM3587188_QP-49180216_1_H05.CEL.gz", "2", "2016-02-19T04:58:20Z" ], [ "3", "GSM3587189_QP-501902162_A05.CEL.gz", "3", "2016-02-20T02:49:30Z" ], [ "4", "GSM3587190_QP-76180216_1_F07.CEL.gz", "4", "2016-02-19T04:38:44Z" ], [ "5", "GSM3587191_QP-77180216_1_H07.CEL.gz", "5", "2016-02-19T04:54:26Z" ], [ "6", "GSM3587192_QP-781902162_C05.CEL.gz", "6", "2016-02-20T03:05:46Z" ], [ "7", "GSM3587193_QP-791902162_E05.CEL.gz", "7", "2016-02-20T03:21:31Z" ], [ "8", "GSM3587194_QP-801902162_G05.CEL.gz", "8", "2016-02-20T03:37:16Z" ], [ "9", "GSM3587195_QP-811902162_A07.CEL.gz", "9", "2016-02-20T02:53:59Z" ], [ "10", "GSM3587196_QP-921902162_C07.CEL.gz", "10", "2016-02-20T03:09:43Z" ], [ "11", "GSM3587197_QP-931902162_E07.CEL.gz", "11", "2016-02-20T03:25:24Z" ], [ "12", "GSM3587198_QP-941902162_G07.CEL.gz", "12", "2016-02-20T03:41:11Z" ], [ "13", "GSM3587199_QP-82180216_1_E07.CEL.gz", "13", "2016-02-19T04:34:47Z" ], [ "14", "GSM3587200_QP-83180216_1_G07.CEL.gz", "14", "2016-02-19T04:50:29Z" ], [ "15", "GSM3587201_QP-841902162_B05.CEL.gz", "15", "2016-02-20T03:01:51Z" ], [ "16", "GSM3587202_QP-851902162_D05.CEL.gz", "16", "2016-02-20T03:17:35Z" ], [ "17", "GSM3587203_QP-861902162_F05.CEL.gz", "17", "2016-02-20T03:33:18Z" ], [ "18", "GSM3587204_QP-871902162_H05.CEL.gz", "18", "2016-02-20T03:49:02Z" ], [ "19", "GSM3587205_QP-881902162_B07.CEL.gz", "19", "2016-02-20T02:57:56Z" ], [ "20", "GSM3587206_QP-891902162_D07.CEL.gz", "20", "2016-02-20T03:13:39Z" ], [ "21", "GSM3587207_QP-901902162_F07.CEL.gz", "21", "2016-02-20T03:29:20Z" ], [ "22", "GSM3587208_QP-911902162_H07.CEL.gz", "22", "2016-02-20T03:45:08Z" ] ];
var svgObjectNames   = [ "pca", "dens", "dig" ];

var cssText = ["stroke-width:1; stroke-opacity:0.4",
               "stroke-width:3; stroke-opacity:1" ];

// Global variables - these are set up below by 'reportinit'
var tables;             // array of all the associated ('tooltips') tables on the page
var checkboxes;         // the checkboxes
var ssrules;


function reportinit() 
{
 
    var a, i, status;

    /*--------find checkboxes and set them to start values------*/
    checkboxes = document.getElementsByName("ReportObjectCheckBoxes");
    if(checkboxes.length != highlightInitial.length)
	throw new Error("checkboxes.length=" + checkboxes.length + "  !=  "
                        + " highlightInitial.length="+ highlightInitial.length);
    
    /*--------find associated tables and cache their locations------*/
    tables = new Array(svgObjectNames.length);
    for(i=0; i<tables.length; i++) 
    {
        tables[i] = safeGetElementById("Tab:"+svgObjectNames[i]);
    }

    /*------- style sheet rules ---------*/
    var ss = document.styleSheets[0];
    ssrules = ss.cssRules ? ss.cssRules : ss.rules; 

    /*------- checkboxes[a] is (expected to be) of class HTMLInputElement ---*/
    for(a=0; a<checkboxes.length; a++)
    {
	checkboxes[a].checked = highlightInitial[a];
        status = checkboxes[a].checked; 
        setReportObj(a+1, status, false);
    }

}


function safeGetElementById(id)
{
    res = document.getElementById(id);
    if(res == null)
        throw new Error("Id '"+ id + "' not found.");
    return(res)
}

/*------------------------------------------------------------
   Highlighting of Report Objects 
 ---------------------------------------------------------------*/
function setReportObj(reportObjId, status, doTable)
{
    var i, j, plotObjIds, selector;

    if(doTable) {
	for(i=0; i<svgObjectNames.length; i++) {
	    showTipTable(i, reportObjId);
	} 
    }

    /* This works in Chrome 10, ssrules will be null; we use getElementsByClassName and loop over them */
    if(ssrules == null) {
	elements = document.getElementsByClassName("aqm" + reportObjId); 
	for(i=0; i<elements.length; i++) {
	    elements[i].style.cssText = cssText[0+status];
	}
    } else {
    /* This works in Firefox 4 */
    for(i=0; i<ssrules.length; i++) {
        if (ssrules[i].selectorText == (".aqm" + reportObjId)) {
		ssrules[i].style.cssText = cssText[0+status];
		break;
	    }
	}
    }

}

/*------------------------------------------------------------
   Display of the Metadata Table
  ------------------------------------------------------------*/
function showTipTable(tableIndex, reportObjId)
{
    var rows = tables[tableIndex].rows;
    var a = reportObjId - 1;

    if(rows.length != arrayMetadata[a].length)
	throw new Error("rows.length=" + rows.length+"  !=  arrayMetadata[array].length=" + arrayMetadata[a].length);

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = arrayMetadata[a][i];
}

function hideTipTable(tableIndex)
{
    var rows = tables[tableIndex].rows;

    for(i=0; i<rows.length; i++) 
 	rows[i].cells[1].innerHTML = "";
}


/*------------------------------------------------------------
  From module 'name' (e.g. 'density'), find numeric index in the 
  'svgObjectNames' array.
  ------------------------------------------------------------*/
function getIndexFromName(name) 
{
    var i;
    for(i=0; i<svgObjectNames.length; i++)
        if(svgObjectNames[i] == name)
	    return i;

    throw new Error("Did not find '" + name + "'.");
}


/*------------------------------------------------------------
  SVG plot object callbacks
  ------------------------------------------------------------*/
function plotObjRespond(what, reportObjId, name)
{

    var a, i, status;

    switch(what) {
    case "show":
	i = getIndexFromName(name);
	showTipTable(i, reportObjId);
	break;
    case "hide":
	i = getIndexFromName(name);
	hideTipTable(i);
	break;
    case "click":
        a = reportObjId - 1;
	status = !checkboxes[a].checked;
	checkboxes[a].checked = status;
	setReportObj(reportObjId, status, true);
	break;
    default:
	throw new Error("Invalid 'what': "+what)
    }
}

/*------------------------------------------------------------
  checkboxes 'onchange' event
------------------------------------------------------------*/
function checkboxEvent(reportObjId)
{
    var a = reportObjId - 1;
    var status = checkboxes[a].checked;
    setReportObj(reportObjId, status, true);
}


/*------------------------------------------------------------
  toggle visibility
------------------------------------------------------------*/
function toggle(id){
  var head = safeGetElementById(id + "-h");
  var body = safeGetElementById(id + "-b");
  var hdtxt = head.innerHTML;
  var dsp;
  switch(body.style.display){
    case 'none':
      dsp = 'block';
      hdtxt = '-' + hdtxt.substr(1);
      break;
    case 'block':
      dsp = 'none';
      hdtxt = '+' + hdtxt.substr(1);
      break;
  }  
  body.style.display = dsp;
  head.innerHTML = hdtxt;
}
