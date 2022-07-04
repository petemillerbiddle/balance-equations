class Substance {
    constructor(elements, isReactant, coefficient = 1) {
        this.elements = elements; //array of element objects
        this.isReactant = isReactant; //boolean
        this.coefficient = coefficient; //integer
    }
}

class Element {
    constructor(element, subscript) {
        this.element = element;
        this.subscript = subscript;
    }
}

class Equation {
    substances = [];
}


let elem1 = new Element('O', 2);
let elem2 = new Element('H', 2);
let elem3 = new Element('H', 2);
let elem4 = new Element('O', 1);

let subst1 = new Substance([elem1], true);
let subst2 = new Substance([elem2], true);
let subst3 = new Substance([elem3, elem4], false);

let eqn = new Equation();
eqn.substances = [subst1, subst2, subst3];

console.log(eqn);
console.log(eqn.substances[2].elements[1].subscript)
