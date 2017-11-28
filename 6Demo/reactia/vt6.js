"use strict";

class App extends React.Component {
    constructor(props) {
        super(props);
        let joukkueenNimetLaske = function () {
            let nimet = [];
            for(let i of data.joukkueet){
                nimet.push(i.nimi);
            }
            return nimet;
        };

        //this.joukkueenNimet = joukkueenNimetLaske();
        let laskeSarjat = function () {
            let nimet = [];
            for(let i of data.sarjat){
                nimet.push({header:"", nimi:i.nimi});
            }
            nimet[0].header = "Sarjat";
            return nimet;
        };
        let sarjaOnSenPituus = function () {
            let mappi = {};
            for (let sarja of data.sarjat){

                mappi[sarja.id.toString()]= sarja["nimi"].toString();
            }
            for (let joukkue of data.joukkueet){
                if (joukkue["sarja"].toString() in mappi) {
                    joukkue["sarja"] = mappi[joukkue["sarja"].toString()];
                }
                else{
                    joukkue["sarja"] = null;
                }

            }

        };

        sarjaOnSenPituus();
        this.sarjat = laskeSarjat();//data.sarjat;
        this.kisa = data.kisatiedot;
        this.rastit = data.rastit;
        this.newData = {};
        this.state = {
            joukkueet: data.joukkueet,
            joukkueenNimet: joukkueenNimetLaske(),
            nimi: "",
            jasenet: [],
            sarja: "",
            luontiaika: "",
            leimausTapa: []
            //"sarjat": sarjat
        };


    }

    alter(data){
        let tempJoukkueet = this.state.joukkueet;
        tempJoukkueet.push(data);
        let tempNimet = this.state.joukkueenNimet;
        tempNimet.push(data.nimi);
        this.setState({
            joukkueet: tempJoukkueet,
            joukkueenNimet: tempNimet
        });
        console.log(this.state.joukkueet);
        console.log(this.state.joukkueenNimet)
    }

    setUpforCustomisation(joukkueNew){
        this.setState({
            nimi: joukkueNew.nimi,
            jasenet: joukkueNew.jasenet,
            sarja: joukkueNew.sarjat,
            luontiaika: joukkueNew.luontiaika,
            leimausTapa: joukkueNew.leimausTapa
        });
        let tempJoukkueet = this.state.joukkueet;
        for (let i=0; i<tempJoukkueet.length; i++){
            if (tempJoukkueet[i].nimi===joukkueNew.nimi)
                tempJoukkueet.splice(i,1)
        }
        let tempNimet = this.state.joukkueenNimet;
        for (let i=0; i<tempNimet.length; i++){
            if (tempNimet[i]===joukkueNew.nimi)
                tempNimet.splice(i,1)
        }
        this.setState({
            joukkueet: tempJoukkueet,
            joukkueenNimet: tempNimet
        });


    }
    render() {
        return (
            <div>
                <div className="sideways"><LisaaJoukkue
                    nimi={this.state.nimi}
                    jasenet={this.state.jasenet}
                    sarja={this.state.sarja}
                    luontiaika={this.state.luontiaika}
                    leimausTapa={this.state.leimausTapa}
                    sarjat={this.sarjat}
                    joukkueenNimet={this.state.joukkueenNimet}
                    lisaa={this.alter.bind(this)
                    }/>
                </div>
                <div className="sideways"><ListaaJoukkueet customise={(joukkueNew) => this.setUpforCustomisation(joukkueNew)} joukkueenNimet={this.state.joukkueenNimet} joukkueData={this.state.joukkueet}/></div>

            </div>
        );
    }
}

class ListaaJoukkueet extends React.Component {
    constructor(props) {
        super(props);
    }

    courier(joukkueNew) {
        this.props.customise(joukkueNew);
    }

    render() {
        return (
            <div>
                <fieldset>
                    <h2>Joukkueet</h2>
                    <ul>{
                        this.props.joukkueData.map((item) => <Joukkue customise={(joukkueNew) => this.courier(joukkueNew)} key={item.nimi} data={item}/>)
                    }</ul>
                </fieldset>
            </div>
        )
    }
}

