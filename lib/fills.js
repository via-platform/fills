"use babel";
/** @jsx etch.dom */

const {Disposable, CompositeDisposable} = require('via');
const etch = require('etch');
const ViaTable = require('via-table');
const base = 'via://fills';
const moment = require('moment');

module.exports = class Fills {
    constructor(state){
        this.disposables = new CompositeDisposable();

        this.columns = [
            {
                name: 'market',
                title: 'Market',
                default: true,
                accessor: o => o.market.title()
            },
            {
                name: 'side',
                title: 'Side',
                default: true,
                accessor: o => o.side === 'buy' ? 'Buy' : 'Sell'
            },
            {
                name: 'amount',
                title: 'Amount',
                default: true,
                accessor: o => `${o.amount.toFixed(o.market.precision.amount)} ${o.market.base}`
            },
            {
                name: 'price',
                title: 'Price',
                default: true,
                accessor: o => o.price ? `${o.price.toFixed(o.market.precision.price)} ${o.market.quote}` : '-'
            },
            {
                name: 'fees',
                title: 'Fees',
                default: true,
                accessor: o => o.fee ? `${o.fee.cost} ${o.market.quote}` : '-'
            },
            {
                name: 'date',
                title: 'Date',
                default: true,
                accessor: o => o.date ? moment(o.date).format('YYYY-MM-DD HH:mm:ss') : '-'
            }
        ];

        etch.initialize(this);

        this.disposables.add(via.orders.onDidCreateOrder(this.update.bind(this)));
        this.disposables.add(via.orders.onDidUpdateOrder(this.update.bind(this)));
        this.disposables.add(via.orders.onDidDestroyOrder(this.update.bind(this)));
    }

    destroy(){
        this.disposables.dispose();
        etch.destroy(this);
    }

    update({order, property, value}){
        console.log(property)
        if(property === 'fills'){
            etch.update(this);
        }
    }

    render(){
        const fills = via.orders.fills();

        console.log('Updated', fills)

        return (
            <div className='orders panel-body'>
                <ViaTable columns={this.columns} data={fills}></ViaTable>
            </div>
        );
    }

    getDefaultLocation(){
        return 'bottom';
    }

    getPreferredLocation(){
        return this.getDefaultLocation();
    }

    isPermanentDockItem(){
        return false;
    }

    getTitle(){
        return 'Fills';
    }

    getURI(){
        return base;
    }
}
