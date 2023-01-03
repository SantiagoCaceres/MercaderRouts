const puppeteer=require("puppeteer");

function enlaces(material,Listas){
    const direc ="https://www.albiononline2d.com/en/item/id/T";
    for(var i=3;i<9;i++){
        Listas[material].push(direc+i+"_"+material);
    }
    return Listas;
}

function Cal_B_Prof(precios){

    const keys=Object.keys(precios);
    const resultados={};
    for(let key of keys){
        const ppc=Object.values(precios[key]);
        const ppck=Object.keys(precios[key]);
        for(var i=0;i<ppc.length;i++){
            ppc[i]=parseInt(ppc[i]);
        }
        const max=Math.max(...ppc);
        const min=Math.min(...ppc);
        const gain=max-min;
        const profit=(max-min)*100/min;
        const ruta="From "+String(ppck[ppc.indexOf(min)])+ " to "+String(ppck[ppc.indexOf(max)]);
        resultados[key]={};
        resultados[key].ppu=min;
        resultados[key].gain=gain;
        resultados[key].profit=parseFloat(profit.toFixed(2));
        resultados[key].ruta=ruta;
        
    }
    return resultados;
}

async function Get_Data(url,page){
    await page.goto(url);
    await page.waitForSelector('tbody#market-table-body');
    const tabla = await page.evaluate(() => {
        const elements = document.querySelector('#market-table-body')
        return elements.innerText;
    });
    return tabla;

}

function deleteLocations(par){
    par[0]=par[0].replace("MorganasRest",'1');
    par[0]=par[0].replace("ArthursRest",'1');
    par[0]=par[0].replace("FortSterlingPortal",'1');
    par[0]=par[0].replace("ThetfordPortal",'1');
    par[0]=par[0].replace("MartlockPortal",'1');
    par[0]=par[0].replace("BridgewatchPortal",'1');
    par[0]=par[0].replace("CaerleonPortal",'1');
    par[0]=par[0].replace("LymhurstPortal",'1');
    par[0]=par[0].replace("MerlynsRest",'1');
    
    return par;
}

function WebScraper(){
const Listas={ CLOTH:[],METALBAR:[],FIBER:[],HIDE:[],LEATHER:[],ORE:[],PLANKS:[],STONEBLOCK:[],WOOD:[]}
const materiales=Object.keys(Listas);

var direcciones=undefined;
for(let material of materiales){
    direcciones=enlaces(material,Listas);
}

const ListaDirecciones=Object.keys(direcciones);

var datos= (async ()=>{
    const browser = await puppeteer.launch({
        headless: true,
        defaultViewport: {
            width: 1200,
            height: 600
        },
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

   
    const page = await browser.newPage();
    var datos=[];
    var cont=3;
    var cont1=1;
    var cont2=0;
    for(let direccion of ListaDirecciones){
        cont2=cont2+direcciones[direccion].length;
    }

    for(let direccion of ListaDirecciones){
        
        for(var i=0; i<direcciones[direccion].length;i++){
        datos.push("T"+cont+"_"+direccion+"\n"+(await Get_Data(direcciones[direccion][i],page)));
        
        console.clear();
        var progress="Progreso: "+(cont1*100/(cont2)).toFixed(2)+"%"+"  "+cont1+"/"+cont2;
        console.log("Progreso: "+(cont1*100/(cont2)).toFixed(2)+"%"+"  "+cont1+"/"+cont2);
        cont++;cont1++;
        if (cont==9){
            cont=3;
        }
    }
    }
  
    var ListaAuxiliar=[];
    const PPC={};
    for(let dato of datos){
        dato=dato.trim();
        ListaAuxiliar=dato.split('\n');
        var material=ListaAuxiliar[0];
        PPC[material]={};
        ListaAuxiliar.shift();
        for(let par of ListaAuxiliar){
            par=par.split(':\t');
            par[0]=par[0].replace(/\s/g, '');
            par=deleteLocations(par);
            if( isNaN(parseInt(par[0]))){
            par[1]=par[1].replace(',','');
            PPC[material][par[0]]=parseInt(par[1]);}
        }
    
    }
    await page.waitForTimeout(1000);
    const date=Cal_B_Prof(PPC);
    /*console.log(date);*/
    await browser.close();
    return date;
   
})();

return datos;
}

/*const tablas=await WebScraper()*/

module.exports=WebScraper;