class Joukkue extends React.Component {
    constructor(props) {
        super(props);
    }
    //key={item}
    moveToCustomisation(){
        this.props.customise(this.props.data);
    }
    render() {
        return (
               <li>
                   <a onClick={this.moveToCustomisation.bind(this)} href="#" >{this.props.data.nimi}</a>
                   <div>{this.props.data.sarja} ({this.props.data.leimaustapa.map((item) => <div key={item} className="inline"> {item} </div>)})</div>
                   <ul>{this.props.data.jasenet.map((jasen) => <li key={jasen}>{jasen}</li>)}</ul>
               </li>
        );


    }
}


/*
{this.props.item.nimi["sarja"]} {this.props.item.leimausTapa}



                     <ul>{
                        this.props.joukkueenNimet.map((item) => <li key={item} >{item}</li>)
                    }</ul>

            jasen1: "",
            jasen2: "",
            jasen3: "",
            jasen4: "",
            jasen5: "",
*/


class LisaaJoukkue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            nimi: this.props.nimi,
            jasenet: this.props.jasenet,
            sarja: this.props.sarja,
            luontiaika: this.props.luontiaika,
            leimausTapa: this.props.leimausTapa,
        };
    }
    componentWillReceiveProps(nextProps){
        if  (this.props !== nextProps){
            this.setState({
                nimi: nextProps.nimi,
                jasenet: nextProps.jasenet,
                sarja: nextProps.sarja,
                luontiaika: nextProps.luontiaika,
                leimausTapa: nextProps.leimausTapa,
            });
        }
    }

    nameCheck(evt) {
        this.setState({
            nimi: evt.target.value
        });
    }

    leimausValidate(evt) {
        let temp = this.state.leimausTapa;
        temp.push(evt.target.value);
        this.setState({
            leimausTapa: temp
        });
    }

    buttonClick(evt) {

        if (this.state.nimi.trim()===""){
                alert("Empty name is not fit");
            return;
        }

        for (let joukkuenimi of this.props.joukkueenNimet){
            if (this.state.nimi.trim().toLowerCase()===joukkuenimi.trim().toLowerCase()){
                    alert("Name Already used");
                return;
            }
        }

        if (this.state.jasenet.length < 2) {
            alert("Not enough members");
            return;
        }

        if (this.state.leimausTapa.length === 0) {
            alert("you need to choose at least one leimaustapa?");
            return;
        }

        let nimi = null;
        let luontiaika = null;
        let leimausTapa = null;
        let sarja = null;
        if (this.state.nimi!=="")  nimi = this.state.nimi;
        if (this.state.luontiaika!=="")  luontiaika = this.state.luontiaika;
        if (this.state.leimausTapa!==[])  leimausTapa = this.state.leimausTapa;
        if (this.state.sarja!=="")  sarja = this.state.sarja;

        let newData = {
            "nimi": nimi,
            "jasenet": this.state.jasenet,
            "sarja": sarja,
            "seura": null,
            "id": null,
            "rastit": null,
            "pisteet": null,
            "matka": null,
            "leimausTapa": leimausTapa,
            "luontiaika": luontiaika,
        };

        this.props.lisaa(newData);
        this.setState({
            leimausTapa : "",
            luontiaika : "",
            sarja : "",
            nimi : "",
            jasenet: []
        });

        //todo eliminoi laatikot
    }

    sarjaVaihtui(id) {
        this.setState({
                sarja: id
        });
    }

    timeCheck(evt) {
        this.setState({
            luontiaika: evt.target.value
        });
    }

    onChangeJasenet(newJasenet){
        this.setState({
            jasenet: newJasenet
        })
    }

    render() {
        return (
            <div>
                <fieldset>
                    <h1>Lisää Joukkue</h1>
                    <form>
                        <fieldset id="kentta">
                            <legend>Joukkueen tiedot</legend>
                            <div className="padding"><label>Nimi</label>                                             <input value={this.state.nimi} className="rightBox" id="jNimi" onChange={(evt) => this.nameCheck(evt)} type="text" /></div>
                            <div className="paddingBottom"><label>Luontiaika</label>                                 <input value={this.state.luontiaika} className="rightBox" id="jLuontiaika"  type="datetime-local" required max="2017-06-01T01:00" onChange={(evt) => this.timeCheck(evt)}/></div>

                            <div className="listPadding"><label>Leimaustapa</label>         <label className="right">GPS     <input value="GPS" className="checkboxes" id="jGPS" onChange={(evt) => this.leimausValidate(evt)} type="checkbox"/></label></div>
                            <div className="listPadding">                                   <label className="right">NFC     <input value="NFC" className="checkboxes" id="jNFC" onChange={(evt) => this.leimausValidate(evt)} type="checkbox"/></label></div>
                            <div className="listPadding">                                   <label className="right">QR      <input value="QR" className="checkboxes" id="jQR" onChange={(evt) => this.leimausValidate(evt)} type="checkbox"/></label></div>
                            <div className="listPaddingBottom">                             <label className="right">Lomake  <input value="Lomake" className="checkboxes" id="jLomake" onChange={(evt) => this.leimausValidate(evt)} type="checkbox"/></label></div>

                            <Sarja sarjat={this.props.sarjat} chosen={(evt) => this.sarjaVaihtui(evt)}/>
                        </fieldset>
                    </form>
                    <fieldset>
                        <legend>Jäsenet</legend>
                        <Jasenet changeJasenet={(data) => this.onChangeJasenet(data)}/>
                    </fieldset>
                    <p>
                        <button name="tallenna" onClick={this.buttonClick.bind(this)} id="tallenna">Tallenna</button>
                    </p>
                </fieldset>
            </div>
        );
    }
}

