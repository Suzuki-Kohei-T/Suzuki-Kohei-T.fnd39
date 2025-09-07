let selectedFile;
let inputFile;

document.getElementById('fileInput').addEventListener('change', function(event) {
    selectedFile = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(selectedFile);
    reader.addEventListener('load', function() {
        // console.log(reader.result);
        // console.log(JSON.parse(reader.result));
        inputFile = JSON.parse(reader.result);
        // console.log(inputFile);
        document.getElementById('userName').textContent = inputFile.name;
        testClick();
    })
});

// document.getElementById("test").addEventListener("click",testClick);
document.getElementById("selectDay").addEventListener("change",dayChange);
document.getElementById("tableArea").addEventListener("change", (e) => {
    changePass(e);
});
const radios = document.getElementsByName("selectScope");
for (const radio of radios) {
  radio.addEventListener('change', changeALLorDAY);
}

function testClick(e){
    // console.log("test button clicked");
    const tableAll = document.getElementById("tableAll");
    tableAll.className = "table";
    const tr = document.createElement("tr");
    const title = ["Day","Title","Level","Progress"];
    const titleWidth = [10,40,25,25];
    for(let i=0;i<title.length;i++){
        const th = document.createElement("th");
        th.textContent = title[i];
        th.style.width = `${titleWidth[i]}%`;
        tr.appendChild(th);
    }
    tableAll.appendChild(tr);
    const days = getValue(inputFile.item,"day");
    const passedPerDay = [];
    createSelect(days);
    for(const day of days){
        const rows = getRows(inputFile.item,"day",day);
        // console.log(rows);
        createTable(rows);
        passedPerDay.push(countPassPerDay(rows));
        const titles = getValue(rows,"title");
        for(const title of titles){
            const rowsTitle = getRows(rows,"title",title);
            // console.log(rowsTitle);
            createTableAll(rowsTitle);
        }
    }
    const selectedDay = document.getElementById("selectDay").value
    const selectedTable = document.getElementById(`table${selectedDay}`);
    // console.log(selectedTable);
    selectedTable.style.display = "table";
    // console.log(document.getElementById("userNameArea"));
    document.getElementById("userNameArea").style.display = "flex";
    document.getElementById("buttons").style.display = "flex";
    createGraph(days,passedPerDay);
}

function getValue(array,target){
    const uniqueArr = [];
    for(const item of array){
        if(uniqueArr.includes(item[target])){ 
        }else{
            uniqueArr.push(item[target]);
        }
    }
    // console.log(uniqueArr);
    return uniqueArr;
}

function getRows(objects,target,value){
    return objects.filter((object) => object[target] === value);
}

function filterArray(array,key,value){
    const selectedArray = array.filter(
        (item) => item[key] === value
    )
    // console.log(selectedArray);
    return selectedArray;
}

function createSelect(arr){
    const pullDown = document.getElementById("selectDay");
    for(const item of arr){
        let option = document.createElement("option");
        option.text = item;
        option.value = item;
        pullDown.appendChild(option);
    }
}

function createTableAll(day){
    const tableAll = document.getElementById("tableAll");
    const titles = getValue(day,"title"); //タイトルの種類を取得
    // console.log(titles);
    for(const title of titles){
        const titleRows = getRows(day,"title",title); //同じタイトルの要素を取得
        const levels = getValue(titleRows,"level"); //レベルの種類を取得
        // console.log(levels);
        for(const level of levels){
            const parts = getRows(day,"level",level); //同じレベルの要素を取得
            const tr = document.createElement("tr");
            let passCount = 0;
            for(const part of parts){
                if(part.pass === 1){
                    passCount++;
                }
            }
            for(i=0;i<4;i++){
                const td = document.createElement("td");
                // console.log(Object.keys(parts[0])[i]);
                if(i===3){
                    const parcent = new Intl.NumberFormat(
                        'ja', { style: 'percent'}).format(passCount / parts.length
                    );
                    td.textContent = parcent;
                    td.id = `${title}${level}`;
                    if(parcent === "100%"){
                        td.className = "complete";
                    } else {
                        td.className = "progress";
                    }
                } else {
                    td.textContent = parts[0][Object.keys(parts[0])[i]];
                }
                tr.appendChild(td);
            }
            tableAll.appendChild(tr);
            // console.log(parts.length);
        }
    }
    tableLine(tableAll);
}

