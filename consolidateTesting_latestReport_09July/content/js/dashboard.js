/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5535294117647059, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.25, 500, 1500, "/rest/s1/landmark/timezoneGroup-32"], "isController": false}, {"data": [0.49, 500, 1500, "/vq82m7smjr84ngsp-285"], "isController": false}, {"data": [0.56, 500, 1500, "*/counter2.cgi-143"], "isController": false}, {"data": [0.625, 500, 1500, "/rest/s1/landmark/locale-35"], "isController": false}, {"data": [0.0, 500, 1500, "/rest/s1/landmark/customer/101841-81"], "isController": false}, {"data": [0.375, 500, 1500, "/rest/s1/landmark/locale-37"], "isController": false}, {"data": [0.99, 500, 1500, "/xoplatform/logger/api/logger-287"], "isController": false}, {"data": [0.0, 500, 1500, "/rest/s1/landmark/categories-49"], "isController": false}, {"data": [0.66, 500, 1500, "/rest/s1/landmark/enums-39"], "isController": false}, {"data": [0.685, 500, 1500, "/rest/s1/landmark/localizedMessages-26"], "isController": false}, {"data": [0.68, 500, 1500, "/rest/s1/landmark/categories-48"], "isController": false}, {"data": [0.0, 500, 1500, "/rest/s1/landmark/order-80"], "isController": false}, {"data": [0.0, 500, 1500, "/rest/s1/landmark/products-47"], "isController": false}, {"data": [0.71, 500, 1500, "/rest/s1/landmark/geos-45"], "isController": false}, {"data": [0.0, 500, 1500, "/rest/s1/landmark/register-77"], "isController": false}, {"data": [0.64, 500, 1500, "/rest/s1/landmark/categories?productCategoryIdList=LM_117_FOR-65"], "isController": false}, {"data": [0.67, 500, 1500, "/rest/s1/landmark/order-78"], "isController": false}, {"data": [0.76, 500, 1500, "/rest/s1/landmark/customer/101841-79"], "isController": false}, {"data": [0.0, 500, 1500, "/rest/s1/landmark/order/105143/place-300"], "isController": false}, {"data": [0.64, 500, 1500, "/rest/s1/landmark/enums-41"], "isController": false}, {"data": [0.525, 500, 1500, "/rest/s1/landmark/register-76"], "isController": false}, {"data": [0.87, 500, 1500, "/xoplatform/logger/api/logger-152"], "isController": false}, {"data": [0.625, 500, 1500, "/rest/s1/landmark/geos?geoTypeEnumId=GEOT_SALES_REGION-44"], "isController": false}, {"data": [0.85, 500, 1500, "/xoplatform/logger/api/logger-151"], "isController": false}, {"data": [0.645, 500, 1500, "/rest/s1/landmark/geos/geoAssoc?geoAssocTypeEnumId=&geoId=&toGeoId=-42"], "isController": false}, {"data": [0.376, 500, 1500, "/rest/s1/landmark/moquiSessionToken-24"], "isController": false}, {"data": [0.99, 500, 1500, "/xoplatform/logger/api/logger/-281"], "isController": false}, {"data": [0.49, 500, 1500, "/merchants/vq82m7smjr84ngsp/client_api/v1/payment_methods/paypal_accounts-290"], "isController": false}, {"data": [0.95, 500, 1500, "/xoplatform/logger/api/logger/-288"], "isController": false}, {"data": [0.705, 500, 1500, "/rest/s1/landmark/system/timezone-36"], "isController": false}, {"data": [0.505, 500, 1500, "/rest/s1/landmark/enums?enumId=&enumTypeId=DayOfWeek&parentEnumId=-40"], "isController": false}, {"data": [1.0, 500, 1500, "/xoplatform/logger/api/logger/-282"], "isController": false}, {"data": [0.45, 500, 1500, "/vq82m7smjr84ngsp-142"], "isController": false}, {"data": [0.99, 500, 1500, "/xoplatform/logger/api/logger/-283"], "isController": false}, {"data": [0.52, 500, 1500, "/rest/s1/landmark/order/105143/place-296"], "isController": false}, {"data": [1.0, 500, 1500, "/vq82m7smjr84ngsp-145"], "isController": false}, {"data": [0.17, 500, 1500, "/rest/s1/landmark/geos/geoAssoc-43"], "isController": false}, {"data": [1.0, 500, 1500, "/vq82m7smjr84ngsp-144"], "isController": false}, {"data": [1.0, 500, 1500, "/vq82m7smjr84ngsp-147"], "isController": false}, {"data": [0.79, 500, 1500, "/rest/s1/landmark/enums-51"], "isController": false}, {"data": [1.0, 500, 1500, "/vq82m7smjr84ngsp-146"], "isController": false}, {"data": [0.63, 500, 1500, "/smart/api/payment/BA-3YY27510ML510135N/ectoken-173"], "isController": false}, {"data": [0.63, 500, 1500, "/rest/s1/landmark/products?externalProductId=&externalEnumId=&externalProductCategoryId=&externalCountryId=&externalCityId=&externalTimezoneId=&BCP47LanguageCode=&dayOfWeekSequenceNum=&externalTimezoneGroupId=-46"], "isController": false}, {"data": [1.0, 500, 1500, "/vq82m7smjr84ngsp-149"], "isController": false}, {"data": [0.65, 500, 1500, "*/rest/s1/landmark/order/100479/place-148"], "isController": false}, {"data": [0.7, 500, 1500, "/rest/s1/landmark/system/timezone-34"], "isController": false}, {"data": [0.0, 500, 1500, "/rest/s1/landmark/braintree/generateClientToken-102"], "isController": false}, {"data": [0.53, 500, 1500, "/rest/s1/landmark/geos-61"], "isController": false}, {"data": [0.5, 500, 1500, "/graphql-141"], "isController": false}, {"data": [0.63, 500, 1500, "/rest/s1/landmark/geoCountryCode-60"], "isController": false}, {"data": [0.4, 500, 1500, "/rest/s1/landmark/categories-68"], "isController": false}, {"data": [0.3, 500, 1500, "/rest/s1/landmark/products-62"], "isController": false}, {"data": [0.37, 500, 1500, "/rest/s1/landmark/geoCountryCode-64"], "isController": false}, {"data": [0.46, 500, 1500, "/rest/s1/landmark/geoCountryCode-63"], "isController": false}, {"data": [0.25, 500, 1500, "/rest/s1/landmark/geos-25"], "isController": false}, {"data": [0.69, 500, 1500, "/rest/s1/landmark/enums?enumId=&enumTypeId=ProductCategoryType&parentEnumId=PctProgram-50"], "isController": false}, {"data": [0.695, 500, 1500, "/#/"], "isController": false}, {"data": [0.7, 500, 1500, "/rest/s1/landmark/geos-66"], "isController": false}, {"data": [0.78, 500, 1500, "/rest/s1/landmark/geos-67"], "isController": false}, {"data": [1.0, 500, 1500, "/vq82m7smjr84ngsp-292"], "isController": false}, {"data": [1.0, 500, 1500, "/vq82m7smjr84ngsp-295"], "isController": false}, {"data": [0.48, 500, 1500, "/merchants/vq82m7smjr84ngsp/client_api/v1/paypal_hermes/setup_billing_agreement-172"], "isController": false}, {"data": [0.63, 500, 1500, "/rest/s1/landmark/geos?geoTypeEnumId=GEOT_COUNTRY&pageSize=260-58"], "isController": false}, {"data": [1.0, 500, 1500, "/vq82m7smjr84ngsp-297"], "isController": false}, {"data": [0.0, 500, 1500, "/rest/s1/landmark/order/100479/place-150"], "isController": false}, {"data": [0.87, 500, 1500, "/xoplatform/logger/api/logger-299"], "isController": false}, {"data": [0.86, 500, 1500, "/xoplatform/logger/api/logger-298"], "isController": false}, {"data": [0.95, 500, 1500, "/ts-284"], "isController": false}, {"data": [1.0, 500, 1500, "/xoplatform/logger/api/logger-294"], "isController": false}, {"data": [0.715, 500, 1500, "/rest/s1/landmark/enums?enumId=&enumTypeId=ProductClass&parentEnumId=-38"], "isController": false}, {"data": [1.0, 500, 1500, "/ts-289"], "isController": false}, {"data": [0.57, 500, 1500, "/graphql-175"], "isController": false}, {"data": [0.67, 500, 1500, "/rest/s1/landmark/products?productIdList=100104&externalProductId=-59"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5100, 0, 0.0, 5771.301960784305, 45, 59513, 558.5, 21153.900000000016, 32255.35, 41066.31999999996, 43.58341095738226, 270.7226918017254, 52.24381126246614], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/rest/s1/landmark/timezoneGroup-32", 100, 0, 0.0, 8396.730000000001, 313, 35464, 5280.5, 30978.300000000032, 32604.85, 35462.42, 1.8442358408793318, 2.1048602242129726, 1.1390317531305905], "isController": false}, {"data": ["/vq82m7smjr84ngsp-285", 50, 0, 0.0, 688.5199999999998, 636, 1721, 663.0, 689.9, 764.5499999999994, 1721.0, 0.7989773090444232, 0.2863522191594759, 1.2554243068871844], "isController": false}, {"data": ["*/counter2.cgi-143", 50, 0, 0.0, 601.2000000000002, 489, 1838, 534.0, 594.9, 1575.1, 1838.0, 0.7217923547753782, 0.21075772859163874, 0.3496181718443238], "isController": false}, {"data": ["/rest/s1/landmark/locale-35", 100, 0, 0.0, 4968.91, 280, 33252, 308.5, 16391.100000000002, 31737.8, 33241.70999999999, 1.7477323173182797, 1.0667311507069577, 1.168437565539962], "isController": false}, {"data": ["/rest/s1/landmark/customer/101841-81", 50, 0, 0.0, 13149.279999999999, 5099, 29201, 11474.0, 22286.5, 26491.899999999994, 29201.0, 0.6367317831036854, 0.7450508032371445, 0.40926184082342154], "isController": false}, {"data": ["/rest/s1/landmark/locale-37", 100, 0, 0.0, 3542.73, 398, 32945, 1034.0, 10610.800000000007, 16427.84999999997, 32877.77999999996, 1.6188826471969047, 2.1370357601058747, 1.0273422955351217], "isController": false}, {"data": ["/xoplatform/logger/api/logger-287", 50, 0, 0.0, 353.09999999999985, 329, 862, 335.5, 372.4, 434.1999999999997, 862.0, 0.8026970621287526, 2.5614031897174505, 2.18477835527372], "isController": false}, {"data": ["/rest/s1/landmark/categories-49", 50, 0, 0.0, 9142.880000000003, 3152, 29648, 6801.0, 18513.7, 20303.5, 29648.0, 0.7155635062611807, 33.05850290697674, 0.4564233005366726], "isController": false}, {"data": ["/rest/s1/landmark/enums-39", 100, 0, 0.0, 2876.7400000000016, 285, 17061, 340.0, 11437.200000000003, 15263.249999999993, 17049.999999999993, 1.5199647368181057, 1.1547575846240368, 1.0314534140307945], "isController": false}, {"data": ["/rest/s1/landmark/localizedMessages-26", 100, 0, 0.0, 4497.08, 293, 34963, 395.0, 21593.900000000005, 31829.449999999997, 34961.19, 2.4347487339306584, 12.306751329981495, 1.5297307548329762], "isController": false}, {"data": ["/rest/s1/landmark/categories-48", 50, 0, 0.0, 5517.0999999999985, 278, 25704, 303.5, 17259.5, 21641.24999999997, 25704.0, 1.0023454884429566, 0.6117831350359841, 0.6736074915301806], "isController": false}, {"data": ["/rest/s1/landmark/order-80", 150, 0, 0.0, 22869.040000000005, 8853, 47800, 20034.0, 36015.700000000004, 39239.2, 47011.03000000001, 1.5953373606738706, 0.8964632700161661, 1.242431287490428], "isController": false}, {"data": ["/rest/s1/landmark/products-47", 150, 0, 0.0, 31614.9, 13411, 59513, 33683.0, 44258.8, 45861.49999999999, 59457.92, 1.2870675453047775, 173.81062892555602, 0.9998654612206549], "isController": false}, {"data": ["/rest/s1/landmark/geos-45", 100, 0, 0.0, 2239.7200000000007, 286, 22880, 352.0, 8204.6, 9168.699999999999, 22762.59999999994, 1.3010330202180531, 0.9962177547097396, 0.8637639535791419], "isController": false}, {"data": ["/rest/s1/landmark/register-77", 200, 0, 0.0, 31575.294999999995, 3653, 56235, 32085.0, 39318.200000000004, 52500.1, 54236.280000000006, 3.115119231188574, 2.517801202825413, 7.842677717552139], "isController": false}, {"data": ["/rest/s1/landmark/categories?productCategoryIdList=LM_117_FOR-65", 50, 0, 0.0, 2411.2, 277, 11393, 318.5, 8924.9, 10625.899999999996, 11393.0, 0.6936544490996366, 0.42337307684303993, 0.4890941263075387], "isController": false}, {"data": ["/rest/s1/landmark/order-78", 50, 0, 0.0, 2939.6200000000003, 276, 19667, 302.0, 10229.199999999999, 17767.199999999993, 19667.0, 0.752117209945998, 0.4590559142736804, 0.5120713637013192], "isController": false}, {"data": ["/rest/s1/landmark/customer/101841-79", 50, 0, 0.0, 2332.8399999999997, 279, 23134, 302.0, 10188.3, 14652.399999999981, 23134.0, 0.7605835196762956, 0.4642233396461765, 0.5148645353214987], "isController": false}, {"data": ["/rest/s1/landmark/order/105143/place-300", 50, 0, 0.0, 20546.16, 1663, 36883, 22924.5, 34574.6, 36448.15, 36883.0, 0.8712319219376198, 0.7273084923331591, 1.0489666372625892], "isController": false}, {"data": ["/rest/s1/landmark/enums-41", 100, 0, 0.0, 2364.120000000001, 288, 12002, 357.0, 8676.9, 10130.9, 11993.479999999996, 1.4125690393117964, 1.215912943370107, 0.954491108760753], "isController": false}, {"data": ["/rest/s1/landmark/register-76", 100, 0, 0.0, 3423.11, 282, 38731, 1194.5, 6420.700000000002, 22817.999999999978, 38724.89, 2.3937188816545385, 1.4610100596036, 1.4693085967421484], "isController": false}, {"data": ["/xoplatform/logger/api/logger-152", 50, 0, 0.0, 502.7600000000001, 359, 2853, 404.5, 683.9, 768.5499999999998, 2853.0, 0.7266174504446898, 2.250740127993664, 4.02548905895774], "isController": false}, {"data": ["/rest/s1/landmark/geos?geoTypeEnumId=GEOT_SALES_REGION-44", 100, 0, 0.0, 2801.16, 274, 22460, 312.0, 9181.700000000003, 11559.04999999999, 22425.06999999998, 1.302066379344019, 0.7947182491113397, 0.9089542291116001], "isController": false}, {"data": ["/xoplatform/logger/api/logger-151", 50, 0, 0.0, 495.78, 374, 1162, 438.5, 637.9, 824.3999999999996, 1162.0, 0.7239661763002432, 1.8063804496553924, 0.40793797238793006], "isController": false}, {"data": ["/rest/s1/landmark/geos/geoAssoc?geoAssocTypeEnumId=&geoId=&toGeoId=-42", 100, 0, 0.0, 2761.13, 276, 25786, 304.0, 9176.000000000004, 11493.149999999996, 25653.69999999993, 1.4133676310545136, 0.8626511420010459, 1.004678026020098], "isController": false}, {"data": ["/rest/s1/landmark/moquiSessionToken-24", 250, 0, 0.0, 3968.1479999999997, 286, 38533, 1469.5, 10264.400000000003, 32083.649999999998, 38205.19, 4.702341766199567, 3.5342874188846047, 2.5209878738361704], "isController": false}, {"data": ["/xoplatform/logger/api/logger/-281", 50, 0, 0.0, 339.69999999999993, 322, 558, 330.0, 349.8, 405.0, 558.0, 0.8044922849189877, 2.463459080505543, 1.3372484453186593], "isController": false}, {"data": ["/merchants/vq82m7smjr84ngsp/client_api/v1/payment_methods/paypal_accounts-290", 50, 0, 0.0, 798.3400000000003, 732, 1502, 775.5, 850.2, 873.6499999999999, 1502.0, 0.7975499266254068, 0.9236625087730492, 1.282778055812544], "isController": false}, {"data": ["/xoplatform/logger/api/logger/-288", 50, 0, 0.0, 410.57999999999987, 369, 726, 389.0, 511.29999999999995, 578.0499999999998, 726.0, 0.8020403907540784, 2.5667642231837795, 9.84936929548772], "isController": false}, {"data": ["/rest/s1/landmark/system/timezone-36", 100, 0, 0.0, 3948.77, 289, 31789, 341.5, 12689.400000000003, 25563.049999999937, 31784.85, 1.7466333641905227, 1.0693694544390686, 1.1233547532443715], "isController": false}, {"data": ["/rest/s1/landmark/enums?enumId=&enumTypeId=DayOfWeek&parentEnumId=-40", 100, 0, 0.0, 3972.0699999999993, 277, 22366, 896.5, 11130.300000000003, 12603.199999999997, 22312.379999999972, 1.525017918960548, 0.9307970696780689, 1.0825989021777258], "isController": false}, {"data": ["/xoplatform/logger/api/logger/-282", 50, 0, 0.0, 336.3999999999999, 316, 423, 332.0, 352.7, 383.84999999999985, 423.0, 0.8043628641752868, 2.5756578682775375, 1.3456739354257492], "isController": false}, {"data": ["/vq82m7smjr84ngsp-142", 50, 0, 0.0, 773.8799999999999, 638, 1861, 670.0, 1557.1999999999987, 1694.8999999999999, 1861.0, 0.720876585928489, 0.254841136822376, 1.1129940257352942], "isController": false}, {"data": ["/xoplatform/logger/api/logger/-283", 50, 0, 0.0, 345.76, 315, 861, 330.0, 344.9, 430.29999999999995, 861.0, 0.804608799201828, 2.4634387018843937, 1.3460853770396832], "isController": false}, {"data": ["/rest/s1/landmark/order/105143/place-296", 50, 0, 0.0, 1895.0600000000002, 280, 8787, 880.0, 7216.8, 7846.099999999999, 8787.0, 0.8040265650377089, 0.4907388702622735, 0.5574008383987007], "isController": false}, {"data": ["/vq82m7smjr84ngsp-145", 50, 0, 0.0, 164.04000000000002, 157, 244, 161.0, 172.9, 175.89999999999998, 244.0, 0.7264379839893068, 0.2568071779337198, 1.1393158225457294], "isController": false}, {"data": ["/rest/s1/landmark/geos/geoAssoc-43", 100, 0, 0.0, 4784.11, 767, 18256, 2577.5, 12177.700000000003, 13692.599999999999, 18223.849999999984, 1.2888424905592288, 23.21100858771862, 0.8721083610434469], "isController": false}, {"data": ["/vq82m7smjr84ngsp-144", 50, 0, 0.0, 162.98, 158, 179, 161.0, 169.0, 171.45, 179.0, 0.7263746640517179, 0.2567847933464081, 1.1285762602600422], "isController": false}, {"data": ["/vq82m7smjr84ngsp-147", 50, 0, 0.0, 162.82, 157, 188, 161.0, 171.8, 177.45, 188.0, 0.7265540992182279, 0.2603958539190328, 1.1167931173530181], "isController": false}, {"data": ["/rest/s1/landmark/enums-51", 50, 0, 0.0, 2538.54, 285, 20468, 331.0, 11503.099999999995, 18660.449999999986, 20468.0, 0.7739698461347946, 1.1585058802359058, 0.5378788098665676], "isController": false}, {"data": ["/vq82m7smjr84ngsp-146", 50, 0, 0.0, 163.30000000000004, 158, 196, 160.5, 171.8, 181.39999999999995, 196.0, 0.7263957694710386, 0.2603391087850304, 1.1165497472142722], "isController": false}, {"data": ["/smart/api/payment/BA-3YY27510ML510135N/ectoken-173", 50, 0, 0.0, 760.2199999999997, 434, 1061, 905.5, 967.9, 975.45, 1061.0, 0.8025939837554977, 2.9557874801357986, 0.9248641609682493], "isController": false}, {"data": ["/rest/s1/landmark/products?externalProductId=&externalEnumId=&externalProductCategoryId=&externalCountryId=&externalCityId=&externalTimezoneId=&BCP47LanguageCode=&dayOfWeekSequenceNum=&externalTimezoneGroupId=-46", 100, 0, 0.0, 2226.9000000000005, 276, 12587, 305.5, 7187.9000000000015, 8732.85, 12576.069999999994, 1.5833557642066596, 0.9664036646769163, 1.3448473397643967], "isController": false}, {"data": ["/vq82m7smjr84ngsp-149", 50, 0, 0.0, 164.11999999999998, 157, 181, 161.5, 175.0, 179.45, 181.0, 0.7265329845975007, 0.26038828647195583, 1.154364419863412], "isController": false}, {"data": ["*/rest/s1/landmark/order/100479/place-148", 50, 0, 0.0, 1606.1399999999996, 275, 10311, 364.5, 6480.699999999998, 9006.599999999993, 10311.0, 0.7253419987524117, 0.4427136222854075, 0.5025826708543077], "isController": false}, {"data": ["/rest/s1/landmark/system/timezone-34", 100, 0, 0.0, 4655.41, 277, 33395, 302.5, 20680.9, 31896.449999999997, 33394.99, 1.8593235780822936, 1.1348410510756186, 1.2593830473848613], "isController": false}, {"data": ["/rest/s1/landmark/braintree/generateClientToken-102", 50, 0, 0.0, 13006.000000000002, 5189, 25825, 12091.0, 21555.9, 24489.949999999993, 25825.0, 0.7331485798912007, 1.6252701194299037, 0.5046267403114415], "isController": false}, {"data": ["/rest/s1/landmark/geos-61", 50, 0, 0.0, 3562.44, 291, 19982, 748.5, 12290.1, 15375.649999999974, 19982.0, 0.7225955632632415, 4.468646691415565, 0.49588120528939955], "isController": false}, {"data": ["/graphql-141", 50, 0, 0.0, 558.5000000000001, 518, 1432, 535.5, 564.4, 631.8999999999999, 1432.0, 0.7210429164743886, 0.5912692743784611, 1.3449140336582834], "isController": false}, {"data": ["/rest/s1/landmark/geoCountryCode-60", 50, 0, 0.0, 3469.1799999999994, 277, 18492, 303.5, 11410.9, 12115.099999999995, 18492.0, 0.7741256251064422, 0.4724887848550063, 0.5236990093127313], "isController": false}, {"data": ["/rest/s1/landmark/categories-68", 50, 0, 0.0, 3065.88, 311, 13437, 915.0, 9564.399999999998, 11363.399999999998, 13437.0, 0.6626993068165251, 1.2460947336942836, 0.44459098612970355], "isController": false}, {"data": ["/rest/s1/landmark/products-62", 50, 0, 0.0, 2674.8599999999997, 331, 13756, 1451.5, 6374.099999999999, 11680.149999999996, 13756.0, 0.7436381754093728, 0.4138375494519387, 0.5132410586804884], "isController": false}, {"data": ["/rest/s1/landmark/geoCountryCode-64", 50, 0, 0.0, 3532.08, 369, 13561, 2001.5, 9058.0, 9974.299999999996, 13561.0, 0.6926550854736375, 3.731611630891031, 0.4450173639971739], "isController": false}, {"data": ["/rest/s1/landmark/geoCountryCode-63", 50, 0, 0.0, 2911.1199999999994, 364, 12055, 1108.5, 9366.699999999999, 11338.599999999997, 12055.0, 0.7143163278426219, 3.85813130830607, 0.46935605275940395], "isController": false}, {"data": ["/rest/s1/landmark/geos-25", 100, 0, 0.0, 5587.07, 1158, 36430, 1499.0, 24534.9, 34229.0, 36424.549999999996, 2.482806564540557, 15.841033266504457, 1.2826217506269086], "isController": false}, {"data": ["/rest/s1/landmark/enums?enumId=&enumTypeId=ProductCategoryType&parentEnumId=PctProgram-50", 50, 0, 0.0, 3090.999999999999, 277, 19878, 299.5, 11218.4, 15303.949999999977, 19878.0, 0.7744133818632386, 0.47266441764113687, 0.5646562572601255], "isController": false}, {"data": ["/#/", 100, 0, 0.0, 1252.6299999999999, 45, 11436, 68.5, 4173.6, 7156.3499999999885, 11414.35999999999, 8.70928409684724, 9.636346564187424, 4.652322657202578], "isController": false}, {"data": ["/rest/s1/landmark/geos-66", 50, 0, 0.0, 1898.0999999999995, 296, 9116, 340.0, 8043.799999999997, 8931.949999999999, 9116.0, 0.682081713389264, 4.218115877157083, 0.4582869730918764], "isController": false}, {"data": ["/rest/s1/landmark/geos-67", 50, 0, 0.0, 1764.44, 294, 10712, 369.5, 6473.4, 9834.899999999998, 10712.0, 0.6645136424650797, 4.118751598985953, 0.4465349974416225], "isController": false}, {"data": ["/vq82m7smjr84ngsp-292", 50, 0, 0.0, 162.38000000000002, 157, 184, 162.0, 167.0, 171.35, 184.0, 0.8051789107539695, 0.28857486352217465, 1.265168815823376], "isController": false}, {"data": ["/vq82m7smjr84ngsp-295", 50, 0, 0.0, 165.9, 158, 222, 161.0, 177.6, 209.84999999999994, 222.0, 0.8052696848174453, 0.2886073968046899, 1.2393603742893495], "isController": false}, {"data": ["/merchants/vq82m7smjr84ngsp/client_api/v1/paypal_hermes/setup_billing_agreement-172", 50, 0, 0.0, 1239.0, 1135, 1560, 1209.0, 1310.6, 1512.1999999999998, 1560.0, 0.7978680964462955, 0.869956725629119, 1.367439950452391], "isController": false}, {"data": ["/rest/s1/landmark/geos?geoTypeEnumId=GEOT_COUNTRY&pageSize=260-58", 50, 0, 0.0, 3901.0399999999995, 279, 20334, 313.5, 12524.4, 18361.849999999995, 20334.0, 0.7742454977624305, 0.47256194931788975, 0.5464630772000186], "isController": false}, {"data": ["/vq82m7smjr84ngsp-297", 50, 0, 0.0, 162.9, 157, 187, 160.0, 173.8, 182.14999999999998, 187.0, 0.8053085942533179, 0.2886213418857106, 1.2795284012208479], "isController": false}, {"data": ["/rest/s1/landmark/order/100479/place-150", 50, 0, 0.0, 25363.86, 4020, 42676, 26440.5, 36780.6, 38633.09999999999, 42676.0, 0.6902645093599867, 0.5635497413233751, 0.842284482163565], "isController": false}, {"data": ["/xoplatform/logger/api/logger-299", 50, 0, 0.0, 505.74, 315, 4217, 363.0, 669.6999999999999, 1083.6999999999964, 4217.0, 0.8916788529443236, 2.7618881689820594, 2.1038047936655135], "isController": false}, {"data": ["/xoplatform/logger/api/logger-298", 50, 0, 0.0, 724.28, 391, 11549, 433.0, 748.4999999999999, 1352.249999999997, 11549.0, 0.8023235289398096, 1.9980833243071936, 0.7263221790304722], "isController": false}, {"data": ["/ts-284", 50, 0, 0.0, 447.28, 352, 1482, 388.5, 512.3, 987.2499999999968, 1482.0, 0.8028001669824347, 1.0785118493304646, 2.0085683865322244], "isController": false}, {"data": ["/xoplatform/logger/api/logger-294", 50, 0, 0.0, 354.86, 335, 500, 351.5, 364.8, 373.94999999999993, 500.0, 0.8026712900532974, 2.5619166837234317, 4.261149856723175], "isController": false}, {"data": ["/rest/s1/landmark/enums?enumId=&enumTypeId=ProductClass&parentEnumId=-38", 100, 0, 0.0, 2661.2999999999997, 275, 17046, 300.0, 10288.2, 12617.999999999998, 17003.639999999978, 1.6898742733540626, 1.0314174031702041, 1.2045139974398404], "isController": false}, {"data": ["/ts-289", 50, 0, 0.0, 318.73999999999995, 286, 495, 309.5, 342.3, 416.7999999999997, 495.0, 0.8032128514056225, 1.079034889558233, 1.9366528614457832], "isController": false}, {"data": ["/graphql-175", 50, 0, 0.0, 530.8399999999998, 482, 651, 521.0, 600.3, 613.8, 651.0, 0.8021047227926078, 3.1841050917607805, 1.8329346204440453], "isController": false}, {"data": ["/rest/s1/landmark/products?productIdList=100104&externalProductId=-59", 50, 0, 0.0, 2446.94, 279, 12602, 307.5, 10403.099999999997, 11608.149999999998, 12602.0, 0.7742814667988107, 0.472583903075446, 0.5495130011536794], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5100, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