class Jasenet extends React.Component {
    constructor(props){
        super(props);
        this.max = 5;
        this.state = {
            jasenet: ["","","","",""],
            fields: [{n:1, text:""}, {n:2, text:""}]
        };
    }
    /*
    componentWillReceiveProps(nextProps){
        if  (this.props !== nextProps){
            let temp = [];
            console.log(nextProps);
            for (let i = 0; i<5; i++){
                nextProps.jasenet.push("");
                temp.push(nextProps.jasenet[i]);
            }
        }
            this.setState({
                jasenet: temp,
            });
        }
*/
    submitData(){
        let list = [];
        for (let jasen of this.state.jasenet){
            if (jasen!== "") {
                list.push(jasen);
            }
        }
        this.props.changeJasenet(list);
    }

    evaluatechildren(n, input) {
        let temp = this.state.jasenet;
        temp[n-1] = input;
        this.setState({
           jasenet: temp
       }, this.submitData);


        for (let i=0; i<this.state.fields.length; i++){
            if (this.state.jasenet[i] === "") {
                return;
            }

        }
        if (this.state.fields.length<this.max) {
            temp = this.state.fields;
            let tempN = this.state.fields.length + 1;
            temp.push({n:tempN, text:""});
            this.setState({
                fields: temp
            })
        }
    }

    render() {
        return(<div>
            {
                this.state.fields.map((item) =>
                    <Jasen key={item.n} n={item.n} nimi={item.text} evaluatechildren={this.evaluatechildren.bind(this)}/>)
            }
            </div>
        );
    }

}
class Jasen extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            nimi: this.props.nimi
        }
    }

    jasenValidate(evt) {
        this.setState({
            nimi: evt.target.value
        });
        console.log("nimi on " + evt.target.value);

        this.props.evaluatechildren(this.props.n, evt.target.value);

    }

    render() {
        return(
            <div className="padding">
                <label id={this.props.n}>
                    Jäsen {this.props.n}
                </label>
                <input value={this.state.nimi} className="rightBoxName" onChange={(evt) => this.jasenValidate(evt)} type="text"/>
            </div>
        );
    }
}

