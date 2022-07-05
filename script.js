class Element {
    constructor(symbol, subscript = 1) {
        this.symbol = symbol;
        this.subscript = subscript;
    }
}

class Substance {
    constructor(elements, isReactant, coefficient = 1) {
        this.elements = elements;
        this.isReactant = isReactant;
        this.coefficient = coefficient;
    }
    countAtoms(element) { 
        let sum = 0;
        Array.from(this.elements).forEach(elem => {
            if (elem.symbol == element) sum += elem.subscript * this.coefficient;
        });
        return sum;
    }
}

class Equation {
    constructor(substances) {
        this.substances = substances
        this.setOfElements = this.elementSet()
    }
    elementSet() {
        const rctsSet = new Set();
        const prodSet = new Set();
        Array.from(this.substances).forEach(substance => {
            if (substance.isReactant) {
                substance.elements.forEach(element => rctsSet.add(element.symbol));
            }
            else substance.elements.forEach(element => prodSet.add(element.symbol));
        });
        if (this.setsAreEqual(rctsSet, prodSet)) return rctsSet;
        else {
            console.log('not same reactancts and products');
            return false;
        }
    }
    setsAreEqual(r, p) {
        if (r.size !== p.size) {
            return false;
        }
        return Array.from(r).every(element => {
            return p.has(element);
        });
    }
    isBalanced() {
        let balanced = true;
        Array.from(this.setOfElements).forEach(symbol => {
            let sumReactants = 0;
            let sumProducts = 0;
            Array.from(this.substances).forEach(substance => {
                if (substance.isReactant) sumReactants += substance.countAtoms(symbol);
                else sumProducts += substance.countAtoms(symbol);
            })
            if (sumReactants != sumProducts) {
                balanced = false;
                console.log(symbol + ' is not balanced');
            }       
        })
        return balanced;
    }
}

function balance(equation) {
        //TODO write balancing algo
        //solve system of equations?
    }

function test1() {
    let elem1 = new Element('O', 2);
    let elem2 = new Element('H', 2);
    let elem3 = new Element('H', 2);
    let elem4 = new Element('O');

    let subst1 = new Substance([elem1], true);
    let subst2 = new Substance([elem2], true);
    let subst3 = new Substance([elem3, elem4], false);

    let eqn = new Equation([subst1, subst2, subst3]);
}
