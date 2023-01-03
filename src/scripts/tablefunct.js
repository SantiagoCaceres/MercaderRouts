class DataTable{
    element;
    headers;
    items;
    copyItems;
    selected;
    pagination;
    numberOfEntries;
    headerButtons;

    constructor(selector, headerButtons){
        this.element=document.querySelector(selector);
        this.headers=[];
        this.items=[];
        this.pagination={total:0,
            noItemsPerPage:0,
            noPages:0,
            actual:1,
            pointer:0,
            diff:0,
            lastPageBeforeDots:0,
            noButtonsBeforeDots:3
        };

        this.selected=[];
        this.numberOfEntries=6;
        this.headerButtons=headerButtons;
    }

    parse(){
        const headers= [...this.element.querySelector('thead tr').children];
        const trs=[...this.element.querySelector('tbody').children];
        headers.forEach(element =>{
            this.headers.push(element.textContent)
        });

        trs.forEach(element =>{
            const cells =[...element.children];

            const item ={
                id: this.generateUUID(),
                values: []
            };
            cells.forEach(cell =>{
                item.values.push(cell.textContent);
            });
            this.items.push(item)
        });
        /*console.log(this.items);*/

        this.makeTable();
    }

    makeTable(){
        this.copyItems=[...this.items];
        this.initPagination(this.items.length,this.numberOfEntries);

        const container=document.createElement('div');
        container.id= this.element.id;
        this.element.innerHTML='';
        this.element.replaceWith(container);
        this.element=container;

        this.createHTML();
        this.renderHeaders();
        this.renderRows();
        this.renderPagesButtons();
        this.renderHeaderButtons();
        this.renderSearch();
        this.renderSelectEntries();
    }
    initPagination(total,entries){
        this.pagination.total=total;
        this.pagination.noItemsPerPage=entries;
        this.pagination.noPages=Math.ceil(this.pagination.total/this.pagination.noItemsPerPage);
        this.pagination.actual=1;
        this.pagination.pointer=0;
        this.pagination.diff=this.pagination.noItemsPerPage - (this.pagination.total % this.pagination.noItemsPerPage);

    }
    generateUUID(){
        return(Date.now()*Math.floor(Math.random()*100000)).toString();
    }

createHTML(){
    this.element.innerHTML=`
        <div class="datatable-container">
    <div class="header-tools">
        <h1 id="titulo">¡Albion Merchant Data!</h1>
        <div class="tools">
            <ul class="header-buttons-container"></ul>
        </div>
        <div class="search">
            <input type="text" class="search-input">
        </div>
    </div>
    <table class="datatable">
        <thead>
            <tr>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <div class="footer-tools">
        <div class="list-items">
            Show
            <select name="n-entries" id="n-enties" class="n-entries">
            </select>
            entries
        </div>
        <div class="pages"> 
        
        </div>
    </div>
</div>
`;
}
renderHeaders(){
    this.element.querySelector('thead tr').innerHTML='';
    
    this.headers.forEach(header =>{
        console.log(header);
        this.element.querySelector('thead tr').innerHTML +=`<th>${header}</th>`;
    });
}

renderRows(){
    this.element.querySelector('tbody').innerHTML='';

    let i =0;
    const {pointer, total}=this.pagination;
    const limit = this.pagination.actual * this.pagination.noItemsPerPage;

    for(i = pointer; i < limit;i++){
        if(i===total)break;
        const {id,values}=this.copyItems[i];
        let data ='';
        values.forEach(cell =>{
            data +=`<td>${cell}</td>`
        });
        this.element.querySelector('tbody').innerHTML +=`<tr>${data}</tr>`;
    }
}
renderPagesButtons(){
    const pagesContainer=this.element.querySelector('.pages');
    let i=this.pagination.actual;
    let pages='';
    console.log(this.pagination.noPages)
    if(this.pagination.noPages===1){
        pages +=`<li><span class="active">${i}</span></li>`;
    }
    else if(i>1 && i<this.pagination.noPages){
        pages +=`<li><button class="BtnFun" data-page="${i-1}">Prev</button></li>`
        pages +=`<li><span class="active">${i}</span></li>`;
        pages +=`<li><button class="BtnFun" data-page="${i+1}">Next</button></li>`
    }else if(i===1){
        pages +=`<li><span unselectable="on" class="relleno">Prev</span></li>`;
        pages +=`<li><span class="active">${i}</span></li>`;
        pages +=`<li><button class="BtnFun" data-page="${i+1}">Next</button></li>`
    }else if(i===this.pagination.noPages){
        pages +=`<li><button class="BtnFun" data-page="${i-1}">Prev</button></li>`
        pages +=`<li><span class="active">${i}</span></li>`;
        pages +=`<li><span unselectable="on"class="relleno">Next</span></li>`;
    }
        
    pagesContainer.innerHTML=`<ul>${pages}</ul>`;

    this.element.querySelectorAll('.pages li button').forEach(button =>{
        button.addEventListener('click',e=>{
            this.pagination.actual=parseInt(e.target.getAttribute('data-page'));
            this.pagination.pointer=(this.pagination.actual * this.pagination.noItemsPerPage)-this.pagination.noItemsPerPage;
            this.renderRows();
            this.renderPagesButtons();
        });
    });
}


renderHeaderButtons(){
    let html='';
    const buttonsContainer=this.element.querySelector('.header-buttons-container');
    const headerButtons=this.headerButtons;
    headerButtons.forEach(button =>{
        html +=`<li><button id="${button.id}"><span class="material-symbols-outlined">${button.icon}</span></button></li>`
    });
    buttonsContainer.innerHTML=html;
}
renderSearch(){
    this.element.querySelector('.search-input').addEventListener('input',e=>{
        const query=e.target.value.trim().toLowerCase();
        if(query===''){
            this.copyItems=[...this.items]
            this.initPagination(this.copyItems.length,this.numberOfEntries);
            this.renderRows();
            this.renderPagesButtons();
            return;
        }
        this.search(query);
    });
}
search(query){
    let res=[];

    this.copyItems=[...this.items];

    for(let i=0; i<this.copyItems.length;i++){
        const {id,values}=this.copyItems[i];
        const row=values;
        for(let j=0; j<row.length;j++){
            const cell=row[j];

            if(cell.toLowerCase().indexOf(query)>=0){
                res.push(this.copyItems[i]);
                break
            }
        }
    }
    this.copyItems=[...res];

    this.initPagination(this.copyItems.length,this.numberOfEntries);
    this.renderRows();
    this.renderPagesButtons();
}
renderSelectEntries() {
    const select = this.element.querySelector("#n-enties");

    const html = [4,6,8].reduce((acc, item) => {
        return (acc += `<option value="${item}" ${this.numberOfEntries === item ? "selected" : ""
        }>${item}</option>`);
    }, '');

    select.innerHTML = html;

    this.element.querySelector("#n-enties").addEventListener("change", (e) => {
            const numberOfEntries = parseInt(e.target.value);
            this.numberOfEntries = numberOfEntries;

            this.initPagination(
                this.copyItems.length,
                this.numberOfEntries
            );
            this.renderRows();
            this.renderPagesButtons();
            this.renderSearch();
        });
}
}