class Sarja extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            chosen: ""
        }
    }

    radio(evt){
    this.props.chosen(evt.target.id)
    }

    render() {
        return (
            <div>
                {this.props.sarjat.map((sarja) =>
                    <div key={sarja["nimi"]} className="listPadding">
                        {sarja.header}
                        <label className="right">
                            {sarja["nimi"]}
                            <input name="sarjat" className="sarjaRadio" id={sarja["nimi"]} onChange={this.radio.bind(this)} type="radio"/>
                        </label>
                    </div>)}
            </div>
        );
    }
}

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);

//let elem = {header:"",nimi:""};
//this.lista.map((item) => <p key={item.key}>{item.kissa}{item.jaakko}</p>)
//this.props.sarjat.map((nimi, id) => <li key={id} >{nimi}</li>)
//{this.props.sarjat.map((nimi, id) => <li key={id} >{nimi}</li>)} //tämäkö ref:ffikö???
/*
    jasen1Validate(evt) {
        this.setState({
            jasen1: evt.target.value
        });
    }
    jasen2Validate(evt) {
        this.setState({
            jasen2: evt.target.value
        });
    }
    jasen3Validate(evt) {
        this.setState({
            jasen3: evt.target.value
        });
    }
    jasen4Validate(evt) {
        this.setState({
            jasen4: evt.target.value
        });
    }
    jasen5Validate(evt) {
        this.setState({
            jasen5: evt.target.value
        });
    }

            let jasenet = [];
        if (this.state.jasen1!=="") jasenet.push(this.state.jasen1);
        if (this.state.jasen2!=="") jasenet.push(this.state.jasen2);
        if (this.state.jasen3!=="") jasenet.push(this.state.jasen3);
        if (this.state.jasen4!=="") jasenet.push(this.state.jasen4);
        if (this.state.jasen5!=="") jasenet.push(this.state.jasen5);

        console.log(jasenet);


                        <div className="padding"><label id="Jasen1">Jäsen 1 </label><input value={this.state.jasen1} className="rightBoxName" onChange={(evt) => this.jasen1Validate(evt)} type="text"/></div>
                        <div className="padding"><label id="Jasen2">Jäsen 2 </label><input value={this.state.jasen2} className="rightBoxName" onChange={(evt) => this.jasen2Validate(evt)} type="text"/></div>
                        <div className="padding"><label id="Jasen3">Jäsen 3 </label><input value={this.state.jasen3} className="rightBoxName" onChange={(evt) => this.jasen3Validate(evt)} type="text"/></div>
                        <div className="padding"><label id="Jasen4">Jäsen 4 </label><input value={this.state.jasen4} className="rightBoxName" onChange={(evt) => this.jasen4Validate(evt)} type="text"/></div>
                        <div className="padding"><label id="Jasen5">Jäsen 5 </label><input value={this.state.jasen5} className="rightBoxName" onChange={(evt) => this.jasen5Validate(evt)} type="text"/></div>
 */
/*
,
        "joukkueenNimet": "joukkueidenNimet"

later={this.alter}
data={this.props.joukkueidenNimet}



value={state.luontiaika}
        this.State({
        nimi: "",
        lunotiaika: "",
        leimausTapa: "",
        sarja: "",
        jasenet:[]
    })
        joukkueValidate() {
    //this.setState

}



 */
/*

    list(){
    let list = [];

    for (let elem of this.props.sarjat) {
        list.push({header: "", nimi: elem.nimi})
    }
    list[0].header = "sarjat";
    console.log(list);
    return list;
};
function(){
        let list = [];

        for (elem of this.props.sarjat) {
            list.push({header: "", nimi: elem.nimi})
        }
        list[0].header = "sarjat";
        console.log(list);
        return list;
    };
addChild() {
    // State change will cause component re-render
    this.setState(this.state.concat([
        {id:2,name:"Another Name"}
    ]))
}
*/

