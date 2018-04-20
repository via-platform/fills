const {CompositeDisposable, Disposable} = require('via');
const Fills = require('./fills');
const base = 'via://fills';

const InterfaceConfiguration = {
    name: 'Fills',
    description: 'View all a list of recent fills.',
    command: 'fills:create-fills',
    uri: base
};

class FillsPackage {
    activate(state){
        this.disposables = new CompositeDisposable();
        this.fills = [];

        //TODO View fills for a particular market
        this.disposables.add(via.commands.add('via-workspace', 'fills:create-fills', () => via.workspace.open(base)));

        this.disposables.add(via.workspace.addOpener((uri, options) => {
            if(uri === base || uri.startsWith(base + '/')){
                const fills = new Fills({uri});

                this.fills.push(fills);

                return fills;
            }
        }, InterfaceConfiguration));
    }

    deactivate(){
        for(const fill of fills){
            fill.destroy();
        }

        this.disposables.dispose();
        this.disposables = null;
    }
}

module.exports = new FillsPackage();
