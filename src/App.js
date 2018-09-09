import React from 'react';
import { Input, NumericTextBox } from '@progress/kendo-react-inputs';
import _ from 'lodash';
import '@progress/kendo-theme-default/dist/all.css';
import 'bootstrap/dist/css/bootstrap.min.css';

class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      income : 0,
      efkaRate : 0.2695,
      taxRate : 0.22,
      efka : 0,
      taxes : 0,
      visible : 0,
      disabled : false,
      calcEfkaOk : false,
      calcTaxesOk : false,
      calcTotalsOk : false,
      blackMoney : 0,
      beforeNet : 0,
      finalNet : 0,
      formatOptions: {
                style: 'currency',
                currency: 'EUR',
                currencyDisplay: 'symbol'
            }
  }
}

calculateEfka = () => {
const income = _.cloneDeep(this.state.income)
const efkarate = _.cloneDeep(this.state.efkaRate)
const visible = _.cloneDeep(this.state.visible)
  this.setState({
    efka : income<=586 ? _.floor(586*efkarate,2) : _.floor(visible*efkarate,2),
    calcEfkaOk : true
  });
}

calculateTaxes = () => {
  const income = _.cloneDeep(this.state.income)
  const visible = _.cloneDeep(this.state.visible)
  const efka = _.cloneDeep(this.state.efka)
  const taxrate = _.cloneDeep(this.state.taxRate)
    this.setState({
      taxes : income<=586 ? _.floor((income-efka)*taxrate,2) : _.floor((visible-efka)*taxrate,2),
      beforeNet : _.floor(income-efka,2),
      calcTaxesOk : true
    });

}

calculateTotals = () =>{
  const income = _.cloneDeep(this.state.income)
  const visible = _.cloneDeep(this.state.visible)
  const efka = _.cloneDeep(this.state.efka)
  const taxes = _.cloneDeep(this.state.taxes)
  this.setState({
    blackMoney : income-visible<0 ? 0 : _.floor(income-visible,2) ,
    finalNet : _.floor(income-taxes-efka,2),
    calcTotalsOk : true
  });
}

resetAll = () => {
  this.setState({
    income : 0,
    efkaRate : 0.2695,
    taxRate : 0.22,
    efka : 0,
    taxes : 0,
    visible : 0,
    disabled : false,
    calcEfkaOk : false,
    calcTaxesOk : false,
    calcTotalsOk : false,
    blackMoney : 0,
    beforeNet : 0,
    finalNet : 0,
  })
}


  handleChangeIncome = (event) => {
    if (event.target.value<586) {
    this.setState({
      income : event.target.value,
      disabled : true,
      visible : 586
    });
  }
  else{
    this.setState({
      income : event.target.value,
      disabled : false,
      visible : 586
    });
  }
  }

  handleChangeRate = (event) => {
    this.setState({
      efkaRate : event.target.value
    })
  }

  handleChangeTaxRate = (event) => {
    this.setState({
      taxRate : event.target.value
    })
  }

  handleChangeVisible = (event) => {
    this.setState({
      visible : event.target.value
    })
  }

render() {

  return (
          <div className="row" style={{"backgroundColor":"#f1d7f8"}}>
            <div className="col-lg-8">
            <h4> Please insert your Income and Visible money (for income 586+ only) :</h4>

            <label className="col-lg-2"> Income : </label>

              <NumericTextBox min={0} step={20} name={'income'} format={this.state.formatOptions} onChange={this.handleChangeIncome} value={this.state.income}/>

            <label className="col-lg-2">Visible :</label>
              <NumericTextBox min={0} disabled={this.state.disabled} format={this.state.formatOptions} name={'visble'} onChange={this.handleChangeVisible} value={this.state.visible}/>
            <br/>
            <h4> Modify rates (optional) : </h4>

              <label className="col-lg-2"> Efka Rate :  </label>
                <NumericTextBox disabled={this.state.calcEfkaOk} format="p2" min={0} step={0.01} max={0.99} name={'efkaRate'} onChange={this.handleChangeRate} value={this.state.efkaRate}/>


              <label className="col-lg-2"> Tax Rate :</label>
                <NumericTextBox disabled={this.state.calcEfkaOk} format="p2" min={0} step={0.01} max={0.99} name={'taxRate'}onChange={this.handleChangeTaxRate} value={this.state.taxRate}/>

              <br/>
              <br/>
              {this.state.income>0 ?
            <div className="k-button-group">

              <button className="k-button k-default" onClick={this.calculateEfka}>Calculate Efka</button>

              <button className="k-button k-primary" onClick={this.calculateTaxes}>Calculate Taxes</button>

              <button className="k-button k-default" onClick={this.calculateTotals}>Calculate Totals</button>

            </div>
              : null}
            <br/>
          </div>
          {this.state.calcEfkaOk ?
            <div className="col-lg-4" style={{"backgroundColor":"#f6f1db"}}>



              {this.state.calcEfkaOk ?
              <div>
              <h4>Calculated Efka : {this.state.efka +'\u20AC'}</h4>
              </div>
              : null }


               {this.state.calcTaxesOk ?
               <div>
               <h4>Calculated Taxes : {this.state.taxes + '\u20AC'}</h4>
               <h4>Net Amount before Taxes : {this.state.beforeNet + '\u20AC'}</h4>
               </div>
               : null }


               {this.state.calcTotalsOk ?
               <div>
               <h4>Final Net Amount : {this.state.finalNet + '\u20AC'}</h4>
               <h4>White Money : {this.state.visible + '\u20AC'}</h4>
               <h4>Black Money : {this.state.blackMoney + '\u20AC'}</h4>
               <h4>Money Lost : {_.floor(((this.state.income-this.state.finalNet)/this.state.income)*100,2)}% </h4>
               </div>
               : null }
              <br />
              <button className="k-button k-default" onClick={this.resetAll}>Reset</button>

       </div>
       : null}
     </div>
    );
  }

}

export default App;
