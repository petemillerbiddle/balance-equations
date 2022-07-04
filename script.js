class Element {
    constructor(element, subscript = 1) {
        this.element = element;
        this.subscript = subscript;
    }
}

class Substance {
    constructor(elements, isReactant, coefficient = 1) {
        this.elements = elements;
        this.isReactant = isReactant;
        this.coefficient = coefficient;
    }
    countAtoms() {
        //TODO take element as arg?
        //could be in substance multiple times
    }
}

class Equation {
    constructor(substances) {
        this.substances = substances
    }
    isBalanced() {
        //TODO write logic here
        console.log('return boolean = ifbalanced')
    }
    balanceEquation() {
        //TODO write balancing algo
    }
}

let elem1 = new Element('O', 2);
let elem2 = new Element('H', 2);
let elem3 = new Element('H', 2);
let elem4 = new Element('O');

let subst1 = new Substance([elem1], true);
let subst2 = new Substance([elem2], true);
let subst3 = new Substance([elem3, elem4], false);

let eqn = new Equation([subst1, subst2, subst3]);

console.log(eqn);
console.log(eqn.substances[2].elements[1].subscript)

eqn.isBalanced();