function createTable(rows){
    const tableArea = document.getElementById("tableArea");
    // console.log(tableArea);
    const table = document.createElement("table");
    table.id = `table${rows[0].day}`;
    table.className = "table";
    const tr = document.createElement("tr");
    const title = ["Day","Title","Level","Part","Pass"];
    const titleWidth = [10,40,20,10,20];
    for(let i=0;i<title.length;i++){
        const th = document.createElement("th");
        th.textContent = title[i];
        th.style.width = `${titleWidth[i]}%`;
        tr.appendChild(th);
    }
    table.appendChild(tr);
    for(const item of rows){
        const tr = document.createElement("tr");
        // console.log(tr);
        for(let i=0;i<Object.values(item).length-1;i++){
            const td = document.createElement("td");
            // console.log(td);
            if(i === Object.values(item).length -2){
                const input = document.createElement("input");
                input.type = "checkbox";
                const id = Object.values(item)[Object.values(item).length -1];
                input.id = id;
                // input.onchange = "changePass(id)"
                if(Object.values(item)[i] === 1){
                    input.checked = true;
                }
                td.appendChild(input);
                tr.appendChild(td);

            } else {
                td.textContent = Object.values(item)[i];
                tr.appendChild(td); 
            }
        }
        table.appendChild(tr);
    }
    tableArea.appendChild(table);
    table.style.display = "none";
    tableLine(table);
}

function tableLine(targetTable){
    const rows = targetTable.rows;
    for(i=2;i<rows.length;i++){
        const preCells = rows[i-1].cells;
        const cells = rows[i].cells;
        for(j=0;j<cells.length-2;j++){
            if(cells[j].textContent === preCells[j].textContent){
                preCells[j].classList.add("tableUnique");
                cells[j].classList.add("tableSame");
            }
        }
    }
}

function dayChange(){
    const selectDay = document.getElementById("selectDay").value;
    // console.log(selectDay);
    const tables = document.querySelectorAll("table[id]");
    // console.log(tables);
    for(const table of tables){
        table.style.display = "none";
    }
    document.getElementById(`table${selectDay}`).style.display = "table";
}

function changePass(checkBox){
    // const pass = document.getElementById(id);
    // console.log(checkBox.target.id);
    for(const item of inputFile.item){
        // console.log(item.id);
        if(item.id == checkBox.target.id){
            if(checkBox.target.checked){
                item.pass = 1;
            } else {
                item.pass = 0;
            }
            // console.log(item);
            break;
        }
    }
    const passItem = getRows(inputFile.item,"id",parseInt(checkBox.target.id))[0];
    const days = getRows(inputFile.item,"day",passItem.day);
    const titles = getRows(days,"title",passItem.title);
    const levels = getRows(titles,"level",passItem.level);
    let passCount = 0;
    for(const level of levels){
        if(level.pass === 1){
            passCount++;
        }
    }
    const parcent = new Intl.NumberFormat(
        'ja', { style: 'percent'}).format(passCount / levels.length
    );
    const td = document.getElementById(`${passItem.title}${passItem.level}`);
    td.textContent = parcent;
    if(parcent === "100%"){
        td.className = "complete";
    } else {
        td.className = "progress";
    }
    const targetDayIndex = chart.data.labels.indexOf(passItem.day);
    chart.data.datasets[0].data[targetDayIndex] = countPassPerDay(days);
    chart.update();
    // console.log("checkChanged");
}

function changeALLorDAY(){
    // console.log("radio");
    const radios = document.getElementsByName("selectScope");
    let selectedValue;
    for(const radio of radios) {
        if (radio.checked) {
        selectedValue = radio.value;
        break;
        }
    }
    const tableAll = document.getElementById("tableAll");
    // console.log(tableAll);
    const tableDay = document.getElementById("tableArea");
    const buttons = document.getElementById("selectDay");
    if(selectedValue === "all"){
        tableAll.style.display = "table";
        tableDay.style.display = "none";
        buttons.style.display = "none";
    } else {
        tableAll.style.display = "none";
        tableDay.style.display = "table";
        buttons.style.display = "flex";
    }
}

function countPassPerDay(rows){
    let passCount = 0;
    for(const row of rows){
        if(row.pass === 1){
            passCount++;
        }
    }
    return Math.round((passCount / rows.length)*100);
}

const textarea = document.querySelector('textarea')
document.getElementById('writeButton').addEventListener('click', async () => {
    if (!selectedFile) {
            alert('ファイルを選択してください');
            return;
    }
    inputFile.name = textarea.value;
    const opts = {
        suggestedName: textarea.value,
        types: [{
            description: "Json file",
            accept: {"application/json": [".json"]},
        }]
    };
    const handle = await window.showSaveFilePicker(opts);
    const writable = await handle.createWritable();
    await writable.write(JSON.stringify(inputFile, null, 4));
    await writable.close();
});

function createGraph(days,passedPerDay){
    const ctx = document.getElementById("myChart").getContext("2d");
    window.chart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: days,
            datasets: [{
                label: "達成度",
                backgroundColor: "rgb(173, 216, 230)",
                borderColor: "rgb(173, 216, 230)",
                data: passedPerDay,
            }]
        },
        options: {
            scales:{
                y:{
                    max: 100
                }
            }
        }
    });
}
