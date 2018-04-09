const {CompositeDisposable, Disposable} = require('via');
const Fills = require('./fills');
const base = 'via://fills';

const InterfaceConfiguration = {
    name: 'Fills',
    description: 'View all a list of recent fills.',
    command: 'fills:open',
    uri: base
};

class FillsPackage {
    activate(state){
        this.disposables = new CompositeDisposable();
        this.fills = new Fills(state);

        this.disposables.add(via.commands.add('via-workspace', {
            'fills:toggle': () => this.toggle(),
            'fills:open': () => via.workspace.open(base),
            'fills:focus': () => document.querySelector('.fills').focus()
        }));

        via.workspace.open(this.fills, {activateItem: false, activatePane: false})
        .then(() => {
            const paneContainer = via.workspace.paneContainerForURI(this.fills.getURI());

            if(paneContainer){
                paneContainer.show();
            }
        });
    }

    deactivate(){
        this.disposables.dispose();

        if(this.fills){
            this.fills.destroy();
        }
    }
}

module.exports = new FillsPackage();
