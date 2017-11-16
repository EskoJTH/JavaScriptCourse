"use strict";

class App extends React.Component {
    constructor(props) {
        super(props);
        this.kisa = data.kisatiedot;
        this.rastit = data.rastit;
        this.state = {
            "joukkueet": data.joukkueet
        };
    }

    joukkueValidate() {

    }

    nameCheckLite(){

    }

    leimausValidate(){

    }

    buttonClick(){

    }

    render() {
        return (
             <div>
                <form>
                    <fieldset id="kentta">
                        <div className="padding"><label>Nimi</label>                                             <input className="rightBox" id="jNimi" onKeyUp={this.joukkueValidate} type="text"/></div>
                        <div className="paddingBottom"><label>Luontiaika</label>                                 <input className="rightBox" id="jLuotiaika"  type="datetime-local" required max="2017-06-01T01:00"/></div>

                        <div className="listPadding"><label>Leimaustapa</label>         <label className="right">GPS     <input className="checkboxes" id="jGPS" onChange={this.leimausValidate} type="checkbox"/></label></div>
                        <div className="listPadding">                                   <label className="right">NFC     <input className="checkboxes" id="jNFC" onChange={this.leimausValidate} type="checkbox"/></label></div>
                        <div className="listPadding">                                   <label className="right">QR      <input className="checkboxes" id="jQR" onChange={this.leimausValidate} type="checkbox"/></label></div>
                        <div className="listPaddingBottom">                             <label className="right">Lomake  <input className="checkboxes" id="jLomake" onChange={this.leimausValidate} type="checkbox"/></label></div>

                        <Sarja/>
                    </fieldset>
                </form>
                <fieldset>
                    <legend>Jäsenet</legend>
                <div className="padding"><label id="Jasen1">Jäsen 1 </label><input className="rightBoxName" onKeyUp={this.nameCheckLite} type="text" value=""/></div>
                <div className="padding"><label id="Jasen2">Jäsen 2 </label><input className="rightBoxName" onKeyUp={this.nameCheckLite} type="text" value=""/></div>
                <div className="padding"><label id="Jasen3">Jäsen 3 </label><input className="rightBoxName" onKeyUp={this.nameCheckLite} type="text" value=""/></div>
                <div className="padding"><label id="Jasen4">Jäsen 4 </label><input className="rightBoxName" onKeyUp={this.nameCheckLite} type="text" value=""/></div>
                <div className="padding"><label id="Jasen5">Jäsen 5 </label><input className="rightBoxName" onKeyUp={this.nameCheckLite} type="text" value=""/></div>
                </fieldset>
                <p>
                    <button name="tallenna" onClick={this.buttonClick} id="tallenna">Tallenna</button>
                </p>
             </div>
        );
    }
}

class Sarja extends React.Component {
    Constructor(props){
        this.sarjat = data.sarjat;
    }
    render() {
        return (
            <div>den websidanren fungerar inte på här</div>
            //this.props.sarjat.map((nimi, id) => <li key={id} >{nimi}</li>)
        );
    }
}
//{this.props.sarjat.map((nimi, id) => <li key={id} >{nimi}</li>)} //tämäkö ref:ffikö???

ReactDOM.render(
    <App/>,
    document.getElementById('root')
);


